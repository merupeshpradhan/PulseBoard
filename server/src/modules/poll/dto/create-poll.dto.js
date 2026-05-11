import Joi from "joi";

class CreatePollDto {
  static schema = Joi.object({
    title: Joi.string().required(),

    description: Joi.string().allow(""),

    allowAnonymous: Joi.boolean(),

    expiresAt: Joi.date().required(),

    questions: Joi.array()
      .items(
        Joi.object({
          question: Joi.string().required(),

          required: Joi.boolean(),

          options: Joi.array().items(Joi.string()).min(2).required(),
        }),
      )
      .min(1)
      .required(),
  });
}

export default CreatePollDto;
