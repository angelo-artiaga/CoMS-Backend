import db from "../database/db.js";

const getAllAssigneeTask = async (req, res) => {
  const { taskAssigneeId } = req.params;

  try {
    const tasks = await db("tasks")
      .select("tasks.*")
      .join("taskAssignee", "tasks.taskId", "taskAssignee.taskId")
      .where("taskAssignee.assigneeId", taskAssigneeId);

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    // Query the specific service agreement by ID
    const agreement = await db("serviceAgreement")
      .where("serviceAgreementId", id)
      .first();

    if (!agreement) {
      return res.status(404).json({ error: "Service Agreement not found" });
    }

    // Query all tasks associated with the service agreement
    const tasks = await db("task").where("serviceAgreementId", id).select("*");

    // Initialize an array to store tasks with assignees
    const tasksWithAssignees = [];

    // Iterate over each task
    for (const task of tasks) {
      // Query all assignees associated with the current task
      const assignees = await db("taskAssignee")
        .where("taskId", task.taskId)
        .select("AssigneeName");

      // Format assignees array
      const formattedAssignees = assignees.map((assignee) => ({
        assigneeName: assignee.AssigneeName,
      }));

      // Push task with assignees to tasksWithAssignees array
      tasksWithAssignees.push({
        task: task.task,
        targetDate: task.targetDate,
        status: task.status,
        assignees: formattedAssignees,
      });
    }

    // Format the final response
    const result = {
      agreementName: agreement.agreementName,
      companyId: agreement.companyId,
      fileLink: agreement.fileLink, // Assuming fileLink is in serviceAgreement table
      tasks: tasksWithAssignees,
    };

    // Send the formatted data as a response
    res.status(200).json(result);
  } catch (err) {
    console.error("Error retrieving data", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllTask = async (req, res) => {
  const companyId = req.params.companyId;

  console.log(companyId);
  try {
    // Query all service agreements
    const serviceAgreements = await db("serviceAgreement")
      .select("*")
      .where("companyId", companyId);

    // Initialize an array to store the formatted data
    const agreementsWithTasksAndAssignees = [];

    // Iterate over each service agreement
    for (const agreement of serviceAgreements) {
      // Query all tasks associated with the current service agreement
      const tasks = await db("task")
        .where("serviceAgreementId", agreement.serviceAgreementId)
        .select("*");

      // Initialize an array to store tasks with assignees
      const tasksWithAssignees = [];

      // Iterate over each task
      for (const task of tasks) {
        // Query all assignees associated with the current task
        const assignees = await db("taskAssignee")
          .where("taskId", task.taskId)
          .select("AssigneeName");

        // Format assignees array
        const formattedAssignees = assignees.map((assignee) => ({
          assigneeName: assignee.AssigneeName,
        }));

        // Push task with assignees to tasksWithAssignees array
        tasksWithAssignees.push({
          taskId: task.taskId,
          task: task.task,
          targetDate: task.targetDate,
          status: task.status,
          assignees: formattedAssignees,
        });
      }

      // Push service agreement with tasks and assignees to agreementsWithTasksAndAssignees array
      agreementsWithTasksAndAssignees.push({
        serviceAgreementId: agreement.serviceAgreementId,
        agreementName: agreement.agreementName,
        companyId: agreement.companyId,
        fileLink: agreement.fileLink, // Assuming fileLink is in serviceAgreement table
        tasks: tasksWithAssignees,
      });
    }

    // Send the formatted data as a response
    res.status(200).json(agreementsWithTasksAndAssignees);
  } catch (err) {
    console.error("Error retrieving data", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { agreementName, companyId, fileLink, tasks } = req.body;

  // Validate input
  if (!agreementName || !companyId || !tasks) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const trx = await db.transaction();

  try {
    // Update the service agreement
    await trx("serviceAgreement").where("serviceAgreementId", id).update({
      agreementName,
      companyId,
      fileLink,
    });

    // Retrieve existing tasks for the service agreement
    const existingTasks = await trx("task")
      .where("serviceAgreementId", id)
      .select("taskId");

    // Update tasks and their assignees
    for (const task of tasks) {
      if (task.taskId) {
        // If taskId is provided, update the existing task
        await trx("task").where("taskId", task.taskId).update({
          task: task.task,
          targetDate: task.targetDate,
          status: task.status,
        });

        // Delete existing assignees
        await trx("taskAssignee").where("taskId", task.taskId).del();

        // Insert new assignees
        for (const assignee of task.assignees) {
          await trx("taskAssignee").insert({
            taskId: task.taskId,
            AssigneeName: assignee.assigneeName,
          });
        }
      } else {
        // If no taskId, insert new task
        const [newTask] = await trx("task")
          .insert({
            serviceAgreementId: id,
            task: task.task,
            targetDate: task.targetDate,
            status: task.status,
          })
          .returning("*");

        // Insert new assignees for the new task
        for (const assignee of task.assignees) {
          await trx("taskAssignee").insert({
            taskId: newTask.taskId,
            AssigneeName: assignee.assigneeName,
          });
        }
      }
    }

    await trx.commit();
    res.status(200).json({
      message: "Service Agreement, Tasks, and Assignees updated successfully",
    });
  } catch (err) {
    await trx.rollback();
    console.error("Error updating data", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createTask = async (req, res) => {
  const { agreementName, tasks, fileLink } = req.body;
  const companyId = req.params.companyId;

  if (!agreementName || !companyId || !tasks || !fileLink) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const trx = await db.transaction();

  try {
    // Insert serviceAgreement
    const [serviceAgreement] = await trx("serviceAgreement")
      .insert({
        agreementName,
        companyId,
        fileLink,
      })
      .returning("*");

    const serviceAgreementId = serviceAgreement.serviceAgreementId;

    // Insert tasks and their assignees
    for (const task of tasks) {
      const [taskRecord] = await trx("task")
        .insert({
          serviceAgreementId,
          task: task.task,
          targetDate: task.targetDate,
          status: task.status,
        })
        .returning("*");

      const taskId = taskRecord.taskId;

      if (task.assignees && task.assignees.length > 0) {
        for (const AssigneeName of task.assignees) {
          await trx("taskAssignee").insert({
            taskId,
            AssigneeName,
          });
        }
      }
    }

    await trx.commit();
    res.status(201).json({
      message: "Service Agreement, Tasks, and Assignees inserted successfully",
    });
  } catch (err) {
    await trx.rollback();
    console.error("Error inserting data", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  const trx = await db.transaction();

  try {
    // Delete assignees associated with the tasks
    await trx("taskAssignee")
      .whereIn("taskId", function () {
        this.select("taskId").from("task").where("serviceAgreementId", id);
      })
      .del();

    // Delete tasks associated with the service agreement
    await trx("task").where("serviceAgreementId", id).del();

    // Delete the service agreement
    await trx("serviceAgreement").where("serviceAgreementId", id).del();

    await trx.commit();
    res.status(200).json({
      message: "Service Agreement and associated tasks deleted successfully",
    });
  } catch (err) {
    await trx.rollback();
    console.error("Error deleting data", err);
    res.status(500).json({ error: "Internal server error" });
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
