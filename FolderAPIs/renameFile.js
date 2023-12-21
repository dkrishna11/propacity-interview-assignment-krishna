const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const s3 = require("../config/AWSConfig");

const renameFile = async (req, res) => {
  const { fileId } = req.params;
  const { newFileName } = req.body;
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

    const subFolderData = await prisma.subfolder.findUnique({
      where: { folderId: String(fileData.folderId) },
    });

    if (!subFolderData || subFolderData.createdBy !== userEmail) {
      return res.status(403).send({
        status: 403,
        message: "You do not have permission to rename this file.",
      });
    }

    const oldKeyComponents = fileData.key.split("/");

    const folderKey = `${oldKeyComponents[0]}/${oldKeyComponents[1]}`;
    const newKey = `${folderKey}/${newFileName}`;

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
      data: { fileName: newFileName, key: newKey },
    });

    return res.status(200).send({
      status: 200,
      message: "File Renamed Successfully",
      data: {
        updatedFile,
      },
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Failed to rename the file",
      data: {
        error,
      },
    });
  }
};

module.exports = { renameFile };
