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
exports.checkSupabaseConnection = void 0;
const env_1 = require("../config/env");
function checkSupabaseConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        const { SUPABASE_URL, SUPABASE_ANON_KEY } = env_1.config;
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            return { ok: false, message: 'SUPABASE_URL or SUPABASE_ANON_KEY is not set' };
        }
        try {
            const res = yield fetch(`${SUPABASE_URL}/auth/v1/settings`, {
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                },
            });
            if (!res.ok) {
                const body = yield res.text();
                return { ok: false, message: `HTTP ${res.status}: ${body.slice(0, 200)}` };
            }
            return { ok: true };
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            return { ok: false, message };
        }
    });
}
exports.checkSupabaseConnection = checkSupabaseConnection;
