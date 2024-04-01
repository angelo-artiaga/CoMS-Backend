import db from "../database/db.js";

const viewAllOrg = async (req, res) => {
  try {
    const data = await db("company").select("*");

    res.send(data);
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

const viewOrg = async (req, res) => {
  const org_id = req.params.id;
  try {
    const data = await db("company").select("*").where("company_id", org_id);
    res.send(data);
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

const createOrg = async (req, res) => {
  const { admin_id, company_name, address, managed_by, storage_link } =
    req.body;

  try {
    const data = await db("company").insert({
      admin_id: admin_id,
      company_name: company_name,
      address: address,
      managed_by: managed_by,
      storage_link: storage_link,
    });

    if (data) {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

const editOrg = async (req, res) => {
  const org_id = req.params.org_id;
  const { admin_id, company_name, address, managed_by, storage_link } =
    req.body;

  try {
    const data = await db("company").where("company_id", org_id).update({
      admin_id: admin_id,
      company_name: company_name,
      address: address,
      managed_by: managed_by,
      storage_link: storage_link,
    });
    console.log(data);
    if (data) {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

const removeOrg = async (req, res) => {
  const org_id = req.params.org_id;

  try {
    const data = await db("company")
      .where("company_id", org_id)
      .del(["company_id"], { includeTriggerModifications: true });
    if (data.length < 0) {
      res.json({ response: "WARNING", detail: "Record doesn't exist" });
    } else {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

export { viewAllOrg, viewOrg, createOrg, editOrg, removeOrg };
