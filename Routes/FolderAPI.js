const express = require('express');
const app=express();
const {createFolder} =require("../FolderAPIs/createFolder")
const {subFolder} =require("../FolderAPIs/subFolder")
const {uploadFile} =require("../FolderAPIs/uploadFile")
const {Auth} =require("../Middleware/Auth")
const multer=require("multer");
const { renameFile } = require('../FolderAPIs/renameFile');
const { deleteFile } = require('../FolderAPIs/deleteFile');
const { moveFile } = require('../FolderAPIs/moveFile');
const { searchFolder } = require('../FolderAPIs/searchFolder');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/createFolder", Auth, createFolder);
app.post("/subFolder/:currentFolderId", Auth, subFolder);
app.post("/upload/:subFolderid",upload.single("file"), Auth,uploadFile )
app.put("/rename/:fileId", Auth, renameFile)
app.delete("/delete/:fileId", Auth, deleteFile)
app.put("/moveFile/:movingFolderId/:fileId", Auth, moveFile)
app.get("/searchFolder", Auth, searchFolder)

module.exports = app;