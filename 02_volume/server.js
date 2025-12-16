const fs = require("fs").promises;
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const { rm } = require("fs");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/feedback", express.static("feedback"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "feedback.html"));
});

app.get("/exists", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "exists.html"));
});

app.post("/create", async (req, res) => {
  const title = req.body.title;
  const content = req.body.text;

  const adjTitle = title.toLowerCase();

  const tempDir = path.join(__dirname, "temp");
  const feedbackDir = path.join(__dirname, "feedback");

  const tempFilePath = path.join(tempDir, `${adjTitle}.txt`);
  const finalFilePath = path.join(feedbackDir, `${adjTitle}.txt`);

  try {
    // ✅ ALWAYS ensure directories exist
    await fs.mkdir(tempDir, { recursive: true });
    await fs.mkdir(feedbackDir, { recursive: true });

    // Write temp file
    await fs.writeFile(tempFilePath, content);

    // Check if final file already exists
    try {
      await fs.access(finalFilePath);
      // File exists
      res.redirect("/exists");
    } catch {
      // File does NOT exist
      await fs.copyFile(tempFilePath, finalFilePath);
      await fs.unlink(tempFilePath);
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.listen(80, () => {
  console.log("Server is running");
});


