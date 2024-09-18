import { uploadImage } from "../utils/cloudinary.js";
import db from "../database/db.js";

const getAllFinalDocs = async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const data = await db("finalDocs")
      .select("*")
      .where("companyId", companyId);

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error", err: e });
  }
};

const addFinalDocs = async (req, res) => {
  const { files, fileType } = req.body;

  const companyId = req.params.companyId;

  try {
    if (files.length >= 1) {
      const uploadedFiles = await Promise.all(
        files.map(async (file, index) => {
          let upload = await uploadImage(file.file, file.fileName);

          return {
            companyId: companyId,
            fileLink: upload,
            fileName: file.fileName,
            fileType: fileType,
          };
        })
      );

      const data = await db("finalDocs")
        .insert(uploadedFiles)
        .returning([
          "fileId",
          "companyId",
          "fileName",
          "fileType",
          "fileLink",
          "created_at",
          "updated_at",
        ]);

      res.status(200).send({ success: true, data: data });
    } else {
      res
        .status(422)
        .send({ success: true, err: "Failed to insert the record" });
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
};

const checkWarnings = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const company = await db("companies")
      .select("*")
      .where("companyId", companyId)
      .first();
    const gis_records = await db("records")
      .select("*")
      .where("companyId", companyId);

    const gis_records_current_year = gis_records.filter(
      (record) =>
        record.draftingInput.year == new Date().getFullYear() &&
        record.status == "Completed"
    );

    const gdrivefolders = JSON.parse(company.gdrivefolders);
    let MC28Form = "";

    if (gdrivefolders != null) {
      if (
        gdrivefolders.MC28Form != undefined &&
        gdrivefolders.MC28Form != null &&
        gdrivefolders.MC28Form != ""
      ) {
        MC28Form = gdrivefolders.MC28Form;
      }
    }

    res.status(200).json({
      MC28Form,
      current_year_GIS_count: gis_records_current_year.length,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Internal Server Error", err: e });
  }
};

export { getAllFinalDocs, addFinalDocs, checkWarnings };