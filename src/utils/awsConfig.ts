import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// AWS Configuration using Vite environment variables
// Note: Vite only exposes variables prefixed with VITE_
const AWS_ACCESS_KEY_ID = import.meta.env.VITE_AWS_ACCESS_KEY_ID!;
const AWS_SECRET_ACCESS_KEY = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY!;
const AWS_REGION = import.meta.env.VITE_AWS_REGION!;
const S3_BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME!;

// Create S3 client
export const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// Upload file to S3 bucket
export const uploadFileToS3 = async (file: File): Promise<string> => {
  const fileName = `prototypes/${Date.now()}-${file.name}`;
  
  // Convert file to ArrayBuffer for AWS SDK v3 compatibility
  const fileBuffer = await file.arrayBuffer();
  
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: fileName,
    Body: new Uint8Array(fileBuffer),
    ContentType: file.type || 'application/pdf',
    // ACL: 'public-read', // Make file publicly accessible
  });

  try {
    await s3Client.send(command);
    // Construct the public URL
    const publicUrl = `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to S3');
  }
};

export { S3_BUCKET_NAME };
