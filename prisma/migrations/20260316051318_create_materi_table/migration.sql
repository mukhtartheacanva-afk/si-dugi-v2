-- CreateTable
CREATE TABLE "Materi" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judul" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "urlYoutube" TEXT NOT NULL,
    "deskripsi" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
