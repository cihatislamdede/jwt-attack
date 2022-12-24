const jwt = require("jsonwebtoken");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fileUpload = require("express-fileupload");
const utils = require("./utils");

const app = express();
app.use(express.json());
app.use(fileUpload());
const port = utils.PORT;

const db = new sqlite3.Database("./db.sqlite3", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the database.");
  //utils.intiliazeDB(db); // Uncomment this line to initialize the database
});

// to get JWT token
app.post("/login", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  var isSecure = req.body.isSecure || false;

  if (!username || !password) {
    return res.status(401).send("Username or password is empty!");
  }

  var payload = {
    username: username,
    password: password,
    isAdmin: false,
  };

  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row) => {
      if (err) {
        return res.status(500).send("Internal server error!");
      }
      if (row) {
        payload.isAdmin = row.isAdmin;
        var token = utils.create_jwt_token(
          jwt,
          utils.HEADER,
          payload,
          isSecure ? utils.SECURE_SECRET_KEY : utils.SECRET_KEY
        );
        return res.status(200).send(token);
      } else {
        return res.status(401).send("Invalid username or password!");
      }
    }
  );
});

// ### ATTACK 1: JWT token can be modified and still be valid ###
// Many JWT libraries provide one method to decode the token and another to verify it:
// decode(): Only decodes the token from base64url encoding without verifying the signature.
// verify(): Decodes the token and verifies the signature.
// Sometimes developers might mix up these methods.
// In that case, the signature is never verified and the application will accept any token (in a valid format).
// Developers might also disable signature verification for testing and then forget to re-enable it.
// Such mistakes could lead to arbitrary account access or privilege escalation.

// SECURE WAY
app.get("/verify-decode/secure/posts", (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    jwt.verify(
      token,
      utils.SECURE_SECRET_KEY,
      { algorithms: ["HS256"] },
      (err, decoded) => {
        if (err) {
          res.status(401).send("Invalid token!");
        } else {
          db.all("SELECT * FROM posts", (err, rows) => {
            if (err) {
              return res.status(500).send("Internal server error!");
            }
            return res.status(200).send(rows);
          });
        }
      }
    );
  } else {
    res.status(401).send("Missing token!");
  }
});

app.delete("/verify-decode/secure/posts/:id", (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    jwt.verify(
      token,
      utils.SECURE_SECRET_KEY,
      { algorithms: ["HS256"] },
      (err, decoded) => {
        if (err) {
          res.status(401).send("Invalid token!");
        } else {
          if (decoded.isAdmin) {
            var id = req.params.id;
            db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
              if (err) {
                return res.status(500).send("Internal server error!");
              }
              if (row) {
                db.run("DELETE FROM posts WHERE id = ?", [id], (err) => {
                  if (err) {
                    return res.status(500).send("Internal server error!");
                  }
                  return res.status(200).send("Post deleted successfully!");
                });
              } else {
                return res.status(404).send("Post not found!");
              }
            });
          } else {
            res.status(403).send("You are not authorized to delete posts!");
          }
        }
      }
    );
  } else {
    res.status(401).send("Missing token!");
  }
});

// UNSECURE WAY
app.get("/verify-decode/unsecure/posts", (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    try {
      jwt.decode(token, { complete: true });
      db.all("SELECT * FROM posts", (err, rows) => {
        if (err) {
          return res.status(500).send("Internal server error!");
        }
        return res.status(200).send(rows);
      });
    } catch (e) {
      res.status(401).send("Invalid token!");
    }
  } else {
    res.status(401).send("Missing token!");
  }
});

app.delete("/verify-decode/unsecure/posts/:id", (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    const decoded = jwt.decode(token, { complete: true });
    if (decoded.payload.isAdmin) {
      var id = req.params.id;
      db.get("SELECT * FROM posts WHERE id = ?", [id], (err, row) => {
        if (err) {
          return res.status(500).send("Internal server error!");
        }
        if (row) {
          db.run("DELETE FROM posts WHERE id = ?", [id], (err) => {
            if (err) {
              return res.status(500).send("Internal server error!");
            }
            return res.status(200).send("Post deleted successfully!");
          });
        } else {
          return res.status(404).send("Post not found!");
        }
      });
    } else {
      res.status(403).send("You are not authorized to delete posts!");
    }
  } else {
    res.status(401).send("Missing token!");
  }
});

// ### ATTACK 2: JWT token can be cracked if the secret key is weak ###
// When the HMAC symmetric signing algorithms are used these can be cracked offline using a variety of simple CPU cracking tools,
// or plugged into a GPU-powered brute-force cracking rig. Also with wordlists, rainbow tables, and other offline cracking techniques.
app.post("/crack-secret", (req, res) => {
  const token = req.body.token;
  const worldlist = req.files.worldlist;

  if (!token) {
    return res.status(400).send("Token is empty!");
  }
  if (!worldlist) {
    return res.status(400).send("Worldlist is empty!");
  }

  worldlist.mv(`./user_files/${worldlist.name}`, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal server error!");
    } else {
      const key = utils.crack_jwt(jwt, token, `./user_files/${worldlist.name}`);
      console.log(key);
      if (!key) {
        return res.status(404).send("Key not found!");
      }
      res.status(200).send(key);
    }
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
