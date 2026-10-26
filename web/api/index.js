// Single Vercel Function for the whole API. vercel.json routes /api/* here.
import { handle } from '../lib/app.js';

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
export const OPTIONS = handle;
