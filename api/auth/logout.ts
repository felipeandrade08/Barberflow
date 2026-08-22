import type { VercelRequest,VercelResponse } from '@vercel/node';
import { clearSession } from '../_lib/auth';
export default function handler(req:VercelRequest,res:VercelResponse){ clearSession(res); res.status(200).json({ok:true}); }
