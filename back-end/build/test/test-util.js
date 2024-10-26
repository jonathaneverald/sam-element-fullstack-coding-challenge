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
exports.NoteTest = exports.UserTest = void 0;
const database_1 = require("../src/application/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserTest {
    static delete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.user.deleteMany({
                where: {
                    username: "test",
                },
            });
        });
    }
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.user.create({
                data: {
                    username: "test",
                    name: "test",
                    password: yield bcrypt_1.default.hash("test", 10),
                    token: "test",
                },
            });
        });
    }
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield database_1.prismaClient.user.findFirst({
                where: {
                    username: "test",
                },
            });
            if (!user) {
                throw new Error("User is not found!");
            }
            return user;
        });
    }
}
exports.UserTest = UserTest;
class NoteTest {
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.note.create({
                data: {
                    title: "test",
                    content: "test",
                    username: "test",
                },
            });
        });
    }
    static createMany() {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.note.createMany({
                data: [
                    { title: "test", content: "test", username: "test" },
                    { title: "test1", content: "test2", username: "test" },
                    { title: "test2", content: "test2", username: "test" },
                ],
            });
        });
    }
    static get() {
        return __awaiter(this, void 0, void 0, function* () {
            const note = yield database_1.prismaClient.note.findFirst({
                where: {
                    username: "test",
                },
            });
            if (!note) {
                throw new Error("Note is not found!");
            }
            return note;
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const notes = yield database_1.prismaClient.note.findMany({
                where: {
                    username: "test",
                },
            });
            if (!notes) {
                throw new Error("Note is not found!");
            }
            return notes;
        });
    }
    static deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.prismaClient.note.deleteMany({
                where: {
                    username: "test",
                },
            });
        });
    }
}
exports.NoteTest = NoteTest;
