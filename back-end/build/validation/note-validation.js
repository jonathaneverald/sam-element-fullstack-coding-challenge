"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteValidation = void 0;
const zod_1 = require("zod");
class NoteValidation {
}
exports.NoteValidation = NoteValidation;
NoteValidation.CREATE = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    content: zod_1.z.string().min(1).max(1000),
});
NoteValidation.UPDATE = zod_1.z.object({
    id: zod_1.z.number().positive(),
    title: zod_1.z.string().min(1).max(100).optional(),
    content: zod_1.z.string().min(1).max(1000).optional(),
});
NoteValidation.SEARCH = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100).optional(),
    content: zod_1.z.string().min(1).max(100).optional(),
    page: zod_1.z.number().min(1).positive(),
    size: zod_1.z.number().min(1).max(100).positive(),
});
