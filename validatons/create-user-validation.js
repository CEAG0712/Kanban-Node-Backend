import joi from "joi";
import responseHandler from "../utils/response-handlers.js";
import { HTTP_STATUS_CODES } from "../constants/app-defaults.js";

export const createUser = async (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .min(8)
      .required()
      .pattern(
        new RegExp(
          "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\\-+=\\[\\]{}|/:;<> ,.?~_])"
        )
      )
      .messages({
        "string.pattern.base":
          "Password must contain at least 8 alphanumeric characters with at least one capital letter and special character",
      }),
    confirmPassword: joi
      .string()
      .required()
      .valid(joi.ref("password"))
      .messages({ "any.only": "Passwords must match" }),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;

    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.BAD_REQUEST,
      error: error,
    });
  }

  return next();
};

export const login = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;

    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.BAD_REQUEST,
      error: error,
    });
  }

  return next();
};
