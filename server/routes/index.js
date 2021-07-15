var express = require("express");
var router = express.Router();
const multer = require("multer");

const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);

const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

// parse application/json
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Create Database Connection

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

const conn = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  database: "crud777",
});

// connect to database
conn.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected");
});

router.post("/api/create", (req, res, next) => {
  let id = req.body.id;
  let nome = req.body.nome;
  let cpf = req.body.cpf;

  const sqlInsert =
    "INSERT INTO clientes (id, nome, cpf) VALUES (?, ?, ?)";
  conn.query(sqlInsert, [id, nome, cpf], (err, result) => {
    if (err) console.log(err);
    res.send(
      JSON.stringify({
        status: 200,
        error: null,
        response: "New Record is Added successfully",
      })
    );
    console.log(result);
  });
  let query2 = conn.query("SET @count = 0;");
  let query3 = conn.query(
    "UPDATE clientes SET clientes.id = @count:= @count+1;"
  );
});

// show all records

router.get("/api/view", (req, res) => {
  let sql = "SELECT * FROM clientes;";
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: result }));
  });
  let query2 = conn.query("SET @count = 0;");
  let query3 = conn.query(
    "UPDATE clientes SET clientes.id = @count:= @count+1;"
  );
});

// show a single record
router.get("/api/view/:id", (req, res) => {
  let sql = "SELECT * FROM clientes WHERE id=" + req.params.id;
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    res.send(JSON.stringify({ status: 200, error: null, response: result }));
  });
});

// delete the record
router.delete("/api/delete/:id", (req, res) => {
  let sql = "DELETE FROM clientes WHERE id=" + req.params.id + "";
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    res.send(
      JSON.stringify({
        status: 200,
        error: null,
        response: "Record deleted successfully",
      })
    );
  });
  let query2 = conn.query("SET @count = 0;");
  let query3 = conn.query(
    "UPDATE clientes SET clientes.id = @count:= @count+1;"
  );
});

// update the Record
router.put("/api/update/", (req, res) => {
  let sql =
    "UPDATE clientes SET nome='" +
    req.body.nome +
    "', cpf='" +
    req.body.cpf +
    "' WHERE id=" +
    req.body.id;
  let query = conn.query(sql, (err, result) => {
    if (err) throw err;
    res.send(
      JSON.stringify({
        status: 200,
        error: null,
        response: "Record updated SuccessFully",
      })
    );
  });
});


const upload = multer();
router.post("/upload", upload.single("file"), async function (req, res, next) {
  const {
    file,
    body: { name },
  } = req;
  console.log(req, res);

  const fileName = file.originalName;
  await pipeline(
    file.stream,
    fs.createWriteStream(`${__dirname}/../public/images/${fileName}`)
  );
  
  res.send("File uploaded as " + fileName);
});

module.exports = router;
