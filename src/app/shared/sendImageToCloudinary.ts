import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import config from "../config";

// ----------------- Cloudinary Config -----------------
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.api_key,
  api_secret: config.api_secret,
});

// ----------------- Multer Setup -----------------
const multerStorage = multer.memoryStorage(); // memory storage for serverless
export const upload = multer({ storage: multerStorage });

// ----------------- Cloudinary Upload Function -----------------
/**
 * Upload file buffer to Cloudinary
 * @param imageName string - public_id in Cloudinary
 * @param fileBuffer Buffer - from multer memoryStorage
 */
export const uploadToCloudinary = (imageName: string, fileBuffer: Buffer) => {
  return new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "users", public_id: imageName },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );
    stream.end(fileBuffer); // push buffer to Cloudinary
  });
};
