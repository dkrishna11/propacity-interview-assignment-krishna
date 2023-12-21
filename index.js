const express = require("express");
const app = express();

const authRoutes =require("./Routes/authRoutes")
const FolderAPI=require("./Routes/FolderAPI")
require("dotenv").config();

app.use(express.json());
//server running port:
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is running at ", PORT);
});


app.use("/user", authRoutes);
app.use("/", FolderAPI)