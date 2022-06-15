
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.get(/\.(js|css|map|ico|json|png|svg)$/, express.static(path.resolve(__dirname, './')));

app.use(express.static("./"));

app.get("*/*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, function () {
    console.log(`listening on port ${PORT}!`);
});
