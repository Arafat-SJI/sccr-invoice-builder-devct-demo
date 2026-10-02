"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./types/express");
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
require("./database/supabase");
const PORT = env_1.config.PORT || 5000;
app_1.default.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Supabase client initialized');
});
