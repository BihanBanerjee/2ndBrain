// import { ZodError } from 'zod'; // Assuming you're using Zod for validation errors
// import { Prisma } from '@prisma/client'; // Assuming you're using Prisma
// import bcrypt from 'bcryptjs';

// // Define a custom error format type for the serialized error
// interface SerializedError {
//     message: string;
//     code?: string;   // For errors with a specific code like Prisma
//     details?: string; // For detailed information like Zod issues
//     stack?: string;   // Stack trace, optional
// }

// // Serialize error function
// function serializeError(error: unknown): SerializedError {
//     if (error instanceof ZodError) {
//         // Handle Zod errors
//         return {
//             message: 'Validation failed',
//             details: error.errors.map((err) => `${err.message} in ${err.path.join('.')}`).join(', '),
//         };
//     }

//     if (error instanceof Prisma.PrismaClientKnownRequestError) {
//         // Handle Prisma errors
//         return {
//             message: 'Database error',
//             code: error.code,
//             details: error.message,
//         };
//     }

//     if (error instanceof Prisma.PrismaClientValidationError) {
//         // Handle Prisma validation errors
//         return {
//             message: 'Validation error in Prisma',
//             details: error.message,
//         };
//     }

//     if (error instanceof bcrypt.BcryptError) {
//         // Handle bcryptjs errors
//         return {
//             message: 'Bcrypt error',
//             details: error.message,
//         };
//     }

//     if (error instanceof Error) {
//         // Generic JavaScript errors (Error class)
//         return {
//             message: error.message,
//             stack: error.stack, // Optionally include the stack trace
//         };
//     }

//     // Default case for unknown error types
//     return {
//         message: 'Unknown error occurred',
//     };
// }

// export { serializeError, SerializedError };