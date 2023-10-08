import { PrismaClient } from '@prisma/client';
import { config } from '@/core/config';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type prismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: prismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma || prismaClientSingleton();

if (!config.isProduction) {
  globalForPrisma.prisma = prisma;
}