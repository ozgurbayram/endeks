import { Body, JsonController, Post, Req, UseBefore } from "routing-controllers";
import { IsAuthenticated } from "../../../core/middlewares/authentication.middleware";
import { EndeksRequest } from "../requests/endeks.request";
import EndeksService from "../services/endeks.service";
import SuccessResponse from "../../../core/response/success.response";
import { Request } from "express";

@JsonController("/endeks")
@UseBefore(IsAuthenticated)
class EndeksController {
  private endeksService: EndeksService;

  constructor() {
    this.endeksService = new EndeksService();
  }

  /**
   * create endeks
   */
  @Post("/create")
  public async create(@Req() request: Request, @Body() { issued_at, value }: EndeksRequest) {
    if (!request.user) {
      return;
    }

    const endeks = await this.endeksService.storeEndeks({ issued_at, value, userId: request.user as number });

    return new SuccessResponse({ endeks });
  }
}

export default EndeksController;
