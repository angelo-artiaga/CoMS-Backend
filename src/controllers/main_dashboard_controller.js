import db from "../database/db.js";

export const viewMainDashboard = async (req, res) => {

    const notarization = await db('records').select("*").where({status : 'For Notarization'});
    console.log(notarization);
    res.status(200).json({notarization});
};

