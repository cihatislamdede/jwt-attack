const jwt = require("jsonwebtoken");
const express = require("express");

const app = express();
app.use(express.json());
const port = 3000;

const header = {
  alg: "HS256",
  typ: "JWT",
};

const SECRET = "verysecretkey";

const posts = [
  {
    id: 1,
    title: "Post 1",
    description: "Post 1 description",
  },
  {
    id: 2,
    title: "Post 2",
    description: "Post 2 description",
  },
  {
    id: 3,
    title: "Post 3",
    description: "Post 3 description",
  },
];

function create_jwt_token(header, payload, key) {
  return jwt.sign(payload, key, { header: header, expiresIn: "1w" });
}

app.get("/", (req, res) => {
  const script = `
    <script>
        function login() {
            var username = document.getElementById('username').value;
            var password = document.getElementById('password').value;
            var data = {
                username: username,
                password: password
            };
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/login', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        }
    </script>
    `;

  res.send(
    `
    <html>
    <head>
        <title>JWT Example</title>
    </head>
    <body>
        <form>
            <input type="text" id="username" placeholder="username">
            <input type="password" id="password" placeholder="password">
            <input type="button" value="Login" onclick="login()">
        </form>
    </body>
    </html>
    ` + script
  );
});

app.post("/login", (req, res) => {
  var username = req.body.username;
  var password = req.body.password;
  console.log(username, password);
  if (username == "" || password == "") {
    return res.send("Username or password is empty");
  }

  if (username == "admin" && password == "admin") {
    var payload = {
      username: username,
      password: password,
      isAdmin: true,
    };
    var token = create_jwt_token(header, payload, SECRET);
    res.send(token);
  } else if (username == "user" && password == "user") {
    var payload = {
      username: username,
      password: password,
      isAdmin: false,
    };
    var token = create_jwt_token(header, payload, SECRET);
    res.send(token);
  } else {
    res.send("Invalid username or password");
  }
});

app.get("/posts", (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.decode(token, { complete: true });
      console.log(decoded);
      res.send(posts);
    } catch (err) {
      res.send("Invalid token");
    }
  } else {
    res.send("Missing token!");
  }
});

app.delete("/posts/:id", (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    const decoded = jwt.decode(token, { complete: true });
    if (decoded.payload.isAdmin) {
      var id = req.params.id;
      var post = posts.find((post) => post.id == id);
      if (post) {
        try {
          posts.splice(id - 1, 1);
          res.send(`Post ${id} deleted`);
        } catch (e) {
          res.send("Post not found");
        }
      } else {
        res.send("Post not found");
      }
    } else {
      res.send("You are not an admin");
    }
  } else {
    res.send("Missing token!");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
