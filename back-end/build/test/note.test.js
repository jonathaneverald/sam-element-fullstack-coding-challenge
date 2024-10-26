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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const test_util_1 = require("./test-util");
const web_1 = require("../src/application/web");
const logging_1 = require("../src/application/logging");
describe("POST /api/notes", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_util_1.UserTest.create();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_util_1.NoteTest.deleteAll();
        yield test_util_1.UserTest.delete();
    }));
    it("should create new note", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(web_1.web).post("/api/notes").set("X-API-TOKEN", "test").send({
            title: "test",
            content: "test",
        });
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.title).toBe("test");
        expect(response.body.data.content).toBe("test");
    }));
    it("should not create new note if data is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(web_1.web).post("/api/notes").set("X-API-TOKEN", "test").send({
            title: "",
            content: "",
        });
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    }));
});
describe("GET /api/notes/:noteId", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_util_1.UserTest.create();
        yield test_util_1.NoteTest.create();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_util_1.NoteTest.deleteAll();
        yield test_util_1.UserTest.delete();
    }));
    it("should be able to get note", () => __awaiter(void 0, void 0, void 0, function* () {
        const note = yield test_util_1.NoteTest.get();
        const response = yield (0, supertest_1.default)(web_1.web).get(`/api/notes/${note.id}`).set("X-API-TOKEN", "test");
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined;
        expect(response.body.data.title).toBe(note.title);
        expect(response.body.data.content).toBe(note.content);
    }));
    it("should not be able to get note", () => __awaiter(void 0, void 0, void 0, function* () {
        const note = yield test_util_1.NoteTest.get();
        const response = yield (0, supertest_1.default)(web_1.web)
            .get(`/api/notes/${note.id + 1}`)
            .set("X-API-TOKEN", "test");
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined;
    }));
});
describe("PUT /api/notes/:noteId", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_util_1.UserTest.create();
        yield test_util_1.NoteTest.create();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_util_1.NoteTest.deleteAll();
        yield test_util_1.UserTest.delete();
    }));
    it("should be able to update note", () => __awaiter(void 0, void 0, void 0, function* () {
        const note = yield test_util_1.NoteTest.get();
        const response = yield (0, supertest_1.default)(web_1.web).put(`/api/notes/${note.id}`).set("X-API-TOKEN", "test").send({
            title: "newTitle",
            content: "newContent",
        });
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(note.id);
        expect(response.body.data.title).toBe("newTitle");
        expect(response.body.data.content).toBe("newContent");
    }));
    it("should not be able to update note if request is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const note = yield test_util_1.NoteTest.get();
        const response = yield (0, supertest_1.default)(web_1.web).put(`/api/notes/${note.id}`).set("X-API-TOKEN", "test").send({
            title: "",
            content: "",
        });
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined;
    }));
});
describe("DELETE /api/notes/:noteId", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_util_1.UserTest.create();
        yield test_util_1.NoteTest.create();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_util_1.NoteTest.deleteAll();
        yield test_util_1.UserTest.delete();
    }));
    it("should be able to delete note", () => __awaiter(void 0, void 0, void 0, function* () {
        const note = yield test_util_1.NoteTest.get();
        const response = yield (0, supertest_1.default)(web_1.web).delete(`/api/notes/${note.id}`).set("X-API-TOKEN", "test");
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");
    }));
    it("should not be able to delete note", () => __awaiter(void 0, void 0, void 0, function* () {
        const note = yield test_util_1.NoteTest.get();
        const response = yield (0, supertest_1.default)(web_1.web)
            .delete(`/api/notes/${note.id + 1}`)
            .set("X-API-TOKEN", "test");
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined;
    }));
});
describe("GET /api/notes", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_util_1.UserTest.create();
        yield test_util_1.NoteTest.create();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_util_1.NoteTest.deleteAll();
        yield test_util_1.UserTest.delete();
    }));
    it("should be able to search notes", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(web_1.web).get("/api/notes").set("X-API-TOKEN", "test");
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    }));
    it("should be able to search notes using title", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(web_1.web).get("/api/notes").query({ title: "es" }).set("X-API-TOKEN", "test");
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    }));
    it("should be able to search notes using content", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(web_1.web).get("/api/notes").query({ content: "est" }).set("X-API-TOKEN", "test");
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
    }));
    it("should be able to search notes no result", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(web_1.web).get("/api/notes").query({ title: "wrong" }).set("X-API-TOKEN", "test");
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.total_page).toBe(0);
        expect(response.body.paging.size).toBe(10);
    }));
    it("should be able to search notes with paging", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(web_1.web).get("/api/notes").query({ page: 2, size: 1 }).set("X-API-TOKEN", "test");
        logging_1.logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(2);
        expect(response.body.paging.total_page).toBe(1);
        expect(response.body.paging.size).toBe(1);
    }));
});
