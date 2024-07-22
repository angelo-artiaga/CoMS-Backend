import db from "../database/db.js";

const getAllTask = async (req, res) => {
  try {
    const tasks = await db("tasks")
      .select("tasks.*", "companies.companyName")
      .join("companies", "tasks.companyId", "companies.companyId");

    let appendUserDetails = await Promise.all(
      tasks.map(async (task) => {
        let users = await Promise.all(
          task.assignee.map(async (slackId) => {
            let user = await db("users").select("*").where("slackId", slackId);
            return user[0];
          })
        );
        task.assigneeDetails = users;
        return task;
      })
    );

    if (appendUserDetails.length > 0) {
      res.status(200).json(appendUserDetails);
    } else {
      res.status(404).json({ message: "No tasks found for this assignee" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

const getAllCompanyTask = async (req, res) => {
  try {
    const { companyId } = req.params;
    const tasks = await db("tasks")
      .select("*")
      .where({ companyId })
      .orderBy("created_at", "desc");

    const tasksWithAssigneeNames = await Promise.all(
      tasks.map(async (task) => {
        const assigneeNames = await Promise.all(
          task.assignee.map(async (assigneeId) => {
            const user = await db("users")
              .select("first_name", "last_name") // Adjust field names as necessary
              .where("slackId", assigneeId)
              .first();

            if (!user) {
              throw new Error(`User with slackId ${assigneeId} not found`);
            }

            return `${user.first_name} ${user.last_name}`; // Combine first and last name
          })
        );

        return { ...task, assigneeNames };
      })
    );

    res.status(200).json({ tasks: tasksWithAssigneeNames });
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
  getAllTask,
  getTask,
  getAllCompanyTask,
  updateTask,
  createTask,
  deleteTask,
  getAllAssigneeTask,
};
