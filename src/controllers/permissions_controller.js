import db from "../database/db.js";

const addNewPermission = async (permission) => {
  return await db("permissions")
    .insert(permission)
    .returning(["permission_id", "permission_name"]);
};

export const getAllPermissions = async (req, res) => {
  try {
    let permissions = await db("permissions").select("*");
    res.status(200).json({ success: true, permissions: permissions });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", err: error });
  }
};

export const addPermission = async (req, res) => {
  const { permission_name } = req.body;
  try {
    let toInsert = { permission_name: permission_name };
    let newpermission = await db("permissions")
      .insert(toInsert)
      .returning(["permission_id", "permission_name"]);
    res.status(200).json({ success: true, result: newpermission });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", err: error });
  }
};

export const updatePermission = async (req, res) => {
  const { permission_id } = req.params;
  const { permission_name } = req.body;

  try {
    let toUpdate = {
      permission_name: permission_name,
    };
    const updatePermission = await db("permissions")
      .update(toUpdate)
      .where("permission_id", permission_id)
      .returning(["permission_id", "permission_name"]);

    res.status(200).json({ success: true, result: updatePermission });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", err: error });
  }
};

export const deletePermission = async (req, res) => {
  const { permission_id } = req.params;

  try {
    const deleterole = await db("permissions")
      .where("permission_id", permission_id)
      .delete();
    res.status(200).json({ success: true, result: deleterole });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};
