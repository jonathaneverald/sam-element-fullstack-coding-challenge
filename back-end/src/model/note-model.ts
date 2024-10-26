import { Note } from "@prisma/client";

export type NoteResponse = {
	id: number;
	title: string;
	content: string;
	created_at: Date;
	updated_at: Date;
};

export type CreateNoteRequest = {
	title: string;
	content: string;
};

export type UpdateNoteRequest = {
	id: number;
	title?: string;
	content?: string;
};

export type SearchNoteRequest = {
	title?: string;
	content?: string;
	page: number;
	size: number;
};

export function toNoteResponse(note: Note): NoteResponse {
	return {
		id: note.id,
		title: note.title,
		content: note.content,
		created_at: note.created_at,
		updated_at: note.updated_at,
	};
}
