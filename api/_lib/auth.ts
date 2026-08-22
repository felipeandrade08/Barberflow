import crypto from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const secret = () => process.env.AUTH_SECRET || 'change-me-in-production';
const b64 = (s: string | Buffer) => Buffer.from(s).toString('base64url');
const unb64 = (s: string) => Buffer.from(s, 'base64url').toString();
export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
export function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(':');
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'));
}
export function signToken(payload: Record<string, unknown>, expiresIn = 60 * 60 * 24 * 7) {
  const body = b64(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expiresIn }));
  const sig = b64(crypto.createHmac('sha256', secret()).update(body).digest());
  return `${body}.${sig}`;
}
export function readToken(token?: string) {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = b64(crypto.createHmac('sha256', secret()).update(body).digest());
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const data = JSON.parse(unb64(body));
  if (data.exp < Math.floor(Date.now() / 1000)) return null;
  return data;
}
export function setSession(res: VercelResponse, token: string) {
  res.setHeader('Set-Cookie', `bf_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);
}
export function clearSession(res: VercelResponse) {
  res.setHeader('Set-Cookie', 'bf_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
}
export function session(req: VercelRequest) {
  const cookie = req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('bf_session='));
  return readToken(cookie?.slice('bf_session='.length));
}
export function requireSession(req: VercelRequest, res: VercelResponse) {
  const s = session(req);
  if (!s) { res.status(401).json({ error: 'Sessão expirada.' }); return null; }
  return s;
}
