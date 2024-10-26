import supertest from "supertest";
import { NoteTest, UserTest } from "./test-util";
import { web } from "../src/application/web";
import { logger } from "../src/application/logging";

describe("POST /api/notes", () => {
	beforeEach(async () => {
		await UserTest.create();
	});

	afterEach(async () => {
		await NoteTest.deleteAll();
		await UserTest.delete();
	});

	it("should create new note", async () => {
		const response = await supertest(web).post("/api/notes").set("X-API-TOKEN", "test").send({
			title: "test",
			content: "test",
		});

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.id).toBeDefined();
		expect(response.body.data.title).toBe("test");
		expect(response.body.data.content).toBe("test");
	});

	it("should not create new note if data is invalid", async () => {
		const response = await supertest(web).post("/api/notes").set("X-API-TOKEN", "test").send({
			title: "",
			content: "",
		});

		logger.debug(response.body);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});

describe("GET /api/notes/:noteId", () => {
	beforeEach(async () => {
		await UserTest.create();
		await NoteTest.create();
	});

	afterEach(async () => {
		await NoteTest.deleteAll();
		await UserTest.delete();
	});

	it("should be able to get note", async () => {
		const note = await NoteTest.get();
		const response = await supertest(web).get(`/api/notes/${note.id}`).set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.id).toBeDefined();
		expect(response.body.data.title).toBe(note.title);
		expect(response.body.data.content).toBe(note.content);
		expect(response.body.data.created_at).toBeDefined();
		expect(response.body.data.updated_at).toBeDefined();
	});

	it("should not be able to get note", async () => {
		const note = await NoteTest.get();
		const response = await supertest(web)
			.get(`/api/notes/${note.id + 1}`)
			.set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});

describe("PUT /api/notes/:noteId", () => {
	beforeEach(async () => {
		await UserTest.create();
		await NoteTest.create();
	});

	afterEach(async () => {
		await NoteTest.deleteAll();
		await UserTest.delete();
	});

	it("should be able to update note", async () => {
		const note = await NoteTest.get();
		const response = await supertest(web).put(`/api/notes/${note.id}`).set("X-API-TOKEN", "test").send({
			title: "newTitle",
			content: "newContent",
		});

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.id).toBe(note.id);
		expect(response.body.data.title).toBe("newTitle");
		expect(response.body.data.content).toBe("newContent");
		expect(response.body.data.created_at).toBeDefined();
		expect(response.body.data.updated_at).toBeDefined();
	});

	it("should not be able to update note if request is invalid", async () => {
		const note = await NoteTest.get();
		const response = await supertest(web).put(`/api/notes/${note.id}`).set("X-API-TOKEN", "test").send({
			title: "",
			content: "",
		});

		logger.debug(response.body);
		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});
});

describe("DELETE /api/notes/:noteId", () => {
	beforeEach(async () => {
		await UserTest.create();
		await NoteTest.create();
	});

	afterEach(async () => {
		await NoteTest.deleteAll();
		await UserTest.delete();
	});

	it("should be able to delete note", async () => {
		const note = await NoteTest.get();
		const response = await supertest(web).delete(`/api/notes/${note.id}`).set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data).toBe("OK");
	});

	it("should not be able to delete note", async () => {
		const note = await NoteTest.get();
		const response = await supertest(web)
			.delete(`/api/notes/${note.id + 1}`)
			.set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(404);
		expect(response.body.errors).toBeDefined();
	});
});

describe("GET /api/notes", () => {
	beforeEach(async () => {
		await UserTest.create();
		await NoteTest.create();
	});

	afterEach(async () => {
		await NoteTest.deleteAll();
		await UserTest.delete();
	});

	it("should be able to search notes", async () => {
		const response = await supertest(web).get("/api/notes").set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.length).toBe(1);
		expect(response.body.paging.current_page).toBe(1);
		expect(response.body.paging.total_page).toBe(1);
		expect(response.body.paging.size).toBe(10);
	});

	it("should be able to search notes using title", async () => {
		const response = await supertest(web).get("/api/notes").query({ title: "es" }).set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.length).toBe(1);
		expect(response.body.paging.current_page).toBe(1);
		expect(response.body.paging.total_page).toBe(1);
		expect(response.body.paging.size).toBe(10);
	});

	it("should be able to search notes using content", async () => {
		const response = await supertest(web).get("/api/notes").query({ content: "est" }).set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.length).toBe(1);
		expect(response.body.paging.current_page).toBe(1);
		expect(response.body.paging.total_page).toBe(1);
		expect(response.body.paging.size).toBe(10);
	});

	it("should be able to search notes no result", async () => {
		const response = await supertest(web).get("/api/notes").query({ title: "wrong" }).set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.length).toBe(0);
		expect(response.body.paging.current_page).toBe(1);
		expect(response.body.paging.total_page).toBe(0);
		expect(response.body.paging.size).toBe(10);
	});

	it("should be able to search notes with paging", async () => {
		const response = await supertest(web).get("/api/notes").query({ page: 2, size: 1 }).set("X-API-TOKEN", "test");

		logger.debug(response.body);
		expect(response.status).toBe(200);
		expect(response.body.data.length).toBe(0);
		expect(response.body.paging.current_page).toBe(2);
		expect(response.body.paging.total_page).toBe(1);
		expect(response.body.paging.size).toBe(1);
	});
});
