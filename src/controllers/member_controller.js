import db from "../database/db.js";
const viewAllMembers = async (req, res) => {
  const { org_id } = req.params;
  try {
    const data = await db("company")
      .select("managed_by")
      .where("company_id", org_id);

    res.send(data);
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

const addMember = async (req, res) => {
  const { org_id } = req.params;
  const { managed_by } = req.body;
  try {
    const data = await db("company")
      .where("company_id", org_id)
      .insert({ managed_by: managed_by });
    console.log(data);
    if (data) {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
  /**
   * req.params.org_id = organization ID
   */
  // add member_id to org
};

const removeMember = async (req, res) => {
  const { org_id, id } = req.params;

  try {
    const data = await db("company")
      .where("company_id", org_id)
      .update({ managed_by: db.raw("array_remove(managed_by, ?)", [id]) });
    console.log(data);
    if (data) {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
  /**
   * req.params.org_id = organization ID
   * req.params.id = member ID
   */
  // remove member from org
};

export { viewAllMembers, addMember, removeMember };
