export class ErrorHandler extends Error {
    constructor (message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    // console.log(err);
    const message = err.message || "Internal server error...";
    const statusCode = err.statusCode || 500;
    

    return res.status(statusCode).json({
        success: false,
        message
    })
}