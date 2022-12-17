const express = require("express");
const crypto = require("crypto");

const app = express();
app.use(express.json());
const port = 3000;

const header = {
  alg: "none",
  typ: "JWT",
};

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

function create_jwt_token(header, payload) {
  var encoded_header = Buffer.from(JSON.stringify(header)).toString("base64").replace(/=/g, "");
  var encoded_payload = Buffer.from(JSON.stringify(payload)).toString("base64").replace(/=/g, "");
  var signature = crypto.createHash("sha256").update(encoded_header + "." + encoded_payload).digest("base64").replace(/=/g, "");
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

  var payload = {
    username: username,
    password: password,
    isAdmin: false,
  };

  if (username == "admin" && password == "admin") {
    payload.isAdmin = true;
    var token = create_jwt_token(header, payload);
    res.send(token);
  } else if (username == "user" && password == "user") {
    var token = create_jwt_token(header, payload);
    res.send(token);
  } else {
    res.send("Invalid username or password");
  }
});

app.get("/posts", (req, res) => {
  var token = req.headers.authorization;
  if (token) {
    if (verify_jwt_token(token, SECRET)) {
      res.send(posts);
    } else {
      res.send("Invalid token");
    }
  } else {
    res.send("Missing token");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
