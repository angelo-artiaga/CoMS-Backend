import db from "../database/db.js";
import { sanitizeObject } from "../utils/sanitize.js";
import cloudinary from "../utils/cloudinary.js";

const uploadImage = async (imagePath, company_name) => {
  // Upload image to Cloudinary
  try {
    console.log("Image Path: ", imagePath);
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "Tsekpay/Companies/Logos",
      public_id: company_name,
      overwrite: true,
    });

    fs.unlinkSync(imagePath);
    return result;
  } catch (error) {
    console.log("Error: ", error);
  }
};

const getAllCompany = async (req, res) => {
  try {

    const data = await db("companies").select("*");

    res.send(data);
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};
const createCompany = async (req, res) => {
  const { companyId, companyName, logo, secNumber } = req.body;

  try {
    const data = await db("companies").insert({
      companyId: companyId,
      companyName: companyName,
      logo: logo,
      secNumber: secNumber,
    });

    if (data) {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!" });

  }
};

const getCompany = async (req, res) => {
  const companyId = req.params.id;
  try {
    const data = await db("companies")
      .select("*")
      .where("companyId", companyId);
    res.send(data);
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

const updateCompany = async (req, res) => {
  const companyId = req.params.companyId;
  const { companyName, logo, secNumber } = req.body;

  try {
    const data = await db("companies").where("companyId", companyId).update({
      companyId: companyId,
      companyName: companyName,
      logo: logo,
      secNumber: secNumber,
    });
    console.log(data);
    if (data) {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};
const deleteCompany = async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const data = await db("companies").where("companyId", companyId).update({
      status: false,
    });
    console.log(data);
    if (data) {
      res.sendStatus(200);
    }
  } catch (e) {
    res.json({ response: "ERROR!" });
  }
};

export {
  getAllCompany,
  createCompany,
  getCompany,
  updateCompany,
  deleteCompany,
};
