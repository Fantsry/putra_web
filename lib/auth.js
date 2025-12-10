import bcrypt from "bcryptjs";

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(input, stored) {
  if (!stored) return false;
  // If stored looks like a bcrypt hash, verify with bcrypt; otherwise plain compare
  const looksHashed = stored.startsWith("$2") && stored.length > 30;
  if (looksHashed) {
    return bcrypt.compare(input, stored);
  }
  return input === stored;
}
