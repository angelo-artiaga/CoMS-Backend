import db from "../database/db.js";
import { sanitizeObject } from "../utils/sanitize.js";
import cloudinary from "../utils/cloudinary.js";
import fs, { stat } from "fs";

const uploadImage = async (imagePath, company_name) => {
  // Upload image to Cloudinary
  try {
    console.log("Image Path: ", imagePath);
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: "CoMS/Companies/Logos",
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
    const data = await db("companies").select("*").orderBy("created_at", "asc");
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ response: "ERROR!" });
  }
};

const createCompany = async (req, res) => {
  const {
    companyName,
    secNumber,
    corporateTin,
    dateRegistered,
    sss,
    hdmf,
    philHealth,
  } = req.body;

  try {
    if (req.file) {
      const result = await uploadImage(req.file.path, companyName);
      if (result != null) {
        const data = await db("companies")
          .insert({
            companyName: companyName,
            logo: result.secure_url,
            sss: sss,
            hdmf: hdmf,
            philHealth: philHealth,
            secNumber: secNumber,
            corporateTin: corporateTin,
            dateRegistered: dateRegistered,
            status: true,
          })
          .returning([
            "companyId",
            "companyName",
            "logo",
            "sss",
            "hdmf",
            "philHealth",
            "secNumber",
            "corporateTin",
            "dateRegistered",
            "status",
          ]);

        if (data.length > 0) {
          res.status(200).send(data[0]);
        } else {
          res.status(422).send("Failed to insert the record");
        }
      } else {
        res.status(400).send("Please upload a valid logo.");
      }
    }
  } catch (e) {
    res.status(500).json({ response: "ERROR!" });
  }
};

const getCompany = async (req, res) => {
  const companyId = req.params.id;
  try {
    const data = await db("companies")
      .select("*")
      .where("companyId", companyId);
    if (data.length == 1) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: `Company ID: ${companyId} is not found.` });
    }
  } catch (e) {
    res.status(500).json({ error: "Invalid Company ID", err: e });
  }
};

const updateCompany = async (req, res) => {
  const companyId = req.params.id;
  const {
    companyName,
    secNumber,
    corporateTin,
    dateRegistered,
    sss,
    hdmf,
    philHealth,
    gdrivefolders,
  } = req.body;

  try {
    if (req.file) {
      const result = await uploadImage(req.file.path, companyName);
      if (result != null) {
        const data = await db("companies")
          .where("companyId", companyId)
          .update({
            companyId: companyId,
            companyName: companyName,
            logo: result.secure_url,
            secNumber: secNumber,
            corporateTin: corporateTin,
            dateRegistered: dateRegistered,
            status: true,
            sss: sss,
            hdmf: hdmf,
            philHealth: philHealth,
            gdrivefolders: gdrivefolders,
          })
          .returning([
            "companyId",
            "companyName",
            "logo",
            "secNumber",
            "status",
            "dateRegistered",
            "corporateTin",
            "sss",
            "hdmf",
            "philHealth",
          ]);

        if (data.length > 0) {
          res.status(200).json(data[0]);
        } else {
          res.status(422).send("Failed to update the record");
        }
      }
    } else {
      const data = await db("companies")
        .where("companyId", companyId)
        .update({
          companyId: companyId,
          companyName: companyName,
          secNumber: secNumber,
          corporateTin: corporateTin,
          dateRegistered: dateRegistered,
          status: true,
          sss: sss,
          hdmf: hdmf,
          philHealth: philHealth,
          gdrivefolders: gdrivefolders,
        })
        .returning([
          "companyId",
          "companyName",
          "logo",
          "secNumber",
          "status",
          "dateRegistered",
          "corporateTin",
          "sss",
          "hdmf",
          "philHealth",
          "gdrivefolders",
        ]);

      if (data.length > 0) {
        res.status(200).json(data[0]);
      } else {
        res.status(422).send("Failed to update the record");
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ response: "ERROR!" });
  }
};

const changeStatus = async (req, res) => {
  // const companyId = req.params.companyId;
  const { companyId, status } = req.body;

  try {
    const data = await db("companies").where("companyId", companyId).update({
      status: status,
    });

    if (data) {
      res.status(200).json(data);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ response: "ERROR!" });
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
  changeStatus,
};
