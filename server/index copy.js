const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
let data;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
  
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
const router = express.Router();
router.get('/',(req, res) => res.json({ message: 'funcionando'}));
app.use('/', router);


//Create Database Connection
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

// creat a new Record
// app.post("/api/create", (req, res) => {
// 	let data = { nome: req.body.nome, cpf: req.body.cpf };
// 	let sql = "INSERT INTO clientes SET ?";
// 	let query = conn.query(sql, data, (err, result) => {
// 		if (err) throw err;
// 		res.send(JSON.stringify({ status: 200, error: null, response: "New Record is Added successfully" }));
// 	});
// });

router.post('/api/create', upload.single('imagem_cliente'), (req, res) => {
	console.log(req.file);
    let id = req.body.id;
    let nome = req.body.nome; 
    let cpf = req.body.cpf;
	let imagem = req.file.filename;
	// const sqlInsert = "INSERT INTO clientes (id, nome, cpf) VALUES (?, ?, ?)"
	// conn.query(sqlInsert, [id, nome, cpf], (err, result) => {
    const sqlInsert = "INSERT INTO clientes (id, nome, cpf, imagem_cliente) VALUES (?, ?, ?, ?)"
	conn.query(sqlInsert, [id, nome, cpf, imagem], (err, result) => {
		if (err) console.log(err);
		res.send(JSON.stringify({ status: 200, error: null, response: "New Record is Added successfully" }))
		console.log(result);
    });
	let query2 = conn.query("SET @count = 0;");
	let query3 = conn.query("UPDATE clientes SET clientes.id = @count:= @count+1;");
});

// show all records

router.get("/api/view", (req, res) => {
	let sql = "SELECT * FROM clientes;";
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: result }));
	});
	let query2 = conn.query("SET @count = 0;");
	let query3 = conn.query("UPDATE clientes SET clientes.id = @count:= @count+1;");
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
		res.send(JSON.stringify({ status: 200, error: null, response: "Record deleted successfully" }));
	});
	let query2 = conn.query("SET @count = 0;");
	let query3 = conn.query("UPDATE clientes SET clientes.id = @count:= @count+1;");
});

// update the Record
router.put("/api/update/", upload.single('imagem_cliente'), (req, res) => {
	let sql = "UPDATE clientes SET nome='" + req.body.nome + "', cpf='" + req.body.cpf + "', imagem_cliente='" + req.file.filename + "' WHERE id=" + req.body.id;
	let query = conn.query(sql, (err, result) => {
		if (err) throw err;
		res.send(JSON.stringify({ status: 200, error: null, response: "Record updated SuccessFully" }));
	});
});

app.listen(3002, () => {
	console.log("server started on port 3001...");
});