import express from "express";
import * as TaskController from "../controllers/task-controller.js";
import * as TaskValidation from "../validatons/task-validation.js";
import auth from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/", auth, TaskValidation.createTasks, TaskController.createTasks);

router.get("/", auth, TaskController.getAlltasks);

router.get("/:id", auth, TaskController.getTaskById);

router.put(
  "/bulk-update",
  auth,
  TaskValidation.bulkUpdateValidation,
  TaskController.taskBulkUpdateDragAndDrop
);

router.put("/:id", auth, TaskValidation.createTasks, TaskController.updateTask);

router.delete("/:id", auth, TaskController.deleteTask);

export default router;
