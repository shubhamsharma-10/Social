import cloudinary from "../config/cloudinary.js";

export const uploadImage = async (userId: string, fileBuffer: Buffer): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: `Posts/${userId}`
            },
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result!.secure_url);
                }
            }
        ).end(fileBuffer);
    });
};