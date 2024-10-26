import { prismaClient } from "../src/application/database";
import bcrypt from "bcrypt";
import { Note, User } from "@prisma/client";

export class UserTest {
	static async delete() {
		await prismaClient.user.deleteMany({
			where: {
				username: "test",
			},
		});
	}

	static async create() {
		await prismaClient.user.create({
			data: {
				username: "test",
				name: "test",
				password: await bcrypt.hash("test", 10),
				token: "test",
			},
		});
	}

	static async get(): Promise<User> {
		const user = await prismaClient.user.findFirst({
			where: {
				username: "test",
			},
		});
		if (!user) {
			throw new Error("User is not found!");
		}
		return user;
	}
}

export class NoteTest {
	static async create() {
		await prismaClient.note.create({
			data: {
				title: "test",
				content: "test",
				username: "test",
			},
		});
	}

	static async createMany() {
		await prismaClient.note.createMany({
			data: [
				{ title: "test", content: "test", username: "test" },
				{ title: "test1", content: "test2", username: "test" },
				{ title: "test2", content: "test2", username: "test" },
			],
		});
	}

	static async get(): Promise<Note> {
		const note = await prismaClient.note.findFirst({
			where: {
				username: "test",
			},
		});
		if (!note) {
			throw new Error("Note is not found!");
		}
		return note;
	}

	static async getAll(): Promise<Note[]> {
		const notes = await prismaClient.note.findMany({
			where: {
				username: "test",
			},
		});
		if (!notes) {
			throw new Error("Note is not found!");
		}
		return notes;
	}

	static async deleteAll() {
		await prismaClient.note.deleteMany({
			where: {
				username: "test",
			},
		});
	}
}
