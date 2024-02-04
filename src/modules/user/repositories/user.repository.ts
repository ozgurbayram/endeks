import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../../../integrations/database";

class UserRepository extends Repository<User> {
  constructor() {
    super(User, AppDataSource.manager);
  }
}

export default UserRepository;
