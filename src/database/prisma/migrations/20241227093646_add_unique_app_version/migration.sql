/*
  Warnings:

  - A unique constraint covering the columns `[version]` on the table `Application` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Application_version_key" ON "Application"("version");
