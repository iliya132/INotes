
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.get(/\.(js|css|map|ico|json|png|svg|html|ttf)$/, express.static(path.resolve(__dirname, './')));

app.use(express.static("./"));

const returnIndex = (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
};

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

app.listen(PORT, function () {
    console.log(`listening on port ${PORT}!`);
});
