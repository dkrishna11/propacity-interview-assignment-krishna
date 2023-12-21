const express = require('express');
const app=express();
const { Register } =require("../Controllers/Register")
const {Login} =require("../Controllers/Login")

app.post("/register", Register);
app.post("/login", Login);

module.exports = app;