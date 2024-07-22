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

const getUser = async (req, res) => {
  const { id } = req.params; // Extracting the user ID from the request parameters

  try {
    // Fetch the user details by ID
    const user = await db("users").select("*").where("user_id", id).first();

    if (!user) {
      // If no user is found, return a 404 status with a message
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the user's roles
    const userRoles = await db("user_roles")
      .select("roles.*")
      .join("roles", "user_roles.role_id", "roles.role_id")
      .where("user_roles.user_id", id);

    // Add the roles to the user object
    user.roles = userRoles;

    // Return the user object with roles
    res.status(200).json(user);
  } catch (error) {
    // Handle any errors that occur during the database operations
    res.status(500).json({ error: error.message });
  }
};

const getUserBySlackId = async (req, res) => {
  const { slackId } = req.params; // Extracting the user ID from the request parameters

  try {
    // Fetch the user details by ID
    const user = await db("users")
      .select("*")
      .where("slackId", slackId)
      .first();

    if (!user) {
      // If no user is found, return a 404 status with a message
      return res.status(404).json({ message: "User not found" });
    }

    // Return the user object with roles
    res.status(200).json(user);
  } catch (error) {
    // Handle any errors that occur during the database operations
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { status, role } = req.body;

  // console.log(req.body);
  // res.status(200).json(req.body);
  // return;
  try {
    let toUpdate = {
      status: status,
    };
    const updateuser = await db("users")
      .update(toUpdate)
      .where("user_id", user_id)
      .returning(["user_id", "status"]);

    //delete all permissions associated with the role
    const deleteuserrole = await db("user_roles")
      .where("user_id", user_id)
      .delete();
    // assign role based from the request
    role.map(async (role) => {
      await db("user_roles").insert({
        role_id: role.role_id,
        user_id: user_id,
      });
    });
    res.status(200).json({ success: true, result: updateuser });
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
  getUser,
  getUserBySlackId,
  updateUser,
};
