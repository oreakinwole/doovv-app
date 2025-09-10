import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as mime from 'mime-types';

@Injectable()
export class GoogleCloudService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    // Initialize the Google Cloud Storage client
    this.storage = new Storage({
      keyFilename: path.join(
        __dirname,
        '../../moniger-service-account-file-413516-66a99e351ad8.json',
      ),
      projectId: 'moniger',
    });
    this.bucketName = 'moniger-public-bucket';
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Generate a unique file name
    const fileName = `${uuidv4()}-${file.originalname}`;
    const bucket = this.storage.bucket(this.bucketName);
    const fileUpload = bucket.file(fileName);

    // Upload the file to Google Cloud Storage
    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype, // Set the file content type
      },
      public: true, // Make the file publicly accessible
    });

    // Return the public URL of the uploaded image
    return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
  }

  async uploadImageToGCS(
    imageBuffer: Buffer,
    originalUrl: string,
  ): Promise<string> {
    try {
      const fileExtension = mime.extension(
        mime.lookup(originalUrl) || 'image/jpeg',
      );
      const gcsFileName = `${uuidv4()}.${fileExtension}`; // Generate a unique name for the image

      const bucket = this.storage.bucket(this.bucketName);
      const gcsFile = bucket.file(gcsFileName);

      // Upload the image buffer to GCS
      await gcsFile.save(imageBuffer, {
        metadata: {
          contentType: mime.lookup(originalUrl) || 'image/jpeg',
        },
        public: true, // Make the image publicly accessible
      });

      // Return the public URL of the uploaded image
      return `https://storage.googleapis.com/${this.bucketName}/${gcsFileName}`;
    } catch (error) {
      console.error('Error uploading image to GCS:', error);
      throw new Error('Failed to upload image to GCS.');
    }
  }

  async generateThumbnail(file: Express.Multer.File): Promise<string> {
  const fileName = `${uuidv4()}-thumbnail_${file.originalname}`;
  const bucket = this.storage.bucket(this.bucketName);
  const fileUpload = bucket.file(fileName);

  const image = sharp(file.buffer);

  const thumbnailBuffer = await image
    .resize({
      width: 150,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 70 }) 
    .toBuffer();

 
  await fileUpload.save(thumbnailBuffer, {
    metadata: {
      contentType: file.mimetype,
    },
    public: true,
  });

  return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
}

async uploadVideoFile(file: Express.Multer.File): Promise<string> {
  const fileName = `${uuidv4()}-${file.originalname}`;
  const bucket = this.storage.bucket(this.bucketName);
  const fileUpload = bucket.file(fileName);

  return new Promise((resolve, reject) => {
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    stream.on('error', () => {
      reject(new HttpException('Failed to upload video', 400));
    });

    stream.on('finish', async () => {
      try {
        await fileUpload.makePublic();
        resolve(`https://storage.googleapis.com/${this.bucketName}/${fileName}`);
      } catch {
        reject(new HttpException('Could not make file public', 400));
      }
    });

    stream.end(file.buffer);
  });
}



  async uploadPdf(buffer: Buffer, filename: string): Promise<string> {
    const bucket = this.storage.bucket(this.bucketName);
    const newFileName = 'pdf/' + filename;
    const file = bucket.file(newFileName);

    await file.save(buffer, {
      metadata: { contentType: 'application/pdf' },
      public: true, // make the file public
    });

    return `https://storage.googleapis.com/${this.bucketName}/${newFileName}`;
  }
}
