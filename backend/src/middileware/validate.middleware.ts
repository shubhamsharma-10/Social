import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

const validate = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("Request Body: ", req.body);
            const ans = schema.safeParse(req.body);
            if (!ans.success) {
                throw ans.error
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: error.flatten().fieldErrors,
                });
            }
        }
    }
}
export default validate