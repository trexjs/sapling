import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
export const redis=new IORedis(process.env.REDIS_URL??'redis://localhost:6379',{maxRetriesPerRequest:null});
export const queue=new Queue('mobile-releases',{connection:redis});
export const s3=new S3Client({region:process.env.S3_REGION??'us-east-1',endpoint:process.env.S3_ENDPOINT,forcePathStyle:true,credentials:{accessKeyId:process.env.S3_ACCESS_KEY??'mobile',secretAccessKey:process.env.S3_SECRET_KEY??'mobilepass123'}});
export const bucket=process.env.S3_BUCKET??'mobile-artifacts';
export async function upload(bytes:Uint8Array,contentType:string,key=`artifacts/${randomUUID()}`){await s3.send(new PutObjectCommand({Bucket:bucket,Key:key,Body:bytes,ContentType:contentType}));return key;}
export async function download(key:string){return s3.send(new GetObjectCommand({Bucket:bucket,Key:key}));}
