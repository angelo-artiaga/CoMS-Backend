import db from "../database/db.js";

const viewProfile = (req, res) => {
  const id = req.params.id;

  try {
    db.select("*")
      .from("users")
      .where("user_id", id)
      .then((rows) => {
        console.log(rows);
      });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
};
const updateProfile = (req, res) => {
  try {
    // db("users").insert({});
  } catch (e) {
    res.sendStatus(500);
  }
};
const deleteProfile = (req, res) => {};

export { viewProfile, updateProfile, deleteProfile };
