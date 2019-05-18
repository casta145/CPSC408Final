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

app.set('view engine', 'ejs')
//functions in other js files
var conn = require('./dbConnection');
var create = require('./createTables');
var importCSV = require('./Import');
var exportCSV = require('./Export');

//outputs our api requests to console to help display what is occuring
app.use(morgan('short'))
//this allows access to the any file in the public folder
app.use(express.static('./public'))
//this allows us to parse any info we are attemping to collect form the webpage
//app.use(bodyParser.urlencoded({extended: false}))
var urlencodedParser = bodyParser.urlencoded({ extended: false});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//localhost 3000
app.listen(3000, () => {
  console.log("Server is up and running on 3000...")
});

//this connects to out main page
app.get("/",function(req, res){
	res.render('index')
  console.log("rendering login page")
});

//Establishes the connection to the products page to receive data
app.get("/products",function(req, res){
	res.render('products', {qs: req.query});
	// console.log(req.query);
  // console.log("rendering product page")
});

//For search function, grabs sku to search within database
app.post("/products",urlencodedParser,function(req, res){
	// console.log(req.body.skuNumber)
	var sku = req.body.skuNumber;
	if (sku == "") {
		//res.status(500).send('<script>alert("help")</script>');
		console.log('no sku input');
		res.redirect('/products');
	}else {
	  const sqlquery = "SELECT * FROM USWarehouse WHERE SKU = ?"
	  conn.query(sqlquery, [sku],function(error,rows,fields) {
				var data = rows[0];
				if (data == "" || data == null){
					console.log("query empty");
					res.redirect('/products');
				} else {
					res.render('products-search', {data});
				}
		})
	}
});

app.post("/products-search-all",urlencodedParser,function(req, res){
	// console.log(req.body.skuNumber)
	  const sqlquery = "SELECT * FROM USWarehouse"
	  conn.query(sqlquery,function(error,rows,fields) {
				var data = rows;

				if (data == "" || data == null){
					console.log("query empty");
					res.redirect('/products');
				} else {
					res.render('products-search-all', {data});
				}
		})
});

//Grabs data entered and inserts new record into database
app.post("/insertRecord",urlencodedParser,(req,res) => {
	var sku = parseInt(req.body.skuNumber);
	var description = String(req.body.description);
	var sellable = parseInt(req.body.sellable);
	var poNumber = parseInt(req.body.openPO);
	var moq =  parseInt(req.body.moq);
	var leadtime =  parseInt(req.body.leadtime);
	var backorder =  parseInt(req.body.bkorder);
	if (sku != "" && description != "" && sellable != "" && poNumber != "" && moq != "" && leadtime != "" && backorder != "") {
		var insert = [[sku,description,sellable,poNumber,moq,leadtime,backorder]];
		const sqlquery = "INSERT INTO USWarehouse (SKU, Description, SellableOnHand, OpenPOQuantity, MOQ, LeadTime, BackOrders) VALUES ?";
		conn.query(sqlquery, [insert],function(error,rows,fields) {
			console.log(error);
			console.log('Product Inserted');
		})
	} else {
		res.redirect('/products');
	}
		// console.log(sku);
});

//it doesnt do the checks the way it should, still deletes but if null input it deletes nothing, it does not break anything
app.post("/deleteProduct",urlencodedParser, function(req,res) {
	var sku = parseInt(req.body.skuNumber);
  const sqlquery = 'DELETE FROM USWarehouse WHERE SKU = ?'
  conn.query(sqlquery, [sku],function(error,rows,fields) {
		var data = rows;
			console.log("Product Deleted");
			res.redirect('/products');
		})
});

