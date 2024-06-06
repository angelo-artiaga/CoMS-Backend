import db from "../database/db.js";

const createProfile = async (req, res) => {
  try {
    const data = await db("users").insert({
      email: email,
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      date_of_birth: date_of_birth,
      account_type: account_type,
      oauth_provider: oauth_provider,
      oauth_id: oauth_id,
      oauth_access_token: oauth_access_token,
    });

    if (data) {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!", detail: e.detail });
  }
};

const viewProfile = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await db.select("*").from("users").where("user_id", id);
    res.send(data);
  } catch (e) {
    res.json({ response: "ERROR!", detail: "Record Doesn't Exist" });
  }
};
const updateProfile = async (req, res) => {
  const user_id = req.params.id;
  const { first_name, middle_name, last_name, date_of_birth } = req.body;

  try {
    const data = await db("users").where("user_id", user_id).update({
      first_name: first_name,
      middle_name: middle_name,
      last_name: last_name,
      date_of_birth: date_of_birth,
    });
    if (data) {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!", detail: e.detail });
  }
};
const deleteProfile = async (req, res) => {
  const user_id = req.params.id;

  try {
    const data = await db("users")
      .where("user_id", user_id)
      .del(["user_id"], { includeTriggerModifications: true });
    if (data.length < 0) {
      res.json({ response: "WARNING", detail: "Record doesn't exist" });
    } else {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await db("users").select("*");

    let user_with_roles = await Promise.all(
      users.map(async (user) => {
        let user_role = await db("user_roles")
          .select("*")
          .join("roles", "user_roles.role_id", "roles.role_id")
          .where("user_id", user.user_id);
        user.role = user_role;
        return user;
      })
    );

    res.status(200).json(user_with_roles);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

const updateUser = async (req, res) => {
  const { role_id } = req.params;
  const { role_name, permissions } = req.body;
  try {
    // let toUpdate = {
    //   role_name: role_name,
    // };
    // const updaterole = await db("roles")
    //   .update(toUpdate)
    //   .where("role_id", role_id)
    //   .returning(["role_id", "role_name"]);

    // //delete all permissions associated with the role
    // const deleterolepermisions = await db("role_permissions")
    //   .where("role_id", role_id)
    //   .delete();

    // // //add all permissions that is from the req.body to update the permissions
    // permissions.map(async (permission) => {
    //   await assignPermission({
    //     role_id: role_id,
    //     permission_id: permission.permission_id,
    //   });
    // });

    // res.status(200).json({ success: true, result: updaterole });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, error: "Internal Server Error", err: error });
  }
};

export {
  createProfile,
  viewProfile,
  updateProfile,
  deleteProfile,
  getAllUsers,
  updateUser,
};
