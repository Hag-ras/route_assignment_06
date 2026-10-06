import { NODE_ENV } from "../config.js"

export const globalErrorHandling = (err, req, res, next)=>{
    return res.status(err.cause?.status ?? 500).json({
        error_message: err.message || 'server error',
        err: NODE_ENV=='development'? err : undefined,
        stack: NODE_ENV=='development'? err.stack: undefined})
}