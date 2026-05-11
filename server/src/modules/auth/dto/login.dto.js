import Joi from "joi";

class LoginDto {
  static schema = Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().required(),
  });
}

export default LoginDto;
