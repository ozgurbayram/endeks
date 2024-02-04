class AbstractException extends Error {
  status: number;

  constructor(
    message: string = "Internal Server Error",
    status: number = 500,
    description = ""
  ) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    this.message = message || description;
  }
}

export default AbstractException;
