 //the app.js runs the enter front end of the website

//these are the tools that are we are using to help with our requests
const express = require('express')
const app = express()
const mysql = require('mysql')
const morgan = require('morgan')
const bodyParser = require('body-parser')
var session = require('express-session');
const fs = require('fs');
const csv = require('fast-csv');
const multer = require('multer');

//outputs our api requests to console to help display what is occuring
app.use(morgan('short'))
//this allows access to the any file in the public folder
app.use(express.static('./public'))
app.use(express.static('./public/html'))
//this allows us to parse any info we are attemping to collect form the webpage
app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//this function allows us to reuse our connection to the database
function getConnection() {
  return mysql.createConnection({
    host     : '35.233.130.214',
    database : 'maxxhaul',
    user     : 'ramir266',
    password : 'torNado911!',
  })
}

//this connects to out main page
app.get("/html/index.html", (req, res) => {
  console.log("Responding to root route")
  res.send("Hello from root")
})

app.get("/product-search", (req, res) => {
  console.log("Responding to root route")
  res.send("Hello from root")
})

app.post('/auth', function(request, response) {
	var email = request.body.email;
	var password = request.body.password;
	if (email && password) {
		getConnection().query('SELECT * FROM Accounts WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.email = email;
        intializeTables();
				response.redirect('/home.html');
			} else {
        response.redirect('/index.html')
        //response.send('Incorrect Email and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Email and Password!');
		response.end();
	}
});

app.get('/home.html', function(request, response) {
	if (request.session.loggedin) {
		//response.send('Welcome back!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

//this allows the user to create a new user and insert them into the database
app.post("/user_create", (req, res) => {
  console.log("Attempting to create a new user ...")
  //console.log("First name: " + req.body.create_first_name)
  const firstName = req.body.create_first_name
  const lastName = req.body.create_last_name

  const queryString = "INSERT INTO TestUsers(FirstName,LastName) VALUES (?,?)"
  getConnection().query(queryString, [firstName, lastName], (error, results, fields) => {
    if(error) {
      console.log("It appears there was an error inserting into the database: " + error)
      res.sendStatus(500)
      return
    }

    console.log("Inserted a new user with id: " + results.insertId)
    res.end()
  })

  res.end()
})

app.get('/users/:id', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)

  const connection = getConnection()

  const userId = req.params.id
  const queryString = "SELECT * FROM TestUsers WHERE ID = ?"
  connection.query(queryString, [userId], (error, rows, fields) => {
    if (error)  {
        console.log("YO there is an error: " + error.stack);
        res.end()
        return;
    }

    console.log("Should have fetched data from user with id of " + userId)
    res.json(rows)
  })
  //res.end()
})

app.get("/users", (req, res) => {
  var user1 = {firstName: "Alberto" , lastName: "Garibay"}
  const user2 = {firstName: "Kolby" , lastName: "Ramirez"}
  res.json([user1, user2])

  //res.send("Nodemon updates when i save file")
})

//localhost 3000
app.listen(3030, () => {
  console.log("Server is up and running on 3030...")
})

// -> Import CSV File to MySQL database
function importCsvData2MySQL(filePath){
    var sku = [];
    var Description = [];
    var SellableOnHand = [];
    var OpenPOqty = [];
    var OneMonthSales = [];
    var ThreeMonthSales = [];
    var SixMonthSales = [];
    var BackOrder = [];
    var LeadTime = [];
    var MoQ = [];
    var FobSH = [];
    var PackagingType = [];
    var L_cm = [];
    var W_cm = [];
    var H_cm = [];
    var GW_kg = [];
    var NW_kg = [];
    var Carton_qty = [];
    var Pallet_Dim_cm = [];
    var Pallet_Ctns = [];
    var Pallet_qty = [];
    var Pallet_WG_qty = [];
    var Shipping_Date = [];
    var Shipping_PO = [];
    var Shipping_Qty = [];
    var Cost_Unit = [];
    var Shipping_Amt = [];
    var Shpmt_Received = [];
    var Shpmt_Date_Received = [];
    var Vendor = [];
    var Sales_PO = [];
    var Sales_Qty = [];
    var Sales_Date = [];
    var Sales_Amt = [];

    let stream = fs.createReadStream(filePath, 'utf-8');
    let csvData = [];
    let csvStream = csv
        .parse()
        .on("data", function (data) {
            csvData.push(data);
        })
        .on("end", function () {
            // Remove Header ROW
            csvData.shift();
            //loop through each item in array and save them to appropriate sub-array
            csvData.forEach(function(entry) {
              sku = csvData[0];
              Description = csvData[1];
              SellableOnHand = csvData[2];
              OpenPOqty = csvData[3];
              OneMonthSales = csvData[4];
              ThreeMonthSales = csvData[5];
              SixMonthSales = csvData[6];
              BackOrder = csvData[7];
              LeadTime = csvData[8];
              MoQ = csvData[9];
              FobSH = csvData[10];
              PackagingType = csvData[11];
              L_cm = csvData[12];
              W_cm = csvData[13];
              H_cm = csvData[14];
              GW_kg = csvData[15];
              NW_kg = csvData[16];
              Carton_qty = csvData[17];
              Pallet_Dim_cm = csvData[18];
              Pallet_Ctns = csvData[19];
              Pallet_qty = csvData[20];
              Pallet_WG_qty = csvData[21];
              Shipping_Date = csvData[22];
              Shipping_PO = csvData[23];
              Shipping_Qty = csvData[24];
              Cost_Unit = csvData[25];
              Shipping_Amt = csvData[26];
              Shpmt_Received = csvData[27];
              Shpmt_Date_Received = csvData[28];
              Vendor = csvData[29];
              Sales_PO = csvData[30];
              Sales_Qty = csvData[31];
              Sales_Date = csvData[32];
              Sales_Amt = csvData[33];
            });
            console.log(sku[0]);
            console.log(sku);
            // Open the MySQL connection
            getConnection().connect((error) => {
                if (error) {
                    console.error(error);
                } else {
                    let query = 'INSERT INTO TestTable (SKU, Test1, Test2, Test3, Test4, Test5, Test6) VALUES ?';
                    getConnection().query(query, [csvData], (error, response) => {
                        console.log(error || response);
                    });
                }
            });
  // delete file after saving to MySQL database
  // fs.unlinkSync(filePath)
          });
  stream.pipe(csvStream);
}

app.post("/insertDB", (req, res) => {
  var csvfile = req.body.csv_file;
  importCsvData2MySQL(csvfile)
})

function intializeTables() {
  var createUSWarehouse = 'CREATE TABLE IF NOT EXISTS USWarehouse (' +
                              'WarehouseId INTEGER auto_increment not null,' +
                              'SKU INTEGER UNIQUE,' +
                              'PRIMARY KEY (WarehouseId),' +
                              'Description varchar(25),' +
                              'SellableOnHand INTEGER,' +
                              'OpenPOQuantity INTEGER,' +
                              'MOQ INTEGER,' +
                              'LeadTime INTEGER,' +
                              'BackOrders INTEGER);';

  // var createTotalSales = 'CREATE TABLE IF NOT EXISTS TotalSales (' +
  //                           'SalesId INTEGER auto_increment not null,' +
  //                           'PRIMARY KEY (SalesId),' +
  //                           'OneMonthSales INTEGER,' +
  //                           'ThreeMonthSales INTEGER,' +
  //                           'SixMonthSales INTEGER);';

  var createDimensionTable = 'CREATE TABLE IF NOT EXISTS DimensionTable (' +
                              'DimensionId INTEGER auto_increment not null,' +
                              'PRIMARY KEY (DimensionId),' +
                              'SKU INTEGER,' +
                              'Fob_SH FLOAT,' +
                              'L_cm INTEGER,' +
                              'W_cm INTEGER,' +
                              'H_cm INTEGER,' +
                              'G_W_kg INTEGER,' +
                              'N_W_kg INTEGER);';

  var createPackagingTable = 'CREATE TABLE IF NOT EXISTS PackagingTable (' +
                              'PackagingId INTEGER auto_increment not null,' +
                              'PRIMARY KEY (PackagingId),' +
                              'PackagingType varchar(30),' +
                              'PalletDim varchar(30),' +
                              'PalletCtns INTEGER,' +
                              'PalletQty INTEGER,' +
                              'PalletWeight INTEGER,' +
                              'CartonQuantity INTEGER);';

  var TestTable = 'CREATE TABLE IF NOT EXISTS TestTable (' +
                      'SKU INTEGER UNIQUE,' +
                      'PRIMARY KEY (SKU),' +
                      'Test1 varchar(20),' +
                      'Test2 varchar(20),' +
                      'Test3 varchar(20),' +
                      'Test4 varchar(20),' +
                      'Test5 varchar(20),' +
                      'Test6 varchar(20))';
  getConnection().query(TestTable, function(err,result) {
    if (err) throw err;
    console.log('Table Created!');
  });
}
