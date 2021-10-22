console.log(
  "If module not found, install express globally `npm i express -g`!"
);
let port =
  process.env.OPENSHIFT_NODEJS_PORT ||
  process.env.VCAP_APP_PORT ||
  process.env.PORT ||
  process.argv[2] ||
  8765;
let express = require("express");
let Gun = require("gun");
let cors = require("cors");
let fs = require('fs');

let app = express();
app.use(express.static(__dirname))
app.use(Gun.serve);
app.use(cors());

let https = require('https').createServer({ key: fs.readFileSync('/home/connor/Projects/GunDB/server.key'), cert: fs.readFileSync('/home/connor/Projects/GunDB/server.cert') }, app);
let server = https.listen(port);
let gun = Gun({
  file: `data`,
  web: server,
  peers: process.env.PEERS ? process.env.PEERS.split(",") : [],
});

console.log(process.cwd());

global.Gun = Gun; /// make global to `node --inspect` - debug only
global.gun = gun; /// make global to `node --inspect` - debug only

console.log("Server started on port " + port + " with /gun");
