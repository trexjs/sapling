import fs from 'fs/promises';
import path from 'path';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_TYPES } from '../../config/constants.js';

class StorageService {
  constructor() {
    this.storageType = process.env.NODE_ENV === 'production' ? STORAGE_TYPES.AWS_S3 : STORAGE_TYPES.LOCAL;
    this.initializeStorage();
  }

  initializeStorage() {
    if (this.storageType === STORAGE_TYPES.AWS_S3) {
      this.s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      });
      this.bucketName = process.env.AWS_S3_BUCKET || 'dm-core';
    } else {
      this.localStoragePath = process.env.LOCAL_STORAGE_PATH || './dm-core-storage';
      this.ensureLocalStorageExists();
    }
  }

  async ensureLocalStorageExists() {
    try {
      await fs.access(this.localStoragePath);
    } catch (error) {
      await fs.mkdir(this.localStoragePath, { recursive: true });
    }
  }

  async uploadFile(file, userId, folderPath = '') {
    const fileId = uuidv4();
    const fileExtension = path.extname(file.originalname);
    const fileName = `${fileId}${fileExtension}`;
    
    if (this.storageType === STORAGE_TYPES.AWS_S3) {
      return await this.uploadToS3(file, userId, folderPath, fileName);
    } else {
      return await this.uploadToLocal(file, userId, folderPath, fileName);
    }
  }

  async uploadToS3(file, userId, folderPath, fileName) {
    const key = `users/${userId.toString()}/${folderPath}/${fileName}`.replace(/\/+/g, '/');
    
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private'
    };

    try {
      const result = await this.s3.upload(params).promise();
      return {
        path: key,
        url: result.Location,
        size: file.size
      };
    } catch (error) {
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  async uploadToLocal(file, userId, folderPath, fileName) {
    const userDir = path.join(this.localStoragePath, 'users', userId.toString(), folderPath);
    
    try {
      await fs.mkdir(userDir, { recursive: true });
      
      const filePath = path.join(userDir, fileName);
      await fs.writeFile(filePath, file.buffer);
      
      return {
        path: path.relative(this.localStoragePath, filePath),
        url: null,
        size: file.size
      };
    } catch (error) {
      throw new Error(`Local upload failed: ${error.message}`);
    }
  }

  async downloadFile(filePath) {
    if (this.storageType === STORAGE_TYPES.AWS_S3) {
      return await this.downloadFromS3(filePath);
    } else {
      return await this.downloadFromLocal(filePath);
    }
  }

  async downloadFromS3(filePath) {
    const params = {
      Bucket: this.bucketName,
      Key: filePath
    };

    try {
      const result = await this.s3.getObject(params).promise();
      return {
        buffer: result.Body,
        contentType: result.ContentType,
        contentLength: result.ContentLength
      };
    } catch (error) {
      throw new Error(`S3 download failed: ${error.message}`);
    }
  }

  async downloadFromLocal(filePath) {
    const fullPath = path.join(this.localStoragePath, filePath);
    
    try {
      const buffer = await fs.readFile(fullPath);
      const stats = await fs.stat(fullPath);
      
      return {
        buffer,
        contentType: null, // Will be determined by file extension
        contentLength: stats.size
      };
    } catch (error) {
      throw new Error(`Local download failed: ${error.message}`);
    }
  }

  async deleteFile(filePath) {
    if (this.storageType === STORAGE_TYPES.AWS_S3) {
      return await this.deleteFromS3(filePath);
    } else {
      return await this.deleteFromLocal(filePath);
    }
  }

  async deleteFromS3(filePath) {
    const params = {
      Bucket: this.bucketName,
      Key: filePath
    };

    try {
      await this.s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      throw new Error(`S3 delete failed: ${error.message}`);
    }
  }

  async deleteFromLocal(filePath) {
    const fullPath = path.join(this.localStoragePath, filePath);
    
    try {
      await fs.unlink(fullPath);
      return true;
    } catch (error) {
      throw new Error(`Local delete failed: ${error.message}`);
    }
  }

  async copyFile(sourcePath, destinationPath) {
    if (this.storageType === STORAGE_TYPES.AWS_S3) {
      return await this.copyInS3(sourcePath, destinationPath);
    } else {
      return await this.copyInLocal(sourcePath, destinationPath);
    }
  }

  async copyInS3(sourcePath, destinationPath) {
    const params = {
      Bucket: this.bucketName,
      CopySource: `${this.bucketName}/${sourcePath}`,
      Key: destinationPath,
      ACL: 'private'
    };

    try {
      await this.s3.copyObject(params).promise();
      return true;
    } catch (error) {
      throw new Error(`S3 copy failed: ${error.message}`);
    }
  }

  async copyInLocal(sourcePath, destinationPath) {
    const fullSourcePath = path.join(this.localStoragePath, sourcePath);
    const fullDestinationPath = path.join(this.localStoragePath, destinationPath);
    
    try {
      // Ensure destination directory exists
      await fs.mkdir(path.dirname(fullDestinationPath), { recursive: true });
      await fs.copyFile(fullSourcePath, fullDestinationPath);
      return true;
    } catch (error) {
      throw new Error(`Local copy failed: ${error.message}`);
    }
  }

  async moveFile(sourcePath, destinationPath) {
    if (this.storageType === STORAGE_TYPES.AWS_S3) {
      return await this.moveInS3(sourcePath, destinationPath);
    } else {
      return await this.moveInLocal(sourcePath, destinationPath);
    }
  }

  async moveInS3(sourcePath, destinationPath) {
    // Copy first, then delete
    await this.copyInS3(sourcePath, destinationPath);
    await this.deleteFromS3(sourcePath);
    return true;
  }

  async moveInLocal(sourcePath, destinationPath) {
    const fullSourcePath = path.join(this.localStoragePath, sourcePath);
    const fullDestinationPath = path.join(this.localStoragePath, destinationPath);
    
    try {
      // Ensure destination directory exists
      await fs.mkdir(path.dirname(fullDestinationPath), { recursive: true });
      await fs.rename(fullSourcePath, fullDestinationPath);
      return true;
    } catch (error) {
      throw new Error(`Local move failed: ${error.message}`);
    }
  }

  generatePresignedUrl(filePath, expiresIn = 3600) {
    if (this.storageType !== STORAGE_TYPES.AWS_S3) {
      throw new Error('Presigned URLs are only available for S3 storage');
    }

    const params = {
      Bucket: this.bucketName,
      Key: filePath,
      Expires: expiresIn
    };

    return this.s3.getSignedUrl('getObject', params);
  }
}

export default new StorageService();
