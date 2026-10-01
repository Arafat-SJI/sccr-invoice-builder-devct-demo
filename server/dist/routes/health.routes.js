"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const databaseHealth_1 = require("../lib/databaseHealth");
const supabase_1 = require("../lib/supabase");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [supabase, database] = yield Promise.all([
        (0, supabase_1.checkSupabaseConnection)(),
        (0, databaseHealth_1.checkDatabaseConnection)(),
    ]);
    const ok = supabase.ok && database.ok;
    res.status(ok ? 200 : 503).json({
        status: ok ? 'OK' : 'DEGRADED',
        supabase: Object.assign({ connected: supabase.ok }, (supabase.message && { error: supabase.message })),
        database: Object.assign({ connected: database.ok }, (database.message && { error: database.message })),
    });
}));
exports.default = router;
