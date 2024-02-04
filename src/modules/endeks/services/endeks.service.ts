import moment from "moment";
import AbstractException from "../../../core/exception/abstract.exception";
import ConsumptionRepository from "../repositories/consumption.repository";
import EndeksRepository from "../repositories/endeks.repository";
import Endeks from "../entities/endeks.entity";
import { DATE_FORMAT } from "../../../core/constants/common.constant";

class EndeksService {
  private endeksRepository: EndeksRepository;
  private consumptionRepository: ConsumptionRepository;

  constructor() {
    this.endeksRepository = new EndeksRepository();
    this.consumptionRepository = new ConsumptionRepository();
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

  public async upsertConsumption(issued_at: string, consumptionPerDay: number) {
    const hasConsumption = await this.consumptionRepository.findOneBy({ issued_at });

    if (hasConsumption) {
      await this.consumptionRepository.update(hasConsumption.id, {
        value: consumptionPerDay,
      });

      return;
    }

    await this.consumptionRepository.save({
      issued_at,
      value: consumptionPerDay,
    });
  }

  /**
   * calculateConsumptions
   */
  public async calculateConsumptions(current: Endeks, last: Endeks) {
    if (current.issued_at > last.issued_at) {
      const { consumptionPerDay, dates } = this.getCalculationValues(current, last);
      for (const date of dates) {
        await this.upsertConsumption(date, consumptionPerDay);
      }
    }

    const nextEndeksAfterCurrent = await this.endeksRepository
      .createQueryBuilder()
      .where("issued_at > :issued_at", { issued_at: current.issued_at })
      .orderBy("issued_at", "DESC")
      .limit(1)
      .getOne();

    if (nextEndeksAfterCurrent) {
      const { consumptionPerDay, dates } = this.getCalculationValues(nextEndeksAfterCurrent, current);

      for (const date of dates) {
        await this.upsertConsumption(date, consumptionPerDay);
      }
    }
  }

  /**
   * storeEndeks
   */
  public async storeEndeks({ issued_at, value }: { issued_at: string; value: number }) {
    const isEndeksExist = await this.endeksRepository.findOneBy({ issued_at });

    if (isEndeksExist) {
      throw new AbstractException("Endeks at given date is exist");
    }

    const lastEndeks = await this.endeksRepository
      .createQueryBuilder()
      .where("issued_at < :issued_at", { issued_at })
      .orderBy("issued_at", "DESC")
      .limit(1)
      .getOne();

    if (lastEndeks && lastEndeks.value > value) {
      throw new AbstractException("Given endeks value cannot be lower than previous endeks value");
    }

    const endeks = await this.endeksRepository.save({ issued_at, value });

    if (lastEndeks) {
      this.calculateConsumptions(endeks, lastEndeks);
    }

    return endeks;
  }
}

export default EndeksService;
