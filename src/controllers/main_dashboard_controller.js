import db from "../database/db.js";

export const viewMainDashboard = async (req, res) => {

    const notarization = await db('records').select("*").where({status : 'For Notarization'});
    const completed = await db('records').select("*").where({status : 'Completed'});
    const pending = await db('records').select("*").where({status : 'Pending for Approval'});
    const approved = await db('records').select("*").where({status : 'Approved'});
    const drafted = await db('records').select("*").where({status : 'Saved as Draft'});
    const routed = await db('records').select("*").where({status : 'Routed for Signature'});
    const filed = await db('records').select("*").where({status: "Filed with SEC"});

    res.status(200).json({notarization, completed, pending, approved, drafted, routed, filed});
};

