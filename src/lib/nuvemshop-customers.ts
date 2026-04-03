import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const API_VERSION = "2025-03";

if (!process.env.NUVEMSHOP_TOKEN) {
  throw new Error("NUVEMSHOP_TOKEN is not set in environment variables");
}
if (!process.env.NUVEMSHOP_STORE_ID) {
  throw new Error("NUVEMSHOP_STORE_ID is not set in environment variables");
}

console.log("Nuvemshop store ID loaded:", process.env.NUVEMSHOP_STORE_ID);

const BASE_URL = `https://api.nuvemshop.com.br/${API_VERSION}/${process.env.NUVEMSHOP_STORE_ID}`;
const HEADERS: HeadersInit = {
  Authentication: `bearer ${process.env.NUVEMSHOP_TOKEN}`,
  "User-Agent": "Conde SemiJoias (contato@condesemijoias.com.br)",
  "Content-Type": "application/json",
};

type PasswordPayload =
  | { hash: string; provider: "credentials"; algorithm?: "bcrypt" }
  | {
      hash: string;
      provider: "credentials";
      algorithm: "scrypt";
      salt: string;
    };

function scryptHash(password: string, salt?: string) {
  const resolvedSalt = salt || randomBytes(16).toString("hex");
  const hash = scryptSync(password, resolvedSalt, 64).toString("hex");
  return { salt: resolvedSalt, hash };
}

function safeCompareHex(a: string, b: string): boolean {
  try {
    const left = Buffer.from(a, "hex");
    const right = Buffer.from(b, "hex");
    if (left.length !== right.length) return false;
    return timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

async function loadBcrypt(): Promise<null | {
  hash: (value: string, rounds: number) => Promise<string>;
  compare: (value: string, hash: string) => Promise<boolean>;
}> {
  try {
    const dynamicImport = new Function(
      "moduleName",
      "return import(moduleName)",
    ) as (moduleName: string) => Promise<any>;
    return await dynamicImport("bcryptjs");
  } catch {
    return null;
  }
}

export interface NuvemshopCustomer {
  id: number;
  name: string;
  email: string;
  note?: string | null;
}

/**
 * Finds a customer by email in Nuvemshop.
 */
export async function findCustomerByEmail(email: string) {
  const res = await fetch(
    `${BASE_URL}/customers?email=${encodeURIComponent(email)}`,
    { headers: HEADERS, cache: "no-store" },
  );

  if (!res.ok) {
    console.error("findCustomerByEmail failed:", res.status);
    return null;
  }

  const data = (await res.json()) as unknown;

  if (!Array.isArray(data)) {
    console.error("findCustomerByEmail: unexpected response shape", data);
    return null;
  }

  return data.length > 0 ? (data[0] as NuvemshopCustomer) : null;
}

/**
 * Creates a Nuvemshop customer.
 */
export async function createCustomer(name: string, email: string) {
  const res = await fetch(`${BASE_URL}/customers`, {
    method: "POST",
    headers: HEADERS,
    cache: "no-store",
    body: JSON.stringify({
      name,
      email: email.trim().toLowerCase(),
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.error(
      "Nuvemshop createCustomer failed:",
      res.status,
      JSON.stringify(data),
    );
    throw new Error(
      `Nuvemshop createCustomer failed: ${res.status} - ${JSON.stringify(data)}`,
    );
  }

  const customer = data as NuvemshopCustomer;
  console.log("Nuvemshop customer created:", customer.id, customer.email);
  return customer;
}

/**
 * Persists password hash metadata in customer note.
 */
export async function savePasswordHash(customerId: number, plainPassword: string) {
  let payloadData: PasswordPayload;

  const bcrypt = await loadBcrypt();

  if (bcrypt) {
    const hash = await bcrypt.hash(plainPassword, 12);
    payloadData = { hash, provider: "credentials", algorithm: "bcrypt" };
  } else {
    const scrypt = scryptHash(plainPassword);
    payloadData = {
      hash: scrypt.hash,
      salt: scrypt.salt,
      provider: "credentials",
      algorithm: "scrypt",
    };
  }

  const payload = JSON.stringify(payloadData);
  const encoded = Buffer.from(payload).toString("base64");

  const res = await fetch(`${BASE_URL}/customers/${customerId}`, {
    method: "PUT",
    headers: HEADERS,
    cache: "no-store",
    body: JSON.stringify({ note: encoded }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error(
      "Nuvemshop savePasswordHash failed:",
      res.status,
      JSON.stringify(data),
    );
    throw new Error(`Failed to save password hash: ${res.status}`);
  }

  console.log("Password hash saved for customer:", customerId);
}

/**
 * Verifies if provided password matches customer password hash.
 */
export async function verifyPassword(
  customer: any,
  plainPassword: string,
) {
  if (!customer.note) return false;

  try {
    const decoded = Buffer.from(customer.note, "base64").toString("utf-8");

    let payload: PasswordPayload | null = null;

    try {
      const parsed = JSON.parse(decoded) as PasswordPayload;
      payload = parsed;
    } catch {
      payload = {
        hash: decoded,
        provider: "credentials",
        algorithm: "bcrypt",
      };
    }

    if (!payload?.hash) {
      return false;
    }

    if (payload.algorithm === "scrypt") {
      if (!payload.salt) return false;
      const next = scryptHash(plainPassword, payload.salt);
      return safeCompareHex(next.hash, payload.hash);
    }

    try {
      const bcrypt = await loadBcrypt();
      if (!bcrypt) {
        return false;
      }
      return await bcrypt.compare(plainPassword, payload.hash);
    } catch {
      return false;
    }
  } catch (err) {
    console.error("verifyPassword error:", err);
    return false;
  }
}

/**
 * Finds an existing customer by email or creates a new one.
 * Used for Google OAuth users who have no password.
 * Returns the Nuvemshop customer object.
 */
export async function upsertCustomer(name: string, email: string) {
  const existing = await findCustomerByEmail(email);
  if (existing) return existing;
  return await createCustomer(name, email);
}