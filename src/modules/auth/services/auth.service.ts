import { isEmpty } from "lodash";
import UserNotFoundException from "../exceptions/userNotFound.exception";
import AbstractException from "../../../core/exception/abstract.exception";
import UserRepository from "../../user/repositories/user.repository";
import TokenService from "./token.service";
import { Request, Response } from "express";
import passport from "passport";
import { User } from "../../user/entities/user.entity";

class AuthService {
  private userRepo: UserRepository;
  private tokenService: TokenService;

  constructor() {
    this.userRepo = new UserRepository();
    this.tokenService = new TokenService();
  }

  public async verifyCredentials(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email } });

    if (isEmpty(user)) {
      throw new UserNotFoundException();
    }

    const isPasswordCorrect = await user.validatePassword(password);

    if (!isPasswordCorrect) {
      throw new AbstractException("Password is incorrect", 400);
    }

    return user;
  }

  public async authenticateUser(body: {
    email: string;
    password: string;
  }): Promise<{ user: User | null; info?: { message: string } }> {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "local",
        (err: Error, user: User, info: { message: string }) => {
          if (err) {
            reject(err);
          } else if (!user) {
            resolve({ user: null, info });
          } else {
            resolve({ user });
          }
        }
      )({ body: body } as Request, {} as Response, () => {});
    });
  }

  /**
   * loginViaPasswordGrant
   */
  public async loginViaPasswordGrant(email: string, password: string) {
    const { user } = await this.authenticateUser({ email, password });
    if (!user) {
      return new AbstractException("Invalid credentials");
    }

    const tokens = await this.tokenService.generateUserTokens(user);

    return { user, tokens };
  }

  /**
   * refreshToken
   */
  public async refreshToken(token: string) {
    const decoded = await this.tokenService.verifyToken(token);
    const { userId } = decoded as Record<string, unknown>;
    const user = await this.userRepo.findOne({
      where: { id: userId as number },
    });

    if (!user) {
      throw new AbstractException("User not found", 404);
    }

    const data = this.tokenService.generateUserTokens(user);

    return data;
  }
}

export default AuthService;
