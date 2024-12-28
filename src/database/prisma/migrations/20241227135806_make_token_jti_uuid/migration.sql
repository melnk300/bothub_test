/*
  Warnings:

  - The primary key for the `Token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `jti` on the `Token` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Token" DROP CONSTRAINT "Token_pkey",
DROP COLUMN "jti",
ADD COLUMN     "jti" UUID NOT NULL,
ADD CONSTRAINT "Token_pkey" PRIMARY KEY ("jti");
