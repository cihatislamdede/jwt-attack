const fs = require("fs");

const HEADER = {
  alg: "HS256",
  typ: "JWT",
};

const SECRET_KEY = "verysecretkey";
const SECURE_SECRET_KEY = "6b21c17bec069571d2abbd2a2d9abd22eb0105c4bcfb2393b93cfc217b5160ef"; // sha256 hash of "y0ucann0tcrackth1spassw0rd"

let CURRENT_KEY = SECRET_KEY;
//let CURRENT_KEY = SECURE_SECRET_KEY;

function create_jwt_token(jwt, header, payload, key) {
  return jwt.sign(payload, key, { header: header, expiresIn: "1w" });
}

const PORT = 3000;

function initialize(db) {
  db.serialize(() => {
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, isAdmin INTEGER)"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS posts (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, description TEXT, image TEXT)"
    );
    db.run(
      "INSERT INTO users (username, password, isAdmin) VALUES ('admin', 'admin', 1)"
    );
    db.run(
      "INSERT INTO users (username, password, isAdmin) VALUES ('user', 'user', 0)"
    );
    db.run(
      "INSERT INTO posts (title, description, image) VALUES ('Post 1', 'Post 1 description', 'https://images.unsplash.com/photo-1671394507023-76c50b824053?crop=entropy&fit=crop&fm=jpg&h=800&q=80&w=800')"
    );
    db.run(
      "INSERT INTO posts (title, description, image) VALUES ('Post 2', 'Post 2 description', 'https://images.unsplash.com/photo-1669327195331-cd47e0d5eef0?crop=entropy&fit=crop&fm=jpg&h=800&q=80&w=800')"
    );
    db.run(
      "INSERT INTO posts (title, description, image) VALUES ('Post 3', 'Post 3 description', 'https://images.unsplash.com/photo-1669569713128-b50dd2eacf32?crop=entropy&fit=crop&fm=jpg&h=800&q=80&w=800')"
    );
    db.run(
      "INSERT INTO posts (title, description, image) VALUES ('Post 4', 'Post 4 description', 'https://images.unsplash.com/photo-1671372675714-dbeff989d93c?crop=entropy&fit=crop&fm=jpg&h=800&q=80&w=800')"
    );
    db.run(
      "INSERT INTO posts (title, description, image) VALUES ('Post 5', 'Post 5 description', 'https://images.unsplash.com/photo-1671433002172-7fce072cdedf?crop=entropy&fit=crop&fm=jpg&h=800&q=80&w=800')"
    );
  });
}

function crack_jwt(jwt, token, worldlist_file) {
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

module.exports = {
  HEADER,
  SECRET_KEY,
  SECURE_SECRET_KEY,
  PORT,
  CURRENT_KEY,
  create_jwt_token,
  initialize,
  crack_jwt,
};
