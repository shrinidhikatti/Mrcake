-- CreateTable
CREATE TABLE "DeliveryPartner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "vehicleType" TEXT,
    "vehicleNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "totalDeliveries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "addressId" TEXT NOT NULL,
    "subtotal" REAL NOT NULL,
    "deliveryFee" REAL NOT NULL,
    "tax" REAL NOT NULL,
    "total" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "deliveryPartnerId" TEXT,
    "statusHistory" TEXT,
    "paymentId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "deliveryDate" DATETIME NOT NULL,
    "deliverySlot" TEXT NOT NULL,
    "specialInstructions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_deliveryPartnerId_fkey" FOREIGN KEY ("deliveryPartnerId") REFERENCES "DeliveryPartner" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("addressId", "createdAt", "deliveryDate", "deliveryFee", "deliverySlot", "id", "orderNumber", "paymentId", "paymentStatus", "specialInstructions", "status", "subtotal", "tax", "total", "updatedAt", "userId") SELECT "addressId", "createdAt", "deliveryDate", "deliveryFee", "deliverySlot", "id", "orderNumber", "paymentId", "paymentStatus", "specialInstructions", "status", "subtotal", "tax", "total", "updatedAt", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPartner_phone_key" ON "DeliveryPartner"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryPartner_email_key" ON "DeliveryPartner"("email");
