import { z, ZodType } from "zod";

export class NoteValidation {
	static readonly CREATE: ZodType = z.object({
		title: z.string().min(1).max(100),
		content: z.string().min(1).max(1000),
	});

	static readonly UPDATE: ZodType = z.object({
		id: z.number().positive(),
		title: z.string().min(1).max(100).optional(),
		content: z.string().min(1).max(1000).optional(),
	});

	static readonly SEARCH: ZodType = z.object({
		title: z.string().min(1).max(100).optional(),
		content: z.string().min(1).max(100).optional(),
		page: z.number().min(1).positive(),
		size: z.number().min(1).max(100).positive(),
	});
}
