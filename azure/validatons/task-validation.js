import joi from "joi";
import mongoose from "mongoose";

export const createTasks = async (req, res, next) => {
  const schema = joi
    .object({
      taskSummary: joi.string().required(),
      //acceptanceCriteria: joi.string().optional(),
      status: joi.string().valid("TO_DO", "IN_PROGRESS", "DONE"),
    })
    .unknown();

  const validation = schema.validate(req.body);

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;

    return res.status(401).json({ message: error });
  }

  return next();
};

export const bulkUpdateValidation = async (req, res, next) => {
  const schema = joi.object({
    tasks: joi
      .array()
      .items(
        joi
          .object({
            _id: joi
              .string()
              .required()
              .custom((value, helpers) => {
                if (!mongoose.Types.ObjectId.isValid(value))
                  return helpers.error("any.custom");

                return value;
              }), // Ensures each task has an _id
            taskSummary: joi.string().required(),
            status: joi.string().required(),
            hierarchy: joi.number().required(),
          })
          .unknown(true) // Allows unknown fields in the task object
      )
      .min(1) // The array must contain at least 1 task
      .required(), // Tasks array is required
  });

  const validation = schema.validate(req.body);

  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;

    return res.status(401).json({ message: error });
  }

  return next();
};

//next: function from Express to move forward
