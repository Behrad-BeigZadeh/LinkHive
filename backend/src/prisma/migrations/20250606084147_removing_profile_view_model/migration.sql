/*
  Warnings:

  - You are about to drop the `ProfileView` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileView" DROP CONSTRAINT "ProfileView_userId_fkey";

-- DropTable
DROP TABLE "ProfileView";
