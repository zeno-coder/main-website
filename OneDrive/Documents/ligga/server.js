const express = require("express");
const app = express();
const path = require("path");

// Serve static website files
app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
