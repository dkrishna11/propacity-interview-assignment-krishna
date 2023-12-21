const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const s3 = require("../config/AWSConfig");

const moveFile = async (req, res) => {
  const { movingFolderId, fileId } = req.params;
  const userEmail = req.locals.email;

  try {
    const fileData = await prisma.file.findUnique({
      where: { fileId: String(fileId) },
    });

    if (!fileData) {
      return res.status(404).send({
        status: 404,
        message: "File not found",
      });
    }

    if (fileData.folderId === movingFolderId) {
      return res.status(400).send({
        status: 400,
        message:
          "You cannot move the file to the same folder. Choose another folder to move the file.",
      });
    }

    const subFolderData = await prisma.subfolder.findUnique({
      where: { folderId: String(fileData.folderId) },
    });

    const movingFolderData = await prisma.subfolder.findUnique({
      where: {
        folderId: movingFolderId,
      },
    });

    if (
      !subFolderData ||
      !movingFolderData ||
      subFolderData.createdBy !== userEmail
    ) {
      return res.status(403).send({
        status: 403,
        message: "You do not have permission to move this file.",
      });
    }

    const oldKeyComponents = fileData.key.split("/");
    const folderKey = `${oldKeyComponents[0]}/${movingFolderData.folderName}`;
    const currentFolderName = oldKeyComponents[2];
    const newKey = `${folderKey}/${currentFolderName}`;

    // Log keys for debugging
    console.log("Old Key:", fileData.key);
    console.log("New Key:", newKey);

    // Rename the file in AWS S3
    await s3
      .copyObject({
        Bucket: process.env.AWS_BUCKET,
        CopySource: `${process.env.AWS_BUCKET}/${fileData.key}`,
        Key: newKey,
      })
      .promise();

    await s3
      .deleteObject({
        Bucket: process.env.AWS_BUCKET,
        Key: fileData.key,
      })
      .promise();

    const updatedFile = await prisma.file.update({
      where: { fileId: String(fileId) },
      data: { folderId: movingFolderId, key: newKey },
    });

    return res.status(200).send({
      status: 200,
      message: "File Moved Successfully",
      data: {
        updatedFile,
      },
    });
  } catch (error) {
    console.error("Error moving file:", error);
    return res.status(500).send({
      status: 500,
      message: "Failed to move the file",
      data: {
        error,
      },
    });
  }
};

module.exports = { moveFile };
