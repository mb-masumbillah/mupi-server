import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const uploadPdfToCloudinary = (
  publicId: string,
  buffer: Buffer
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "notices",
        public_id: publicId,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
