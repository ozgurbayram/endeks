import AbstractException from "../../../core/exception/abstract.exception";
import { RegisterRequest } from "../../auth/requests/auth.requests";
import { User } from "../entities/user.entity";
import UserRepository from "../repositories/user.repository";

class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  /**
   * createUser
   */
  public async createUser({
    email,
    password,
    password_confirm,
  }: RegisterRequest) {
    const isExist = await this.userRepo.findOne({
      where: { email: email },
    });

    if (isExist) {
      throw new AbstractException("User already exist", 400);
    }

    if (password !== password_confirm) {
      throw new AbstractException("Password Mismatch", 400);
    }

    const user = new User();

    user.email = email;

    await user.setPassword(password);

    await this.userRepo.save(user);

    return user;
  }
}

export default UserService;
