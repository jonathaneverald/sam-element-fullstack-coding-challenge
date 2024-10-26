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
exports.NoteService = void 0;
const note_model_1 = require("../model/note-model");
const note_validation_1 = require("../validation/note-validation");
const validation_1 = require("../validation/validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class NoteService {
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(note_validation_1.NoteValidation.CREATE, request);
            const record = Object.assign(Object.assign({}, createRequest), { username: user.username });
            const note = yield database_1.prismaClient.note.create({
                data: record,
            });
            return (0, note_model_1.toNoteResponse)(note);
        });
    }
    static checkNoteId(username, noteId) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield database_1.prismaClient.note.findUnique({
                where: {
                    id: noteId,
                    username: username,
                },
            });
            if (!note) {
                throw new response_error_1.ResponseError(404, "Note not found!");
            }
            return note;
        });
    }
    // Get Notes by ID
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield this.checkNoteId(user.username, id);
            return (0, note_model_1.toNoteResponse)(note);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateRequest = validation_1.Validation.validate(note_validation_1.NoteValidation.UPDATE, request);
            yield this.checkNoteId(user.username, updateRequest.id);
            const note = yield database_1.prismaClient.note.update({
                where: {
                    id: updateRequest.id,
                    username: user.username,
                },
                data: updateRequest,
            });
            return (0, note_model_1.toNoteResponse)(note);
        });
    }
    static delete(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkNoteId(user.username, id);
            const note = yield database_1.prismaClient.note.delete({
                where: {
                    id: id,
                    username: user.username,
                },
            });
            return (0, note_model_1.toNoteResponse)(note);
        });
    }
    static search(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchRequest = validation_1.Validation.validate(note_validation_1.NoteValidation.SEARCH, request);
            const skip = (searchRequest.page - 1) * searchRequest.size;
            const filters = [];
            // Check if title exists
            if (searchRequest.title) {
                filters.push({
                    title: {
                        contains: searchRequest.title,
                    },
                });
            }
            // Check if content exists
            if (searchRequest.content) {
                filters.push({
                    content: {
                        contains: searchRequest.content,
                    },
                });
            }
            const notes = yield database_1.prismaClient.note.findMany({
                where: {
                    username: user.username,
                    AND: filters,
                },
                take: searchRequest.size,
                skip: skip,
            });
            const total = yield database_1.prismaClient.note.count({
                where: {
                    username: user.username,
                    AND: filters,
                },
            });
            return {
                data: notes.map((note) => (0, note_model_1.toNoteResponse)(note)),
                paging: {
                    current_page: searchRequest.page,
                    total_page: Math.ceil(total / searchRequest.size),
                    size: searchRequest.size,
                },
            };
        });
    }
}
exports.NoteService = NoteService;
