import Joi from "joi";

class RegisterDto {
  static schema = Joi.object({
    name: Joi.string().required(),

    email: Joi.string().email().required(),

    password: Joi.string().min(6).required(),
  });
}

export default RegisterDto;
