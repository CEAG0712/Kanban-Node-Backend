import Task from "../models/task-model.js";

class TaskRepository {
  async createTasks(data) {
    let currentTaskListLength = await Task.countDocuments({
      status: data.status,
    });
    const task = new Task({
      taskSummary: data.taskSummary,
      acceptanceCriteria: data.acceptanceCriteria,
      status: data.status,
      hierarchy: currentTaskListLength + 1,
      userId: data.userId,
    });

    return await task.save();
  }

  async getAlltasks(query) {
    console.log(query);

    return await Task.find(query).sort({ hierarchy: 1 });
  }

  async getSingleTask(query) {
    return await Task.findOne(query);
  }

  async getTaskAndUpdate(query, task) {
    return await Task.findOneAndUpdate(
      query, // Assuming task contains the id for the task
      {
        $set: {
          taskSummary: task.taskSummary,
          acceptanceCriteria: task.acceptanceCriteria,
          status: task.status,
          hierarchy: task.hierarchy,
        },
      },
      { new: true }
    );
  }

  async deleteTask(id, userId) {
    return await Task.findOneAndDelete({ _id: id, userId });
  }
}

export default new TaskRepository();
