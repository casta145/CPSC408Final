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

//functions in other js files
var conn = require('./dbConnection');
var create = require('./createTables');
var importCSV = require('./Import')

//outputs our api requests to console to help display what is occuring
app.use(morgan('short'))
//this allows access to the any file in the public folder
app.use(express.static('./public'))
//this allows us to parse any info we are attemping to collect form the webpage
app.use(bodyParser.urlencoded({extended: false}))

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//localhost 3000
app.listen(3030, () => {
  console.log("Server is up and running on 3030...")
})

//this connects to out main page
app.get("/html/index.html", (req, res) => {
  console.log("Responding to root route")
  res.send("Hello from root")
})

//authenticates uers credentials before login
app.post('/auth', function(request, response) {
	var email = request.body.email;
	var password = request.body.password;
	if (email && password) {
		conn.query('SELECT * FROM Accounts WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.email = email;
        create;
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

//routes to home page
app.get('/home.html', function(request, response) {
	if (request.session.loggedin) {
		//response.send('Welcome back!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.post("/insertDB", (req, res) => {
  var csvfile = req.body.csv_file;
  //importCsvData2MySQL(csvfile);
  importCSV.import(csvfile);
})

app.post("/exportDB", (req, res) => {
  importCSV.exportCSV();
})

function processFile() {
  var theFile = document.getElementById("myFile");
  console.log(theFile);
  var table = document.getElementById("myTable");
  //var headerLine = "";

  const sqlquery = "SELECT * FROM USWarehouse WHERE SKU = ?"
  conn.query(sqlquery, [sku],function(error,rows,fields){
    var rowContent = res.json(rows);
    var cellElement = document.createElement("th");
    var cellElement = document.createElement("td");
    var cellContent = document.createTextNode(rowContent[0]);
    cellElement.appendChild(cellContent);
    row.appendChild(cellElement);
    myTable.appendChild(row);
  })
 return false;
}

app.post('/product-search', (req, res) => {
  var sku = req.body.skuNumber;
  const sqlquery = "SELECT * FROM USWarehouse WHERE SKU = ?"
  conn.query(sqlquery, [sku],function(error,rows,fields) {
    res.json(rows);
    // var elm = document.getElementById('results').
  })
});

// app.get('/product-search', (req, res) => {
//   console.log("Should have printed in output");
//   var sku = req.body.skuNumber;
//   const sqlquery = "SELECT * FROM USWarehouse WHERE SKU = ?"
//   conn.query(sqlquery, [sku],function(error,rows,fields) {
//     res.json(rows);
//   })
// });

// // -> Import CSV File to MySQL database
// function importCsvData2MySQL(filePath){
//     var sku = [];
//     var Description = [];
//     var SellableOnHand = [];
//     var OpenPOqty = [];
//     var OneMonthSales = [];
//     var ThreeMonthSales = [];
//     var SixMonthSales = [];
//     var BackOrder = [];
//     var LeadTime = [];
//     var MoQ = [];
//     var FobSH = [];
//     var PackagingType = [];
//     var L_cm = [];
//     var W_cm = [];
//     var H_cm = [];
//     var GW_kg = [];
//     var NW_kg = [];
//     var Carton_qty = [];
//     var Pallet_Dim_cm = [];
//     var Pallet_Ctns = [];
//     var Pallet_qty = [];
//     var Pallet_WG_qty = [];
//     var Shipping_Date = [];
//     var Shipping_PO = [];
//     var Shipping_Qty = [];
//     var Cost_Unit = [];
//     var Shipping_Amt = [];
//     var Shpmt_Received = [];
//     var Shpmt_Date_Received = [];
//     var Vendor = [];
//     var Sales_PO = [];
//     var Sales_Qty = [];
//     var Sales_Date = [];
//     var Sales_Amt = [];
//
//     let stream = fs.createReadStream(filePath, 'utf-8');
//     let csvData = [];
//     let csvStream = csv
//         .parse()
//         .on("data", function (data) {
//             csvData.push(data);
//         })
//         .on("end", function () {
//             // Remove Header ROW
//             csvData.shift();
//             //loop through each item in array and save them to appropriate sub-array
//             // csvData.forEach(function(entry) {
//             //   sku = csvData[0];
//             //   Description = csvData[1];
//             //   SellableOnHand = csvData[2];
//             //   OpenPOqty = csvData[3];
//             //   OneMonthSales = csvData[4];
//             //   ThreeMonthSales = csvData[5];
//             //   SixMonthSales = csvData[6];
//             //   BackOrder = csvData[7];
//             //   LeadTime = csvData[8];
//             //   MoQ = csvData[9];
//             //   FobSH = csvData[10];
//             //   PackagingType = csvData[11];
//             //   L_cm = csvData[12];
//             //   W_cm = csvData[13];
//             //   H_cm = csvData[14];
//             //   GW_kg = csvData[15];
//             //   NW_kg = csvData[16];
//             //   Carton_qty = csvData[17];
//             //   Pallet_Dim_cm = csvData[18];
//             //   Pallet_Ctns = csvData[19];
//             //   Pallet_qty = csvData[20];
//             //   Pallet_WG_qty = csvData[21];
//             //   Shipping_Date = csvData[22];
//             //   Shipping_PO = csvData[23];
//             //   Shipping_Qty = csvData[24];
//             //   Cost_Unit = csvData[25];
//             //   Shipping_Amt = csvData[26];
//             //   Shpmt_Received = csvData[27];
//             //   Shpmt_Date_Received = csvData[28];
//             //   Vendor = csvData[29];
//             //   Sales_PO = csvData[30];
//             //   Sales_Qty = csvData[31];
//             //   Sales_Date = csvData[32];
//             //   Sales_Amt = csvData[33];
//             // });
//             // Open the MySQL connection
//             // conn.connect((error) => {
// //                 if (error) {
// //                     console.error(error);
// //                 } else {
//                     let query = 'INSERT INTO TestTable (SKU, Test1, Test2, Test3, Test4, Test5, Test6) VALUES ?';
//                     conn.query(query, [csvData], (error, response) => {
//                         console.log(error || response);
//                     });
//                 })
// //             });
//   // delete file after saving to MySQL database
//   // fs.unlinkSync(filePath)
//   //         });
//   stream.pipe(csvStream);
// }

//Anything below here is stuff used for testing purposes
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//this allows the user to create a new user and insert them into the database
app.post("/user_create", (req, res) => {
  console.log("Attempting to create a new user ...")
  //console.log("First name: " + req.body.create_first_name)
  const firstName = req.body.create_first_name
  const lastName = req.body.create_last_name

  const queryString = "INSERT INTO TestUsers(FirstName,LastName) VALUES (?,?)"
  conn.query(queryString, [firstName, lastName], (error, results, fields) => {
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

app.get("/users", (req, res) => {
  var user1 = {firstName: "Alberto" , lastName: "Garibay"}
  const user2 = {firstName: "Kolby" , lastName: "Ramirez"}
  res.json([user1, user2])

  //res.send("Nodemon updates when i save file")
})

app.get('/users/:id', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)

  // const connection = getConnection()

  const userId = req.params.id
  const queryString = "SELECT * FROM TestUsers WHERE ID = ?"
  conn.query(queryString, [userId], (error, rows, fields) => {
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
