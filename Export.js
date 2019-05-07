const conn = require('./dbConnection');
const fs = require('fs');
const mysql = require('mysql')
const csv = require('fast-csv');
const multer = require('multer');
const ws = fs.createWriteStream('DBexport.csv');

module.exports = {
  import: function exportToCSV() {
    var query = "SELECT USWarehouse.SKU, USWarehouse.Description, USWarehouse.SellableOnHand, USWarehouse.OpenPOQuantity, t.OneMonthSales, t.ThreeMonthSales, t.SixMonthSales, USWarehouse.BackOrders, USWarehouse.LeadTime, USWarehouse.MOQ, d.Fob_SH,p.PackagingType, d.L_cm, d.W_cm, d.H_cm, d.G_W_kg, d.N_W_kg, p.CartonQuantity, p.PalletDim, p.PalletCtns, p.PalletQty, p.PalletWeight, sh.ShippingDate, sh.ShippingPONumber, sh.ShippingQty, sh.IncostUnit,sh.ShippingTotalAmt, sh.Received, sh.ShippingDateReceived, s.Vendor, s.SalesPONumber, s.SalesQty, s.SalesDate, s.SalesAmt FROM USWarehouse JOIN TotalSales t ON USWarehouse.SKU = t.SKU JOIN SalesTable s ON t.SKU = s.SKU JOIN DimensionTable d ON s.SKU = d.SKU JOIN PackagingTable p ON d.SKU = p.SKU JOIN ShippingTable sh ON p.SKU = sh.SKU ORDER BY SKU ASC";
    conn.query(query, (error,rows,response) => {
      console.log(error || response);
      var str = convertToCSV(rows);

        csv.
          write([
            ["SKU", "Description", "Sellable On Hand", "Open PO Quantity", "One Month Sales", "Three Month Sales",
          "Six Month Sales", "Backorder", "LeadTime", "MOQ", "Fob SH", "Packaging Type", " L_cm", "W_cm", "H_cm",
          "G_W_kg", "N_W_kg", "Carton Quantity", "Pallet Dim_cm", "Pallet Ctn", "Pallet Quantity", "Pallet Weight_kg",
        "Shpping Date", "Shipping PO Number", "Shipping Quantity", "InCost/Unit", "Shipping Amount", "Received",
        "Shipping Date Received", "Vendor", "Sales PO Number", "Sales Quantity", "Sales Date", "Sales Amount"],
      ], {headers:true})
      .pipe(ws);
    });
  }
};


function convertToCSV(array) {
  var str = "";
  for(var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ','
      line += array[i][index];
    }
    str += line + '\r\n';
  }
  console.log(str);
  // downloadCSV(str);
  return str;
}
//
// function downloadCSV(args) {
//   var data, filename, link;
//   var csv = args;
//   if (csv == null) return;
//   filename = args.filename || "DBExport.csv";
//   if (!csv.match(/^data:text\/csv/i)) {
//     csv = 'data:text/csv;charset=utf-8,' + csv;
//   }
//   date = encodeURI(csv);
//   link = document.createElement('a');
//   link.setAttribute('href', data);
//   link.setAttribute('download', filename);
//   link.click();
// }