//Popup box that allows user to update everything but the sku
app.post("/editProduct",urlencodedParser,function(req,res) {
	var sku = parseInt(req.body.skuNumber);
	var description = String(req.body.description);
	var sellable = parseInt(req.body.sellable);
	var poNumber = parseInt(req.body.openPO);
	var moq =  parseInt(req.body.moq);
	var leadtime =  parseInt(req.body.leadtime);
	var backorder =  parseInt(req.body.bkorder);
		if (sku != "" & description != "" && sellable != "" && poNumber != "" && moq != "" && leadtime != "" && backorder !="") {
			var values = [[description, sellable,poNumber,moq,leadtime,backorder]]
			var sku = [sku];
			const query = "UPDATE USWarehouse SET Description = ?,SellableOnHand = ?,OpenPOQuantity = ?,MOQ = ?,LeadTime = ?,BackOrders = ? WHERE SKU = ?";
			conn.query(query,[description, sellable,poNumber,moq,leadtime,backorder,sku],function(error,rows,fields) {
				console.log(error);
				res.redirect('/products');
			})
		} else {
			console.log("Left field empty; All field need to be filled.");
			res.redirect('/products');
		}
});

//Establishes connection to the shipping page to receive data
app.get("/shipping",function(req, res){
	res.render('shipping', {qs: req.query});
	// console.log(req.query);
  // console.log("rendering shipping page");
});

app.get("/sales-reports",function(req, res){
	const sqlquery = "Select Count(ShippingTable.Received) as Yes FROM ShippingTable WHERE Received = 'Yes'"
	conn.query(sqlquery, function(error,rows,fields) {
	dataYes = rows[0].Yes;
		const sqlquery = "Select Count(ShippingTable.Received) as No FROM ShippingTable WHERE Received = 'No'"
		conn.query(sqlquery, function(error,rows,fields) {
			dataNo = rows[0].No;
			console.log(dataNo);
			res.render('sales-reports', {dataYes,dataNo});
		})
	})


});

//For search function, grabs sku to search within database
app.post("/shipping",urlencodedParser,function(req, res){
	// console.log(req.body.skuNumber);
	// console.log(req.body.shPOnum);
	var sku = req.body.skuNumber;
	var poNum = req.body.shPOnum;
	if (sku == "" && poNum == "") {
		res.redirect('/shipping');
	} else if (sku != "" && poNum == ""){
	  const sqlquery = "SELECT * FROM ShippingTable WHERE SKU = ?"
	  conn.query(sqlquery, [sku],function(error,rows,fields) {
			var data = rows;
			console.log(data);
			if (data == "" || data == null){
				console.log("query empty");
				res.redirect('/shipping');
			} else {
				res.render('shipping-search', {data});
			}
		})
	} else if (sku == "" && poNum != "") {
		const sqlquery = "SELECT * FROM ShippingTable WHERE ShippingPONumber = ?"
		conn.query(sqlquery, [poNum], function(error,rows,fields) {
			var data = rows;
			if (data == "" || data == null){
				console.log("query empty");
				res.redirect('/shipping');
			} else {
				res.render('shipping-search', {data});
			}
		})
	}
});

//Grabs data entered and inserts new record into database
app.post("/insertshipping", urlencodedParser, function(req, res){
	var sku = parseInt(req.body.skuNumber);
	var shippingdate = String(req.body.shippingdate);
	var shippingpo = parseInt(req.body.shippingpo);
	var shippingqty = parseInt(req.body.shippingqty);
	var incostperunit = parseInt(req.body.incostperunit);
	var shiptotalamount = parseFloat(req.body.shiptotalamount);
	var received = String(req.body.received);
	var ShippingDateReceived = String(req.body.ShippingDateReceived);
	if (sku != '' && shippingdate != '' && shippingpo != '' && shippingqty != '' && incostperunit != '' && shiptotalamount != '' && received != ''){
		var insertship = [[sku,shippingdate,shippingpo,shippingqty,incostperunit,shiptotalamount,received,ShippingDateReceived]];
		const sqlqueries = "INSERT INTO ShippingTable (SKU, ShippingDate, ShippingPONumber, ShippingQty, IncostUnit, ShippingTotalAmt, Received, ShippingDateReceived) VALUES ?";
			conn.query(sqlqueries, [insertship],function(error,rows,fields) {
				console.log(error);
				console.log("Shipment Inserted!");
			})
		} else {
			res.redirect('/shipping');
		}
});

