/* eslint-disable @typescript-eslint/no-unused-vars, no-unused-vars */
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';
declare global {
  // `var` allows re‑assignment by TypeScript in dev mode
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
export const prisma = global.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;