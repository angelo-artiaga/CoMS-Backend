import db from "../database/db.js";

const createProfile = async (req, res) => {
  const {
    email,
    first_name,
    middle_name,
    last_name,
    date_of_birth,
    account_type,
    oauth_provider,
    oauth_id,
    oauth_access_token,
  } = req.body;

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

export { createProfile, viewProfile, updateProfile, deleteProfile };
