import AbstractException from "../../../core/exception/abstract.exception";
import { User } from "../../user/entities/user.entity";
import jwt from "jsonwebtoken";

class TokenService {
  public async generateUserTokens(
    user: User
  ): Promise<{ access_token: string; refresh_token: string }> {
    const access_token = await this.generateAccessToken(user);
    const refresh_token = await this.generateRefreshToken(user);

    return {
      access_token: access_token.token,
      refresh_token: refresh_token.token,
    };
  }

  /**
   *  generateAccessToken
   */
  public async generateAccessToken(user: User): Promise<{ token: string }> {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = jwt.sign(payload, "token-secret", {
      expiresIn: 60000,
    });

    return {
      token: accessToken,
    };
  }

  /**
   * generateRefreshToken
   */
  public async generateRefreshToken(user: User): Promise<{ token: string }> {
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const refreshToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
      expiresIn: 6000,
    });

    return {
      token: refreshToken,
    };
  }

  /**
   * isValidToken
   */
  public async verifyToken(token: string) {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

    if (!decoded) {
      throw new AbstractException("Invalid token", 400);
    }

    return decoded;
  }
}

export default TokenService;
