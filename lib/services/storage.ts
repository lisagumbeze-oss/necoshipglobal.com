import { randomUUID } from "crypto";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export type StoredObject = {
  key: string;
  url: string;
  mimeType?: string;
  sizeBytes?: number;
};

const memoryFiles = new Map<string, { content: Buffer; mimeType?: string }>();

export async function storeObject(input: {
  key?: string;
  body: Buffer | string;
  mimeType?: string;
  folder?: string;
}): Promise<StoredObject> {
  const key = input.key ?? `${input.folder ?? "uploads"}/${randomUUID()}`;
  const body = typeof input.body === "string" ? Buffer.from(input.body) : input.body;

  if (env.r2Endpoint && env.r2AccessKeyId && env.r2SecretAccessKey) {
    try {
      // Optional dependency: only used when R2 credentials are configured.
      // Optional SDK — ignore at bundle time when the package is not installed.
      const aws = await import(/* webpackIgnore: true */ "@aws-sdk/client-s3" as string).catch(() => null);
      if (aws) {
        const client = new aws.S3Client({
          region: "auto",
          endpoint: env.r2Endpoint,
          credentials: {
            accessKeyId: env.r2AccessKeyId,
            secretAccessKey: env.r2SecretAccessKey
          }
        });
        await client.send(
          new aws.PutObjectCommand({
            Bucket: env.r2Bucket,
            Key: key,
            Body: body,
            ContentType: input.mimeType
          })
        );
        const url = env.r2PublicBaseUrl
          ? `${env.r2PublicBaseUrl.replace(/\/$/, "")}/${key}`
          : `${env.r2Endpoint}/${env.r2Bucket}/${key}`;
        return { key, url, mimeType: input.mimeType, sizeBytes: body.byteLength };
      }
    } catch (error) {
      logger.error("R2 upload failed; falling back to memory storage", {
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  memoryFiles.set(key, { content: body, mimeType: input.mimeType });
  return {
    key,
    url: `/api/files/${encodeURIComponent(key)}`,
    mimeType: input.mimeType,
    sizeBytes: body.byteLength
  };
}

export function getMemoryFile(key: string) {
  return memoryFiles.get(key);
}
