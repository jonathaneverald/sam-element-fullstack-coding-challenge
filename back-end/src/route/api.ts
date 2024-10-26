import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { UserController } from "../controller/user-controller";
import { NoteController } from "../controller/note-controller";

export const apiRouter = express.Router();
apiRouter.use(authMiddleware);

// User API
apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

// Note API
apiRouter.post("/api/notes", NoteController.create);
apiRouter.get("/api/notes", NoteController.search);
apiRouter.get("/api/notes/:noteId(\\d+)", NoteController.get);
apiRouter.put("/api/notes/:noteId(\\d+)", NoteController.update);
apiRouter.delete("/api/notes/:noteId(\\d+)", NoteController.delete);
