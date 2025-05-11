/*
  Warnings:

  - Made the column `maxUses` on table `Coupon` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "appliedCouponId" TEXT;

-- AlterTable
ALTER TABLE "Coupon" ALTER COLUMN "maxUses" SET NOT NULL;
