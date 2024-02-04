import { Request, Response } from "express";
import SuccessResponse from "../../../core/response/success.response";
import UserService from "../services/user.service";
import { Get, JsonController, UseBefore } from "routing-controllers";
import { IsAuthenticated } from "../../../core/middlewares/authentication.middleware";

@JsonController("/user")
@UseBefore(IsAuthenticated)
class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  @Get("/me")
  public async me(req: Request, res: Response) {
    return new SuccessResponse({}, "me worked", 200).send(res);
  }
}

export default UserController;
