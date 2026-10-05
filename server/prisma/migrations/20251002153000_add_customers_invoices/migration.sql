-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Added by migration: extend Invoice table with invoice builder fields and create InvoiceItem table
-- We keep the existing "amount" column for backwards compatibility and introduce new columns: issueDate, dueDate, subtotal, discount, tax, total, notes
ALTER TABLE "Invoice"
  ADD COLUMN IF NOT EXISTS "invoiceNumber" TEXT NOT NULL DEFAULT '';

ALTER TABLE "Invoice"
  ADD COLUMN IF NOT EXISTS "issueDate" TIMESTAMP(3);

ALTER TABLE "Invoice"
  ADD COLUMN IF NOT EXISTS "dueDate" TIMESTAMP(3);

ALTER TABLE "Invoice"
  ADD COLUMN IF NOT EXISTS "subtotal" DECIMAL(65,30) DEFAULT 0;

ALTER TABLE "Invoice"
  ADD COLUMN IF NOT EXISTS "discount" DECIMAL(65,30) DEFAULT 0;

ALTER TABLE "Invoice"
  ADD COLUMN IF NOT EXISTS "tax" DECIMAL(65,30) DEFAULT 0;

ALTER TABLE "Invoice"
  ADD COLUMN IF NOT EXISTS "total" DECIMAL(65,30) DEFAULT 0;

ALTER TABLE "Invoice"
  ADD COLUMN IF NOT EXISTS "notes" TEXT;

-- Ensure invoiceNumber uniqueness
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'i' AND c.relname = 'Invoice_invoiceNumber_key'
  ) THEN
    CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");
  END IF;
END$$;

-- Create table for invoice items
CREATE TABLE IF NOT EXISTS "InvoiceItem" (
  "id" TEXT NOT NULL,
  "invoiceId" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "unitPrice" DECIMAL(65,30) NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "InvoiceItem_pkey" PRIMARY KEY ("id")
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS "InvoiceItem_invoiceId_idx" ON "InvoiceItem"("invoiceId");

-- Foreign key linking invoice items to invoices
ALTER TABLE "InvoiceItem" ADD CONSTRAINT IF NOT EXISTS "InvoiceItem_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
