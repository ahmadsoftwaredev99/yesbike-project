import ApiError from "../utils/ApiError.js";

// Simple field-presence validator factory: validate(["email", "password"])
export const validate = (requiredFields = []) => (req, res, next) => {
  const missing = requiredFields.filter((field) => {
    const value = req.body[field];
    return value === undefined || value === null || value === "";
  });
  if (missing.length) {
    throw new ApiError(400, `Missing required field(s): ${missing.join(", ")}`);
  }
  next();
};
