import redis from "../utils/redis";
import bcrypt from "bcrypt";

const REFRESH_EXPIRE_SECONDS = 60 * 60 * 24 * 7;

export async function storeRefreshToken(userId: string, token: string) {
  const hashedToken = await bcrypt.hash(token, 10);
  await redis.set(`refresh:${userId}`, hashedToken, {
    EX: REFRESH_EXPIRE_SECONDS,
  });
}

export async function validateRefreshToken(
  userId: string,
  token: string
): Promise<boolean> {
  const storedHashed = await redis.get(`refresh:${userId}`);
  if (!storedHashed) return false;
  return await bcrypt.compare(token, storedHashed);
}

export async function deleteRefreshToken(userId: string) {
  await redis.del(`refresh:${userId}`);
}
