import { HTTP_STATUS_CODES } from "../constants/app-defaults.js";
import taskRepository from "../repository/task-repository.js";
import responseHandler from "../utils/response-handlers.js";

export const createTasks = async (req, res) => {
  if (req.body.status === "") {
    req.body.status = "TO_DO";
  }

  //extract to helper function
  const currentUser = req.user;

  if (!currentUser) {
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.UNAUTHORIZED,
      error: "Unauthorized Task Controller",
    });
  }

  try {
    const newSavedTask = await taskRepository.createTasks({
      ...req.body,
      userId: currentUser._id,
    });
    return responseHandler.sendSuccessResponse({
      res,
      code: HTTP_STATUS_CODES.CREATED,
      message: "task created",
      data: newSavedTask,
    });
    // res.status(201).json({ success: true, data: newSavedTask });
  } catch (error) {
    console.log(error);
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Something went wrong",
    });
  }
};

export const getAlltasks = async (req, res) => {
  //extract to helper function

  const currentUser = checkCurrentUser(req.user);
  if (!currentUser.status) {
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.UNAUTHORIZED,
      error: "Unauthorized",
    });
  }

  console.log(currentUser);

  try {
    const tasks = await taskRepository.getAlltasks({
      userId: currentUser.data._id,
    });
    return responseHandler.sendSuccessResponse({
      res,
      code: HTTP_STATUS_CODES.OK,
      message: "tasks retrieved",
      data: tasks,
    });
  } catch (error) {
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Something went wrong",
    });
  }
};

export const getTaskById = async (req, res) => {
  const currentUser = checkCurrentUser(req.user);
  if (!currentUser.status) {
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.UNAUTHORIZED,
      error: "Unauthorized",
    });
  }
  try {
    const task = await taskRepository.getSingleTask({
      _id: req.params.id,
      userId: currentUser.data._id,
    });
    //we can use method directly on the model
    return responseHandler.sendSuccessResponse({
      res,
      code: HTTP_STATUS_CODES.OK,
      message: "task retrieved",
      data: task,
    });
  } catch (error) {
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Something went wrong",
    });
  }
};

export const taskBulkUpdateDragAndDrop = async (req, res) => {
  const currentUser = checkCurrentUser(req.user);
  if (!currentUser.status) {
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.UNAUTHORIZED,
      error: "Unauthorized",
    });
  }

  try {
    // Assuming req.body contains an array of tasks to update
    const tasks = req.body.tasks;

    // Iterate over the array and update each task
    const updatePromises = tasks.map((task) =>
      taskRepository.getTaskAndUpdate(
        { _id: task._id, userId: currentUser.data._id },
        task
      )
    );

    // Wait for all updates to complete
    const updatedTasks = await Promise.all(updatePromises);

    return responseHandler.sendSuccessResponse({
      res,
      code: HTTP_STATUS_CODES.OK,
      message: "tasks updated",
      data: updatedTasks,
    });
  } catch (error) {
    console.log(error);
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Something went wrong",
    });
  }
};

export const updateTask = async (req, res) => {
  const currentUser = checkCurrentUser(req.user);
  if (!currentUser.status) {
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.UNAUTHORIZED,
      error: "Unauthorized",
    });
  }

  try {
    const task = req.body;
    const updatedTask = await taskRepository.getTaskAndUpdate(
      { _id: req.params.id, userId: currentUser.data._id },
      task
    );

    return responseHandler.sendSuccessResponse({
      res,
      code: HTTP_STATUS_CODES.OK,
      message: "task updated",
      data: updatedTask,
    });
  } catch (error) {
    console.log(error);
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Something went wrong",
    });
  }
};

export const deleteTask = async (req, res) => {
  const currentUser = checkCurrentUser(req.user);
  if (!currentUser.status) {
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.UNAUTHORIZED,
      error: "Unauthorized",
    });
  }

  try {
    await taskRepository.deleteTask(req.params.id, currentUser.data._id);
    return responseHandler.sendSuccessResponse({
      res,
      code: HTTP_STATUS_CODES.OK,
      message: "task deleted",
    });
  } catch (error) {
    console.log(error);
    return responseHandler.sendErrorResponse({
      res,
      code: HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error: "Something went wrong",
    });
  }
};

// refactor, move to helper function
function checkCurrentUser(user) {
  const currentUser = user;

  if (!currentUser) {
    return { status: false, data: currentUser };
  }

  return { status: true, data: currentUser };
}
