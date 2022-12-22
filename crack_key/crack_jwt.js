const jwt = require("jsonwebtoken");
const fs = require("fs");
const express = require("express");
const fileUpload = require("express-fileupload");

const app = express();
app.use(express.json());
app.use(fileUpload());
const port = 3000;

function crack_jwt(token, worldlist_file) {
  const worldlist = fs.readFileSync(worldlist_file, "utf8").split("\r\n");
  for (let i = 0; i < worldlist.length; i++) {
    try {
      jwt.verify(token, worldlist[i]);
      return worldlist[i];
    } catch (err) {
      continue;
    }
  }
}

app.get("/", (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <form action="/crack" method="POST" enctype="multipart/form-data">
      <input type="text" name="token" placeholder="token" />
      <br />
      <input type="file" name="worldlist" accept=".txt"/>
      <button type="submit">Upload</button>
  </form>
  `);
});

app.post("/crack", (req, res) => {
  const token = req.body.token;
  const worldlist = req.files.worldlist;

  worldlist.mv(`./commons/${worldlist.name}`, (err) => {
    if (err) {
      console.log(err);
      res.send("Error uploading file");
    } else {
      const key = crack_jwt(token, `./commons/${worldlist.name}`);
      res.send(`
      <!DOCTYPE html>
      <h2>Secret Key: <i>${key}</i></h2>
      `);
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
