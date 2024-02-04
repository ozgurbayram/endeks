import AbstractException from "../../../core/exception/abstract.exception";

class UserNotFoundException extends AbstractException {
  constructor() {
    super("User not found", 400);
  }
}

export default UserNotFoundException;
