-- Drop global unique email (multi-tenant: scope by userId)
DROP INDEX IF EXISTS "Customer_email_key";

-- Single address field (matches application layer)
ALTER TABLE "Customer" ADD COLUMN IF NOT EXISTS "address" TEXT;

UPDATE "Customer"
SET "address" = NULLIF(
  TRIM(
    CONCAT_WS(
      ', ',
      NULLIF("addressLine1", ''),
      NULLIF("addressLine2", ''),
      NULLIF("city", ''),
      NULLIF("state", ''),
      NULLIF("postalCode", ''),
      NULLIF("country", '')
    )
  ),
  ''
)
WHERE "address" IS NULL
  AND (
    "addressLine1" IS NOT NULL
    OR "addressLine2" IS NOT NULL
    OR "city" IS NOT NULL
    OR "state" IS NOT NULL
    OR "postalCode" IS NOT NULL
    OR "country" IS NOT NULL
  );

ALTER TABLE "Customer" DROP COLUMN IF EXISTS "addressLine1";
ALTER TABLE "Customer" DROP COLUMN IF EXISTS "addressLine2";
ALTER TABLE "Customer" DROP COLUMN IF EXISTS "city";
ALTER TABLE "Customer" DROP COLUMN IF EXISTS "state";
ALTER TABLE "Customer" DROP COLUMN IF EXISTS "postalCode";
ALTER TABLE "Customer" DROP COLUMN IF EXISTS "country";

CREATE UNIQUE INDEX "Customer_userId_email_key" ON "Customer"("userId", "email");
