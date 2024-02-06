import moment from "moment";
import AbstractException from "../../../core/exception/abstract.exception";
import ConsumptionRepository from "../repositories/consumption.repository";
import EndeksRepository from "../repositories/endeks.repository";
import Endeks from "../entities/endeks.entity";
import { DATE_FORMAT } from "../../../core/constants/common.constant";
import UserRepository from "../../user/repositories/user.repository";
import UserNotFoundException from "../../auth/exceptions/userNotFound.exception";
import { User } from "../../user/entities/user.entity";

class EndeksService {
  private endeksRepository: EndeksRepository;
  private consumptionRepository: ConsumptionRepository;
  private userRepository: UserRepository;

  constructor() {
    this.endeksRepository = new EndeksRepository();
    this.consumptionRepository = new ConsumptionRepository();
    this.userRepository = new UserRepository();
  }

  /**
   * getCalculationValues
   */
  public getCalculationValues(firstEndeks: Endeks, secondEndeks: Endeks) {
    const totalConsumption = Number(firstEndeks.value) - Number(secondEndeks.value);

    const dayDiff = moment.duration(moment(firstEndeks.issued_at).diff(secondEndeks.issued_at)).asDays();

    const consumptionPerDay = totalConsumption / dayDiff;

    const dates = Array.from({ length: dayDiff }, (_, index) =>
      moment(firstEndeks.issued_at)
        .subtract(index + 1, "days")
        .format(DATE_FORMAT)
    ).reverse();

    return { consumptionPerDay, dates };
  }

  public async upsertConsumption(issued_at: string, consumptionPerDay: number, user: User) {
    const hasConsumption = await this.consumptionRepository.findOneBy({ issued_at, user });

    if (hasConsumption) {
      await this.consumptionRepository.update(hasConsumption.id, {
        value: consumptionPerDay,
        user,
      });

      return;
    }

    await this.consumptionRepository.save({
      issued_at,
      value: consumptionPerDay,
      user,
    });
  }

  /**
   * calculateConsumptions
   */
  public async calculateConsumptions(current: Endeks, last: Endeks, user: User) {
    if (current.issued_at > last.issued_at) {
      const { consumptionPerDay, dates } = this.getCalculationValues(current, last);

      for (const date of dates) {
        await this.upsertConsumption(date, consumptionPerDay, user);
      }
    }

    const nextEndeksAfterCurrent = await this.endeksRepository
      .createQueryBuilder()
      .where("issued_at > :issued_at", { issued_at: current.issued_at })
      .where("user_id = :user_id", { user_id: user.id })
      .orderBy("issued_at", "DESC")
      .limit(1)
      .getOne();

    if (nextEndeksAfterCurrent) {
      const { consumptionPerDay, dates } = this.getCalculationValues(nextEndeksAfterCurrent, current);

      for (const date of dates) {
        await this.upsertConsumption(date, consumptionPerDay, user);
      }
    }
  }

  /**
   * storeEndeks
   */
  public async storeEndeks({ issued_at, value, userId = 1 }: { issued_at: string; value: number; userId?: number }) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new UserNotFoundException();
    }

    const isEndeksExist = await this.endeksRepository
      .createQueryBuilder()
      .where("issued_at = :issued_at", { issued_at })
      .andWhere("user_id = :user_id", { user_id: user.id })
      .getOne();

    if (isEndeksExist) {
      throw new AbstractException("Endeks at given date is exist");
    }

    const lastEndeks = await this.endeksRepository
      .createQueryBuilder()
      .where("issued_at < :issued_at", { issued_at })
      .where("user_id = :user_id", { user_id: user.id })
      .orderBy("issued_at", "DESC")
      .limit(1)
      .getOne();

    if (lastEndeks && lastEndeks.value > value) {
      throw new AbstractException("Given endeks value cannot be lower than previous endeks value");
    }

    const endeks = await this.endeksRepository.save({ issued_at, value, user });

    if (lastEndeks) {
      this.calculateConsumptions(endeks, lastEndeks, user);
    }

    return endeks;
  }
}

export default EndeksService;
