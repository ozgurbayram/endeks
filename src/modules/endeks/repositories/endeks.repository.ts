import { Repository } from "typeorm";
import Endeks from "../entities/endeks.entity";
import { AppDataSource } from "../../../integrations/database";

class EndeksRepository extends Repository<Endeks> {
  constructor() {
    super(Endeks, AppDataSource.manager);
  }
}

export default EndeksRepository;
