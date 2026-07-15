import { randomBytes, scryptSync } from "node:crypto";

// Usage: npm run hash -- "your-password"
const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run hash -- "your-password"');
  process.exit(1);
}

const salt = randomBytes(16);
const derived = scryptSync(password, salt, 64);
const hash = `scrypt:${salt.toString("hex")}:${derived.toString("hex")}`;

console.log("\nADMIN_PASSWORD_HASH=" + hash + "\n");
