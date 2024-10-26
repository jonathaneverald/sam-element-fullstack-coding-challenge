import { Response, NextFunction } from "express";
import { UserRequest } from "../type/user-request";
import { CreateNoteRequest, SearchNoteRequest, UpdateNoteRequest } from "../model/note-model";
import { NoteService } from "../service/note-service";
import { logger } from "../application/logging";

export class NoteController {
	static async create(req: UserRequest, res: Response, next: NextFunction) {
		try {
			const request: CreateNoteRequest = req.body as CreateNoteRequest;
			const response = await NoteService.create(req.user!, request);
			res.status(200).json({
				data: response,
			});
		} catch (e) {
			next(e);
		}
	}

	static async get(req: UserRequest, res: Response, next: NextFunction) {
		try {
			const noteId = Number(req.params.noteId);
			const response = await NoteService.get(req.user!, noteId);
			res.status(200).json({
				data: response,
			});
		} catch (e) {
			next(e);
		}
	}

	static async update(req: UserRequest, res: Response, next: NextFunction) {
		try {
			const request: UpdateNoteRequest = req.body as UpdateNoteRequest;
			request.id = Number(req.params.noteId);
			const response = await NoteService.update(req.user!, request);
			res.status(200).json({
				data: response,
			});
		} catch (e) {
			next(e);
		}
	}

	static async delete(req: UserRequest, res: Response, next: NextFunction) {
		try {
			const noteId = Number(req.params.noteId);
			const response = await NoteService.delete(req.user!, noteId);
			res.status(200).json({
				data: "OK",
			});
		} catch (e) {
			next(e);
		}
	}

	static async search(req: UserRequest, res: Response, next: NextFunction) {
		try {
			const request: SearchNoteRequest = {
				title: req.query.title as string,
				content: req.query.content as string,
				page: req.query.page ? Number(req.query.page) : 1,
				size: req.query.size ? Number(req.query.size) : 10,
			};
			const noteId = Number(req.params.noteId);
			const response = await NoteService.search(req.user!, request);
			res.status(200).json(response);
		} catch (e) {
			next(e);
		}
	}
}
