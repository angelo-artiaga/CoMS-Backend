import db from "../database/db.js";

const createWorkFlow = async (req, res) => {
  const { companyId } = req.params;
  const transaction = await db.transaction();
  try {
    const { workFlowName, agreementName, googleFileLink, data, priorityLevel } =
      req.body;
    // Insert into workflows table
    const [workflow] = await transaction("workFlow")
      .insert({
        companyId: companyId,
        agreementName,
        googleFileLink,
        workFlowName,
        priorityLevel,
      })
      .returning("workFlowId");
    const workFlowId = workflow.workFlowId; // Correctly extract the workFlowId
    // Insert into tasks table
    for (const task of data) {
      const [taskRecord] = await transaction("tasks")
        .insert({
          workFlowId: workFlowId, // Correctly use the extracted workFlowId
          taskName: task.taskName,
          taskDescription: task.taskDescription,
          assignee: task.assignees, // Convert array to JSON string
          status: task.status,
          targetDate: task.targetDate,
          assignedBy: task.assignedBy,
        })
        .returning("taskId");
      const taskId = taskRecord.taskId; // Correctly extract the taskId
      // Insert into subTasks table
      for (const sub of task.subdata) {
        await transaction("subTasks").insert({
          taskId: taskId, // Correctly use the extracted taskId
          subTaskName: sub.subTask, // Ensure the column name matches your DB schema
          subTaskStatus: sub.subTaskStatus, // Ensure the column name matches your DB schema
        });
      }
    }
    await transaction.commit();
    res.status(201).json({ message: "Data saved successfully!" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Error saving data" });
  }
};

const getAllWorkFlow = async (req, res) => {
  const { companyId } = req.params;

  try {
    // Retrieve workflows
    const workflows = await db("workFlow")
      .where({ companyId })
      .select(
        "workFlowId",
        "workFlowName",
        "agreementName",
        "googleFileLink",
        "priorityLevel"
      );

    // Retrieve tasks
    const tasks = await db("tasks")
      .join("workFlow", "tasks.workFlowId", "workFlow.workFlowId")
      .where("workFlow.companyId", companyId)
      .select(
        "tasks.taskId",
        "tasks.taskName",
        "tasks.taskDescription",
        "tasks.assignee",
        "tasks.status",
        "tasks.targetDate",
        "tasks.workFlowId",
        "tasks.assignedBy"
      );

    // Retrieve subtasks
    const subTasks = await db("subTasks")
      .join("tasks", "subTasks.taskId", "tasks.taskId")
      .join("workFlow", "tasks.workFlowId", "workFlow.workFlowId")
      .where("workFlow.companyId", companyId)
      .select(
        "subTasks.subTaskId",
        "subTasks.subTaskName",
        "subTasks.subTaskStatus",
        "subTasks.taskId"
      );

    // Retrieve users separately
    const users = await db("users")
      .whereIn(
        "user_id",
        tasks.map((task) => task.assignedBy)
      )
      .select("user_id", "first_name");

    // Create a map of user_id to user full name for quick lookup
    const userMap = new Map(
      users.map((user) => [
        user.user_id,
        `${user.first_name}`, // Combine first and last names
      ])
    );

    // Combine data
    const data = workflows.map((workflow) => {
      const workflowTasks = tasks.filter(
        (task) => task.workFlowId === workflow.workFlowId
      );
      const tasksWithSubTasks = workflowTasks.map((task) => {
        const taskSubTasks = subTasks.filter(
          (subTask) => subTask.taskId === task.taskId
        );
        return {
          ...task,
          assignedByName: userMap.get(task.assignedBy), // Add user full name to task
          subTasks: taskSubTasks,
        };
      });
      return {
        ...workflow,
        tasks: tasksWithSubTasks,
      };
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ message: "Error retrieving data" });
  }
};

export { createWorkFlow, getAllWorkFlow };
