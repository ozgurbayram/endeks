import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { Request, Response, NextFunction } from "express";

@Middleware({ type: "after" })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, req: Request, res: Response, next: NextFunction): void {
    const status = error.httpCode || 500;
    const message = error.message || "Internal Server Error";

    res.status(status).json({
      status,
      message,
      ...error,
    });
  }
}
