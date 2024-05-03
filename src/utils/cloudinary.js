import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

export const uploadImage = (image, fileName) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, {
      overwrite: true,
      invalidate: true,
      resource_type: "auto",
      folder: "CoMS/Companies/files",
      public_id: fileName,
    }, (error, result) => {
      if (result && result.secure_url) {
        console.log(result.secure_url);
        return resolve(result.secure_url);
      }
      console.log(error.message);
      return reject({ message: error.message });
    });
  });
};

export default cloudinary;
