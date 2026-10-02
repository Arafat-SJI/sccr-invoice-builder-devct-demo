"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConflictError = exports.UnauthorizedError = exports.NotFoundError = void 0;
class NotFoundError extends Error {
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends Error {
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ConflictError extends Error {
    constructor(message = 'Conflict') {
        super(message);
        this.name = 'ConflictError';
    }
}
exports.ConflictError = ConflictError;
