import { Repository } from "typeorm";
import Consumption from "../entities/consumption.entity";
import { AppDataSource } from "../../../integrations/database";

class ConsumptionRepository extends Repository<Consumption> {
  constructor() {
    super(Consumption, AppDataSource.manager);
  }
}

export default ConsumptionRepository;
