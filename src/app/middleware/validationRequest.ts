import { ZodObject } from "zod";
import catchAsync from "../shared/catchAsync";


const validationRequest = (schema: ZodObject) => {
  return catchAsync(async (req, res, next) => {
    await schema.parseAsync({ body: req.body, cookies: req.cookies });
    next();
  });
};

export default validationRequest;
