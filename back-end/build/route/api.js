"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const user_controller_1 = require("../controller/user-controller");
const note_controller_1 = require("../controller/note-controller");
exports.apiRouter = express_1.default.Router();
exports.apiRouter.use(auth_middleware_1.authMiddleware);
// User API
exports.apiRouter.get("/api/users/current", user_controller_1.UserController.get);
exports.apiRouter.patch("/api/users/current", user_controller_1.UserController.update);
exports.apiRouter.delete("/api/users/current", user_controller_1.UserController.logout);
// Note API
exports.apiRouter.post("/api/notes", note_controller_1.NoteController.create);
exports.apiRouter.get("/api/notes", note_controller_1.NoteController.search);
exports.apiRouter.get("/api/notes/:noteId(\\d+)", note_controller_1.NoteController.get);
exports.apiRouter.put("/api/notes/:noteId(\\d+)", note_controller_1.NoteController.update);
exports.apiRouter.delete("/api/notes/:noteId(\\d+)", note_controller_1.NoteController.delete);
