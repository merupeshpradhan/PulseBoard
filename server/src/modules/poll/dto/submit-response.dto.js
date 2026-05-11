import Joi from "joi";

class SubmitResponseDto {
  static schema = Joi.object({
    answers: Joi.array()
      .items(
        Joi.object({
          questionId: Joi.string().required(),

          selectedOption: Joi.string().required(),
        }),
      )
      .required(),
  });
}

export default SubmitResponseDto;