//it doesnt do the checks the way it should, still deletes but if null input it deletes nothing, it does not break anything
app.post("/deleteShipping",urlencodedParser, function(req,res) {
	var sku = parseInt(req.body.skuNumber);
	const sqlquery = 'DELETE FROM ShippingTable WHERE SKU = ?'
	  conn.query(sqlquery, [sku],function(error,rows,fields) {
			var data = rows;
			console.log("Shipping Deleted");
			res.redirect('/shipping');
		})
});

//Popup box that allows user to update everything but the sku
app.post("/editshipping",urlencodedParser,function(req,res) {
	var sku = parseInt(req.body.skuNumber);
	var shDate = String(req.body.shdate);
	var shPOnum = parseInt(req.body.shPOnum);
	var shQty = parseInt(req.body.shqty);
	var shcost = parseInt(req.body.shcostunit);
	var shTotl =  parseFloat(req.body.shtotalamt);
	var shRec =  String(req.body.shreceived);
	var recDate =  String(req.body.shreceiveddate);
		if (sku != "" & shDate != "" && shPOnum != "" && shQty != "" && shcost != "" && shTotl != "" && shRec != "" && recDate !="") {

			const query = "UPDATE ShippingTable SET ShippingDate = ?,ShippingPONumber = ?,ShippingQty = ?,IncostUnit = ?,ShippingTotalAmt = ?,Received = ?, ShippingDateReceived = ? WHERE SKU = ?";

			const updateQuanity = "UPDATE USWarehouse, ShippingTable SET USWarehouse.OpenPOQuantity = USWarehouse.OpenPOQuantity - (SELECT ShippingTable.ShippingQty FROM ShippingTable WHERE (ShippingTable.SKU = ?) and (ShippingTable.ShippingPONumber = ?)) WHERE USWarehouse.SKU = (Select ShippingTable.SKU FROM ShippingTable WHERE ((ShippingTable.SKU= ?) AND (ShippingTable.Received = 'Yes') AND (ShippingTable.ShippingPONumber = ?)))";

			const updateSellable = "UPDATE USWarehouse, ShippingTable SET USWarehouse.SellableOnHand = USWarehouse.SellableOnHand + (SELECT ShippingTable.ShippingQty FROM ShippingTable WHERE (ShippingTable.SKU = ?) and (ShippingTable.ShippingPONumber = ?)) WHERE USWarehouse.SKU = (Select ShippingTable.SKU FROM ShippingTable WHERE ((ShippingTable.SKU = ?) AND (ShippingTable.Received = 'Yes') AND (ShippingTable.ShippingPONumber = ?)))";


			conn.beginTransaction(function(err){
				if (err) { throw err; }
				conn.query(query,[shDate, shPOnum,shQty,shcost,shTotl,shRec,recDate,sku],function(error,rows,fields) {
					if (error) {
						console.log(error);
					} else {
						console.log('Shippment Updated!');
						//res.redirect('/shipping');
					}

	 				conn.query(updateQuanity,[sku, shPOnum, sku, shPOnum], function(err, result) {
		 				if (err) {
			 				conn.rollback(function() {
				 				throw err;
			 				});
		 				}

		 				conn.query(updateSellable,[sku, shPOnum, sku, shPOnum], function(err, result) {
			 				if (err) {
				 				conn.rollback(function() {
					 				throw err;
				 				});
			 				}
			 				conn.commit(function(err) {
				 				if (err) {
					 				conn.rollback(function() {
						 				throw err;
					 				});
				 				}
				 				console.log('Transaction Complete.');
				 				conn.end();
			 				});
		 				});
					});
 				});
			});
		} else {
			console.log("Left field empty; All field need to be filled.");
			res.redirect('/shipping');
		}
});

