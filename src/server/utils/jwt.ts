import { createRemoteJWKSet, jwtVerify, decodeJwt, type JWTPayload } from 'jose';

const REGION = process.env['COGNITO_REGION'] as string;
const USER_POOL_ID = process.env['COGNITO_USER_POOL_ID'] as string;
const CLIENT_ID = process.env['COGNITO_CLIENT_ID'] as string;

// console.log('process.env', process.env);

if (!REGION || !USER_POOL_ID || !CLIENT_ID) {
  // Keep simple startup-time validation
  console.warn(
    '[auth] Missing required env vars: COGNITO_REGION, COGNITO_USER_POOL_ID, COGNITO_CLIENT_ID',
  );
}

export const ISSUER = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;
const JWKS_URI = `${ISSUER}/.well-known/jwks.json`;

const JWKS = createRemoteJWKSet(new URL(JWKS_URI));

export type TokenUse = 'id' | 'access';

export interface VerifiedUser {
  sub: string;
  email?: string;
  groups: string[];
  raw: JWTPayload;
}

export async function verifyToken(token: string, use: TokenUse): Promise<VerifiedUser> {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: ISSUER,
    audience: use === 'id' ? CLIENT_ID : undefined,
  });

  const tokenUse = payload['token_use'];
  if (tokenUse !== use) {
    throw new Error(`Invalid token_use: expected ${use} got ${tokenUse}`);
  }
  const sub = String(payload['sub'] || '');
  const email = payload['email'] ? String(payload['email']) : undefined;
  const groups = Array.isArray(payload['cognito:groups'])
    ? (payload['cognito:groups'] as string[]).map((g) => g.toLowerCase())
    : [];

  return { sub, email, groups, raw: payload };
}

export function decodeIdTokenUnsafe(token: string): VerifiedUser | null {
  try {
    const payload = decodeJwt(token);
    const sub = String(payload['sub'] || '');
    const email = payload['email'] ? String(payload['email']) : undefined;
    const groups = Array.isArray(payload['cognito:groups'])
      ? (payload['cognito:groups'] as string[]).map((g) => g.toLowerCase())
      : [];
    return { sub, email, groups, raw: payload };
  } catch {
    return null;
  }
}
