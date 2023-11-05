import { validate as expressValidate, schema } from "express-validation";

export const validate = (_schema: schema) => {
  return expressValidate(_schema, { keyByField: true }, { abortEarly: false });
};
