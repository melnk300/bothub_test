import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const clearDatabase = async () => {
    const tables = await prisma.$queryRawUnsafe(`
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public';
    `);

    await prisma.$executeRawUnsafe(`SET session_replication_role = 'replica';`);

    for (const { tablename } of tables as any) {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
    }

    await prisma.$executeRawUnsafe(`SET session_replication_role = 'origin';`);
};

export const closeDatabaseConnection = async () => {
    await prisma.$disconnect();
};
