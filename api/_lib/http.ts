import type { VercelRequest, VercelResponse } from '@vercel/node';
export const json = (res: VercelResponse, status: number, data: unknown) => res.status(status).json(data);
export const method = (req: VercelRequest, res: VercelResponse, allowed: string[]) => { if (!allowed.includes(req.method || '')) { res.setHeader('Allow', allowed.join(', ')); res.status(405).json({ error: 'Método não permitido.' }); return false; } return true; };
