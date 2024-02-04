import { Response } from "express";

abstract class AbstractResponse {
  protected statusCode: number;
  protected message: string;

  constructor(message: string, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }

  abstract send(res: Response): void;
}

export default AbstractResponse;
