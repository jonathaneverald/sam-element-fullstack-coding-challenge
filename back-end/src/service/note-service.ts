import { Note, User } from "@prisma/client";
import { CreateNoteRequest, NoteResponse, SearchNoteRequest, toNoteResponse, UpdateNoteRequest } from "../model/note-model";
import { NoteValidation } from "../validation/note-validation";
import { Validation } from "../validation/validation";
import { prismaClient } from "../application/database";
import { ResponseError } from "../error/response-error";
import { UserValidation } from "../validation/user-validation";
import { Pageable } from "../model/page";
import { skip } from "@prisma/client/runtime/library";

export class NoteService {
	static async create(user: User, request: CreateNoteRequest): Promise<NoteResponse> {
		const createRequest = Validation.validate(NoteValidation.CREATE, request);

		const record = {
			...createRequest,
			...{ username: user.username },
		};

		const note = await prismaClient.note.create({
			data: record,
		});

		return toNoteResponse(note);
	}

	static async checkNoteId(username: string, noteId: number): Promise<Note> {
		const note = await prismaClient.note.findUnique({
			where: {
				id: noteId,
				username: username,
			},
		});

		if (!note) {
			throw new ResponseError(404, "Note not found!");
		}
		return note;
	}

	// Get Notes by ID
	static async get(user: User, id: number): Promise<NoteResponse> {
		const note = await this.checkNoteId(user.username, id);

		return toNoteResponse(note);
	}

	static async update(user: User, request: UpdateNoteRequest): Promise<NoteResponse> {
		const updateRequest = Validation.validate(NoteValidation.UPDATE, request);
		await this.checkNoteId(user.username, updateRequest.id);

		const note = await prismaClient.note.update({
			where: {
				id: updateRequest.id,
				username: user.username,
			},
			data: updateRequest,
		});

		return toNoteResponse(note);
	}

	static async delete(user: User, id: number): Promise<NoteResponse> {
		await this.checkNoteId(user.username, id);

		const note = await prismaClient.note.delete({
			where: {
				id: id,
				username: user.username,
			},
		});

		return toNoteResponse(note);
	}

	static async search(user: User, request: SearchNoteRequest): Promise<Pageable<NoteResponse>> {
		const searchRequest = Validation.validate(NoteValidation.SEARCH, request);
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

		const notes = await prismaClient.note.findMany({
			where: {
				username: user.username,
				AND: filters,
			},
			take: searchRequest.size,
			skip: skip,
		});

		const total = await prismaClient.note.count({
			where: {
				username: user.username,
				AND: filters,
			},
		});

		return {
			data: notes.map((note) => toNoteResponse(note)),
			paging: {
				current_page: searchRequest.page,
				total_page: Math.ceil(total / searchRequest.size),
				size: searchRequest.size,
			},
		};
	}
}
