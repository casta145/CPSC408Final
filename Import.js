const conn = require('./dbConnection');
const fs = require('fs');
const mysql = require('mysql')
const csv = require('fast-csv');
const multer = require('multer');


module.exports = {
  // -> Import CSV File to MySQL database
  import: function importCsvData2MySQL(filePath){
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

              sku = parseInt(csvData[0]);
              Description = String(csvData[1]);
              SellableOnHand = parseInt(csvData[2]);
              OpenPOqty = parseInt(csvData[3]);
              // OneMonthSales = parseInt(csvData[4]);
              // ThreeMonthSales = parseInt(csvData[5]);
              // SixMonthSales = parseInt(csvData[6]);
              BackOrder = parseInt(csvData[7]);
              LeadTime = parseInt(csvData[8]);
              MoQ = parseInt(csvData[9]);
              // var query = "INSERT INTO TestTable (SKU, Test1, Test2, Test3, Test4, Test5, Test6) VALUES ?";
              var query = 'INSERT INTO USWarehouse (SKU, Description, SellableOnHand, OpenPOQuantity, MOQ, LeadTime, BackOrders) VALUES ?,?,?,?,?,?,?'
              conn.query(query, [sku,Description,SellableOnHand,OpenPOqty,MoQ, LeadTime, BackOrder], (error,response) => {
                console.log(error || response);
          });
  //         Open the MySQL connection
  //           var query = "INSERT INTO TestTable (SKU, Test1, Test2, Test3, Test4, Test5, Test6) VALUES ?,?,?,?,?,?,?";
  //           // var query = 'INSERT INTO USWarehouse (SKU, Description, SellableOnHand, OpenPOQuantity, MOQ, LeadTime, BackOrders) VALUES ?'
  //           conn.query(query, [csvData], (error,response) => {
  //             console.log(error || response);
            });
    stream.pipe(csvStream);
  }
};


// console.log("entering for each loop");
//   var index = 0;
//   while (index < sku.length ){
//     var query = 'INSERT INTO USWarehouse (SKU, Description, SellableOnHand, OpenPOQuantity, MOQ, LeadTime, BackOrders) VALUES ?,?,?,?,?,?,?'
//     conn.query(query, [sku[index], Description[index], SellableOnHand[index], OpenPOqty[index], MoQ[index], LeadTime[index], BackOrder[index]], (error,response) => {
//       console.log(error || response);
//     });
//     console.log("in while loop");
//     index++;

// csvData.forEach(function(entry) {
  // sku = parseInt(csvData[0]);
  // console.log(csvData[0]);
  // Description = String(csvData[1]);
  // SellableOnHand = parseInt(csvData[2]);
  // OpenPOqty = parseInt(csvData[3]);
  // OneMonthSales = parseInt(csvData[4]);
  // ThreeMonthSales = parseInt(csvData[5]);
  // SixMonthSales = parseInt(csvData[6]);
  // BackOrder = parseInt(csvData[7]);
  // LeadTime = parseInt(csvData[8]);
  // MoQ = parseInt(csvData[9]);
  // FobSH = parseFloat(csvData[10]);
  // PackagingType = String(csvData[11]);
  // L_cm = parseInt(csvData[12]);
  // W_cm = parseInt(csvData[13]);
  // H_cm = parseInt(csvData[14]);
  // GW_kg = parseInt(csvData[15]);
  // NW_kg = parseInt(csvData[16]);
  // Carton_qty = parseInt(csvData[17]);
  // Pallet_Dim_cm = String(csvData[18]);
  // Pallet_Ctns = parseInt(csvData[19]);
  // Pallet_qty = parseInt(csvData[20]);
  // Pallet_WG_qty = parseInt(csvData[21]);
  // Shipping_Date = String(csvData[22]);
  // Shipping_PO = parseInt(csvData[23]);
  // Shipping_Qty = parseInt(csvData[24]);
  // Cost_Unit = parseInt(csvData[25]);
  // Shipping_Amt = parseFloat(csvData[26]);
  // Shpmt_Received = String(csvData[27]);
  // Shpmt_Date_Received = String(csvData[28]);
  // Vendor = String(csvData[29]);
  // Sales_PO = parseInt(csvData[30]);
  // Sales_Qty = parseInt(csvData[31]);
  // Sales_Date = String(csvData[32]);
  // Sales_Amt = parseInt(csvData[33]);
// });