app.post("/shipping-search-all",urlencodedParser,function(req, res){
	// console.log(req.body.skuNumber)
	  const sqlquery = "SELECT * FROM ShippingTable"
	  conn.query(sqlquery,function(error,rows,fields) {
				var data = rows;

				if (data == "" || data == null){
					console.log("query empty");
					res.redirect('/shipping');
				} else {
					res.render('shipping-search-all', {data});
				}
		})
});

//Establishes connection to the sales page to receive data
app.get("/sales",function(req, res){
	res.render('sales', {qs: req.query});
	// console.log(req.query);
  // console.log("rendering sales page")
});

//For search function, grabs sku to search within database
app.post("/sales",urlencodedParser,function(req, res){
	var sku = req.body.skuNumber;
	var poNum = req.body.sPOnum;
	var vendor = req.body.sVendor;
	if (sku == '' && poNum == '' && vendor == '') {
		res.redirect('/sales');
	} else if (sku != '' && poNum == '' && vendor == ''){
	  const sqlquery = "SELECT * FROM SalesTable WHERE SKU = ?"
	  conn.query(sqlquery, [sku],function(error,rows,fields) {
			var data = rows;
			if (data == null || data == "") {
				console.log('Empty Query!');
				res.redirect('/sales');
			} else {
				res.render('sales-search', {data});
			}
		})
	} else if (sku == '' && poNum != '' && vendor == '') {
		const sqlquery = "SELECT * FROM SalesTable WHERE SalesPONumber = ?"
		conn.query(sqlquery, [poNum], function(error,rows,fields) {
			var data = rows;
			if (data == null || data == '') {
				console.log('Empty Query!');
				res.redirect('/sales');
			} else {
				res.render('sales-search', {data});
			}
		})
	} else if (sku == '' && poNum == '' && vendor != '') {
		const sqlquery = "SELECT * FROM SalesTable WHERE Vendor = ?"
		conn.query(sqlquery, [vendor], function(error,rows,fields) {
			var data = rows;
			if (data == null || data == '') {
				console.log('Empty Query!');
				res.redirect('/sales');
			} else {
				res.render('sales-search', {data});
			}
		})
	} else {
		console.log('exists out');
		res.redirect('/sales');
	}
});

//Grabs data entered and inserts new record into database
app.post("/insertsales", urlencodedParser, function(req, res){
	var sku = parseInt(req.body.skuNumber);
	var vendor = String(req.body.vendor);
	var salespo = parseInt(req.body.salespo);
	var salesqty = parseInt(req.body.salesqty);
	var salesdate = String(req.body.salesdate)
	var salesamt = parseFloat(req.body.salesamt);
	if (sku != '' && vendor != '' && salespo != '' && salesqty != '' && salesdate != '' && salesamt != '') {
		var insertsales = [[sku,vendor,salespo,salesqty,salesdate,salesamt]];
		const sqlquery = "INSERT INTO SalesTable (SKU, Vendor, SalesPONumber, SalesQty, SalesDate, SalesAmt) VALUES ?";
		conn.query(sqlquery, [insertsales],function(error,rows,fields) {
			var data = rows[0];
			if (data == null || data == '') {
				console.log('Empty Insert!');
				res.redirect('/sales');
			} else {
				console.log("Sale Inserted!");
				res.render('sales-search', {data});
			}
		})
	} else {
		res.redirect('/sales');
	}
});

//it doesnt do the checks the way it should, still deletes but if null input it deletes nothing, it does not break anything
app.post("/deleteSalesbySKU",urlencodedParser, function(req,res) {
	var sku = parseInt(req.body.skuNumber);
	const sqlquery = 'DELETE FROM SalesTable WHERE SKU = ?'
	  conn.query(sqlquery, [sku],function(error,rows,fields) {
			var data = rows;
			console.log("Sale Deleted");
			res.redirect('/sales');
		})
});

