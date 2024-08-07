import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../utils/cloudinaryConfig";

const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image required" });
  }

  // Create a readable stream from the file buffer
  const readableStream = Readable.from(req.file.buffer);

  try {
    // Use a Promise to handle the asynchronous upload
    const uploadResult = await new Promise<{ secure_url: string } | void>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { public_id: `foods/${uuidv4()}` },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) {
              reject(error);
              console.log("error_upload", error);
            } else if (result) {
              resolve(result);
            }
          }
        );

        // Pipe the readable stream into the upload stream
        readableStream.pipe(uploadStream);
      }
    );

    if (uploadResult && "secure_url" in uploadResult) {
      req.url = uploadResult.secure_url; // Add the file URL to the request object
      next();
    } else {
      res.status(500).json({ message: "Failed to upload image" });
    }
  } catch (error) {
    res.status(500).json({ error_upload: error });
  }
};

export { upload, uploadToCloudinary };
