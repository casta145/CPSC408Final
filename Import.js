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
              // Open the MySQL connection

                var query = 'INSERT INTO TestTable (SKU, Test1, Test2, Test3, Test4, Test5, Test6) VALUES ?'
                conn.query(query, [csvData], (error, response) => {
                 console.log(error || response);
                });
    // delete file after saving to MySQL database
    // fs.unlinkSync(filePath)
            });
    stream.pipe(csvStream);
  }
};