//it doesnt do the checks the way it should, still deletes but if null input it deletes nothing, it does not break anything
app.post("/deleteSalesbyPO",urlencodedParser, function(req,res) {
	var po = parseInt(req.body.sPOnum);
	const sqlquery = 'DELETE FROM SalesTable WHERE SalesPONumber = ?'
	  conn.query(sqlquery, [po],function(error,rows,fields) {
			var data = rows;
			console.log("Sale Deleted");
			res.redirect('/sales');
		})
});

//Popup box that allows user to update everything but the sku
app.post("/editsales",urlencodedParser,function(req,res) {
	var sku = parseInt(req.body.skuNumber);
	var sVendor = String(req.body.vendor);
	var sPO = parseInt(req.body.salespo);
	var sQty = parseInt(req.body.salesqty);
	var sDate = String(req.body.salesdate);
	var sAmt =  parseFloat(req.body.salesamt);
		if (sku != "" & sVendor != "" && sPO != "" && sQty != "" && sDate != "" && sAmt != "") {
			const query = "UPDATE ShippingTable SET Vendor = ?,ShippingPONumber = ?,SalesPONumber = ?,SalesQty = ?,SalesDate = ?,SalesAmt = ? WHERE SKU = ?";
			conn.query(query,[sVendor, sPO,sQty,sDate,sAmt,sku],function(error,rows,fields) {
				if (error) {
					console.log(error);
				} else {
					console.log('Sale Updated!');
					res.redirect('/sales');
				}
			})
		} else {
			console.log("Left field empty; All field need to be filled.");
			res.redirect('/sales');
		}
});

app.post("/sales-search-all",urlencodedParser,function(req, res){
	// console.log(req.body.skuNumber)
	  const sqlquery = "SELECT * FROM SalesTable"
	  conn.query(sqlquery,function(error,rows,fields) {
				var data = rows;
				if (data == "" || data == null){
					console.log("query empty");
					res.redirect('/sales');
				} else {
					res.render('sales-search-all', {data});
				}
		})
});

//authenticates uers credentials before login
app.post('/home-page',urlencodedParser,function(request, response) {
	console.log(request.body)

	var email = request.body.email;
	var password = request.body.password;
	if (email && password) {
		conn.query('SELECT * FROM Accounts WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.email = email;
        create;
				response.render('home');
			} else {
        response.render('index')
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
app.get('/home',function(request, response) {
		response.render('home');
});

app.post("/importDB",(req, res) => {
  var csvfile = req.body.csvfile;
	console.log(csvfile);
  //importCsvData2MySQL(csvfile);
  importCSV.import(csvfile);
});

app.post("/exportDB",(req, res) => {
  exportCSV.import();
	res.redirect('/home');
});

// app.post("/editProduct",urlencodedParser,(req,res) => {
// 	var sku = parseInt(req.body.skuNumber);
// 	var description = String(req.body.description);
// 	var sellable = parseInt(req.body.sellable);
// 	var poNumber = parseInt(req.body.openPO);
// 	var moq =  parseInt(req.body.moq);
// 	var leadtime =  parseInt(req.body.leadtime);
// 	var backorder =  parseInt(req.body.bkorder);
// 	var insert = [[sku,description,sellable,poNumber,moq,leadtime,backorder]];
// 	const sqlquery = "INSERT INTO USWarehouse (SKU, Description, SellableOnHand, OpenPOQuantity, MOQ, LeadTime, BackOrders) VALUES ?";
// 	conn.query(sqlquery, [insert],function(error,rows,fields) {
// 		console.log(error);
// 		var data = rows;
// 		//console.log(data);
// 		// res.render('shipping-search', {data});
// 	})
// 		// console.log(sku);
// });

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
