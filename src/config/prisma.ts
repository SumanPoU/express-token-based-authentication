import config from './config';
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use globalThis to avoid multiple clients during hot reload
const prismaClient =
  globalThis.prisma ||
  new PrismaClient({
    log: config.nodeEnv !== 'production' ? ['query', 'error', 'warn'] : ['error'],
  });

if (config.nodeEnv !== 'production') globalThis.prisma = prismaClient;

export default prismaClient;
