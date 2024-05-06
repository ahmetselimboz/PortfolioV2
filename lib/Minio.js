require("dotenv").config();
const Minio = require("minio");
const config = require("../config/environments");

class MinioHandler {
  constructor() {
    try {
      this.bucketName = config.MINIO_BUCKET_NAME;
    } catch (error) {
      console.error("Error creating Minio client:", error);
    }
  }

  async initializeMinioClient() {
    return new Minio.Client({
      endPoint: config.MINIO_ENDPOINT,
      port: Number(config.MINIO_PORT),
      useSSL: false,
      accessKey: config.MINIO_ACCESS_KEY,
      secretKey: config.MINIO_SECRET_KEY,
    });
  }

  async bucketExists() {
    try {
      const minioClient = new Minio.Client({
        endPoint: config.MINIO_ENDPOINT,
        port: Number(config.MINIO_PORT),
        useSSL: false,
        accessKey: config.MINIO_ACCESS_KEY,
        secretKey: config.MINIO_SECRET_KEY,
      });
      const exists = await minioClient.bucketExists(this.bucketName);
      if (!exists) {
        await minioClient.makeBucket(this.bucketName, "us-east-1");
        console.log(`Bucket "${this.bucketName}" created in "us-east-1" region.`);
      } else {
        console.log(`Bucket "${this.bucketName}" already exists.`);
      }
    } catch (error) {
      console.error("Error creating bucket:", error);
    }
  }

  async base64ToImage(baseUrl, name) {
    try {
      const minioClient = new Minio.Client({
        endPoint: config.MINIO_ENDPOINT,
        port: Number(config.MINIO_PORT),
        useSSL: false,
        accessKey: config.MINIO_ACCESS_KEY,
        secretKey: config.MINIO_SECRET_KEY,
      });

      const imageBuffer = Buffer.from(baseUrl.split(",")[1], "base64");

      await minioClient.putObject(
        this.bucketName,
        name,
        imageBuffer,
        imageBuffer.length,
        "image/jpg"
      );

      if (config.LOG_LEVEL === "debug") {
        return `${config.DOMAIN}:9000/${this.bucketName}/${name}`;
      } else {
        return `${config.DOMAIN}/${this.bucketName}/${name}`;
      }

      // let url = this.generateObjectUrl(name);
      // return url;
    } catch (error) {
      console.log("base64ToImage Error: " + error);
    }
  }

  async removeObject(name) {
    try {
      const minioClient = new Minio.Client({
        endPoint: config.MINIO_ENDPOINT,
        port: Number(config.MINIO_PORT),
        useSSL: false,
        accessKey: config.MINIO_ACCESS_KEY,
        secretKey: config.MINIO_SECRET_KEY,
      });

      await minioClient.removeObject(this.bucketName, name);
      console.log("Removed the object");
    } catch (error) {
      console.error("Error removing object:", error);
    }
  }

  // generateObjectUrl(name) {
  //   if (config.LOG_LEVEL === "debug") {
  //     return `${config.DOMAIN}:9000/posttware/${name}`;
  //   } else {
  //     return `${config.DOMAIN}/posttware/${name}`;
  //   }
  // }
}

module.exports = new MinioHandler();
