import { Body, JsonController, Post, UseBefore } from "routing-controllers";
import { IsAuthenticated } from "../../../core/middlewares/authentication.middleware";
import { EndeksRequest } from "../requests/endeks.request";
import EndeksService from "../services/endeks.service";
import SuccessResponse from "../../../core/response/success.response";

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
  public async create(@Body() { issued_at, value }: EndeksRequest) {
    const endeks = await this.endeksService.storeEndeks({ issued_at, value });

    return new SuccessResponse({ endeks });
  }
}

export default EndeksController;
