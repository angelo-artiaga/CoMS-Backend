import db from "../database/db.js";

const ROLES_LIST = ["Admin", "Manager", "User"];

const PERMISSIONS_LIST = [
  "View Company",
  "Add Company",
  "Edit Company",
  "Delete Company",
  "Change Status Company",
  "View GIS Approval",
  "Approve GIS Approval",
  "Revert GIS Approval",
];

const addNewRole = async (role) => {
  return await db("roles").insert(role).returning(["role_id", "role_name"]);
};

const addNewPermission = async (permission) => {
  return await db("permissions")
    .insert(permission)
    .returning(["permission_id", "permission_name"]);
};

const assignPermission = async (object) => {
  return await db("role_permissions")
    .insert(object)
    .returning(["role_permission_id", "role_id", "permission_id"]);
};

const assignRole = async (object) => {
  return await db("user_roles")
    .insert(object)
    .returning(["user_roles_id", "user_id", "role_id"]);
};

export const seeders = async (req, res) => {
  try {
    const roles = await db("roles").select("*");
    if (roles.length === 0) {
      let admin = await addNewRole({ role_name: "Administrator" });
      let user = await addNewRole({ role_name: "User" });
      let manager = await addNewRole({ role_name: "Manager" });

      let permissions = PERMISSIONS_LIST.map((permission, index) => {
        return {
          permission_name: permission,
        };
      });

      let addedPermissions = await addNewPermission(permissions);
      addedPermissions.map(async (permission, index) => {
        await assignPermission({
          role_id: admin[0].role_id,
          permission_id: permission.permission_id,
        });
      });

      let Administrator = await db("users")
        .select("*")
        .where("email", "benjie@fullsuite.ph")
        .orWhere("email", "michael@fullsuite.ph");

      if (Administrator.length > 0) {
        await assignRole({
          role_id: admin[0].role_id,
          user_id: Administrator[0].user_id,
        });
        res.status(200).json({ success: true, roles: "sucess" });
      } else {
        res.status(200).json({ success: false, roles: "failed to find admin" });
      }
    } else {
      res.status(200).json({ success: false, roles: roles });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", err: error });
  }
};

export const getAllRoles = async (req, res) => {
  try {
    let roles = await db("roles").select("*");
    let getPermissions = await Promise.all(
      roles.map(async (role, index) => {
        let permissions = await db("role_permissions")
          .select(
            "role_permission_id",
            "permission_name",
            "permissions.permission_id"
          )
          .innerJoin(
            "permissions",
            "permissions.permission_id",
            "role_permissions.permission_id"
          )
          .where("role_id", role.role_id);
        role.permissions = permissions;
        return role;
      })
    );
    res.status(200).json({ success: true, roles: getPermissions });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};

export const addRole = async (req, res) => {
  const { role_name, permissions } = req.body;

  try {
    let newrole = await db("roles")
      .insert({ role_name: role_name })
      .returning(["role_id", "role_name"]);

    if (newrole.length == 1) {
      permissions.map(async (permission) => {
        await assignPermission({
          role_id: newrole[0].role_id,
          permission_id: permission.permission_id,
        });
      });
    }

    res.status(200).json({
      success: true,
      result: {
        role_name: role_name,
        role_id: newrole[0].role_id,
        permissions: permissions,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};

export const updateRole = async (req, res) => {
  const { role_id } = req.params;
  const { role_name, permissions } = req.body;
  try {
    let toUpdate = {
      role_name: role_name,
    };
    const updaterole = await db("roles")
      .update(toUpdate)
      .where("role_id", role_id)
      .returning(["role_id", "role_name"]);

    //delete all permissions associated with the role
    const deleterolepermisions = await db("role_permissions")
      .where("role_id", role_id)
      .delete();

    // //add all permissions that is from the req.body to update the permissions
    permissions.map(async (permission) => {
      await assignPermission({
        role_id: role_id,
        permission_id: permission.permission_id,
      });
    });

    res.status(200).json({ success: true, result: updaterole });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};

export const deleteRole = async (req, res) => {
  const { role_id } = req.params;

  console.log(role_id);
  try {
    const deleterolepermisions = await db("role_permissions")
      .where("role_id", role_id)
      .delete();
    const deleterole = await db("roles").where("role_id", role_id).delete();

    res
      .status(200)
      .json({ success: true, result: { deleterole, deleterolepermisions } });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};
