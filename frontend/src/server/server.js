
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = 3000;
const HTTPS_PORT = 3443;

const options = {
    cert: fs.readFileSync(path.resolve(__dirname, './.cert/fullchain.pem')),
    key: fs.readFileSync(path.resolve(__dirname, './.cert/privkey.pem'))
};

app.use(require('helmet')());
app.use(express.static("./"));

const returnIndex = (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
};

app.get(/\.(js|css|map|ico|json|png|svg|html|ttf)$/, express.static(path.resolve(__dirname, './dist/')));
app.get("/", returnIndex)
app.get("/home", returnIndex)
app.get("/note/*", returnIndex);
app.get("/login", returnIndex);
app.get("/register", returnIndex);
app.get("/shared/*", returnIndex);
app.get("/profile", returnIndex);
app.get("/forgot-password", returnIndex);
app.get("/restore-password/*", returnIndex);
app.get("/notFound", (req, res) => {
    res.status(404);
    res.sendFile(path.join(__dirname, "404.html"));
});
app.get("*/*", (req, res) => {
    res.redirect("/notFound");
})

app.listen(PORT);
https.createServer(options, app)
    .listen(HTTPS_PORT);
