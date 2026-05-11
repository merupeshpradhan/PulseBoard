import ApiError from "../utils/api-error.js";

const validate = (DtoClass) => {
  return (req, res, next) => {
    const { error, value } = DtoClass.schema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw ApiError.badRequest(error.details.map((e) => e.message).join(", "));
    }

    req.body = value;

    next();
  };
};

export default validate;
