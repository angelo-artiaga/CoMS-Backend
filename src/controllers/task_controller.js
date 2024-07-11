import db from "../database/db.js";

const getAllAssigneeTask = async (req, res) => {
  try {
    const { assignee } = req.params;
    const tasks = await db("tasks").whereRaw("?? @> ?", [
      "assignee",
      `{${assignee}}`,
    ]);
    if (tasks.length > 0) {
      res.status(200).json(tasks);
    } else {
      res.status(404).json({ message: "No tasks found for this assignee" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await db("tasks").where({ taskId: id }).first();
    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: "Task not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllTask = async (req, res) => {
  try {
    const { companyId } = req.params;
    const tasks = await db("tasks")
      .select("*")
      .where({ companyId })
      .orderBy("created_at", "desc");
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      taskDescription,
      targetDate,
      status,
      remarks,
      serviceAgreement,
      serviceAgreementFileLink,
      assignee,
    } = req.body;
    await db("tasks").where({ taskId: id }).update({
      taskDescription,
      targetDate,
      status,
      remarks,
      serviceAgreement,
      serviceAgreementFileLink,
      assignee,
    });
    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTask = async (req, res) => {
  const { companyId } = req.params;

  try {
    const {
      taskDescription,
      targetDate,
      status,
      remarks,
      serviceAgreement,
      serviceAgreementFileLink,
      assignee,
    } = req.body;
    await db("tasks").insert({
      companyId,
      taskDescription,
      targetDate,
      status,
      remarks,
      serviceAgreement,
      serviceAgreementFileLink,
      assignee,
    });
    res.status(201).json({ message: "Task added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await db("tasks").where({ taskId: id }).del();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  getTask,
  getAllTask,
  updateTask,
  createTask,
  deleteTask,
  getAllAssigneeTask,
};
