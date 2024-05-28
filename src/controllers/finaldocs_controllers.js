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

export { getAllFinalDocs, addFinalDocs };
