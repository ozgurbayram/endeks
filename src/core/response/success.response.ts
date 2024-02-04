import { Response } from "express";
import AbstractResponse from "./abstract.response";

class SuccessResponse extends AbstractResponse {
  public data?: Record<string, unknown>;

  constructor(
    data?: Record<string, unknown>,
    message?: string,
    statusCode?: number
  ) {
    super(message || "Success", statusCode || 200);
    this.data = data;
  }

  send(res: Response<any, Record<string, any>>): void {
    res.status(this.statusCode).json({
      message: this.message,
      status: this.statusCode,
      data: this.data,
    });
  }
}

export default SuccessResponse;
