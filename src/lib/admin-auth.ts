import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

type StoredCreds = {
  passwordHash: string;
  updatedAt: string;
};

const CREDS_FILE = path.join(process.cwd(), ".admin-auth.json");
const HASH_PREFIX = "scrypt";

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${HASH_PREFIX}$${salt}$${derived}`;
}

function verifyHash(password: string, stored: string) {
  const [algo, salt, expectedHex] = (stored || "").split("$");
  if (algo !== HASH_PREFIX || !salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

async function readStoredCreds(): Promise<StoredCreds | null> {
  try {
    const raw = await fs.readFile(CREDS_FILE, "utf8");
    const parsed = JSON.parse(raw) as StoredCreds;
    if (!parsed?.passwordHash) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function verifyAdminPassword(inputPassword: string) {
  const stored = await readStoredCreds();
  if (stored?.passwordHash) {
    return verifyHash(inputPassword, stored.passwordHash);
  }
  const envPassword = process.env.ADMIN_PASSWORD || "";
  return inputPassword === envPassword;
}

export async function setAdminPassword(newPassword: string) {
  const payload: StoredCreds = {
    passwordHash: hashPassword(newPassword),
    updatedAt: new Date().toISOString(),
  };
  await fs.writeFile(CREDS_FILE, JSON.stringify(payload, null, 2), "utf8");
}

