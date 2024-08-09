import cloudinary from "../utils/cloudinaryConfig";

export const deleteImageCloudinary = (publicIds: any) => {
  const imgPublicId = "foods/" + publicIds.split("/").pop()?.split(".").shift();
  return cloudinary.uploader.destroy(imgPublicId, {
    resource_type: "image",
    type: "upload",
  });
};
