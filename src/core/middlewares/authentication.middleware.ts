import { Request, Response, NextFunction } from "express";
import { ExpressMiddlewareInterface } from "routing-controllers";
import jwt, { JwtPayload } from "jsonwebtoken";

export class IsAuthenticated implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const decoded = jwt.verify(token, "token-secret");
      req.user = {
        id: (decoded as JwtPayload).userId,
        email: (decoded as JwtPayload).email,
      };

      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  }
}
