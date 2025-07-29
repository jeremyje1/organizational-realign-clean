/*
  Warnings:

  - You are about to drop the `KPI` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Person` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StrategicPillar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnitStrategicPillar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "KPI" DROP CONSTRAINT "KPI_pillarId_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_personId_fkey";

-- DropForeignKey
ALTER TABLE "Position" DROP CONSTRAINT "Position_unitId_fkey";

-- DropForeignKey
ALTER TABLE "StrategicPillar" DROP CONSTRAINT "StrategicPillar_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Unit" DROP CONSTRAINT "Unit_parentUnitId_fkey";

-- DropForeignKey
ALTER TABLE "UnitStrategicPillar" DROP CONSTRAINT "UnitStrategicPillar_pillarId_fkey";

-- DropForeignKey
ALTER TABLE "UnitStrategicPillar" DROP CONSTRAINT "UnitStrategicPillar_unitId_fkey";

-- DropTable
DROP TABLE "KPI";

-- DropTable
DROP TABLE "Organization";

-- DropTable
DROP TABLE "Person";

-- DropTable
DROP TABLE "Position";

-- DropTable
DROP TABLE "StrategicPillar";

-- DropTable
DROP TABLE "Unit";

-- DropTable
DROP TABLE "UnitStrategicPillar";

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workspace_id" TEXT,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
