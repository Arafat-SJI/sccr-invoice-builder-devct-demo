"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
function notFoundHandler(req, res, next) {
    res.status(404).json({ message: 'Not Found' });
}
exports.notFoundHandler = notFoundHandler;
