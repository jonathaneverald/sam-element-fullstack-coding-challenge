"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNoteResponse = void 0;
function toNoteResponse(note) {
    return {
        id: note.id,
        title: note.title,
        content: note.content,
        created_at: note.created_at,
        updated_at: note.updated_at,
    };
}
exports.toNoteResponse = toNoteResponse;
