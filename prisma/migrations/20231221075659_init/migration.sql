-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Folder" (
    "id" SERIAL NOT NULL,
    "createdBy" TEXT NOT NULL,
    "folderName" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "createDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Folder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subfolder" (
    "id" SERIAL NOT NULL,
    "createdBy" TEXT NOT NULL,
    "folderName" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "createDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentId" TEXT,

    CONSTRAINT "Subfolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "uploadDate" TIMESTAMP(3) NOT NULL,
    "userName" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_folderName_key" ON "Folder"("folderName");

-- CreateIndex
CREATE UNIQUE INDEX "Folder_folderId_key" ON "Folder"("folderId");

-- CreateIndex
CREATE UNIQUE INDEX "Subfolder_folderName_key" ON "Subfolder"("folderName");

-- CreateIndex
CREATE UNIQUE INDEX "Subfolder_folderId_key" ON "Subfolder"("folderId");

-- CreateIndex
CREATE UNIQUE INDEX "File_fileId_key" ON "File"("fileId");

-- AddForeignKey
ALTER TABLE "Folder" ADD CONSTRAINT "Folder_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subfolder" ADD CONSTRAINT "Subfolder_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subfolder" ADD CONSTRAINT "Subfolder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Folder"("folderId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
