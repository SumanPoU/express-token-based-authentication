// import httpStatus from 'http-status';

// export class AppError extends Error {
//   statusCode: number;
//   errors?: { field: string; message: string }[];

//   constructor(message: string, statusCode = httpStatus.BAD_REQUEST, errors?: { field: string; message: string }[]) {
//     super(message);
//     this.statusCode = statusCode;
//     this.errors = errors;
//     Object.setPrototypeOf(this, new.target.prototype);
//     Error.captureStackTrace(this);
//   }
// }

export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
