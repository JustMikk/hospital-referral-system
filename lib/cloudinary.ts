import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export interface UploadResult {
    public_id: string;
    secure_url: string;
    format: string;
    bytes: number;
    original_filename: string;
}

export async function uploadDocument(
    file: Buffer,
    fileName: string,
    folder: string = "medical-documents"
): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder,
                public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, "")}`,
                format: fileName.split(".").pop(),
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                        format: result.format,
                        bytes: result.bytes,
                        original_filename: result.original_filename,
                    });
                }
            }
        ).end(file);
    });
}

export async function deleteDocument(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
}

export function getDocumentUrl(publicId: string): string {
    return cloudinary.url(publicId, {
        resource_type: "raw",
        secure: true,
    });
}

