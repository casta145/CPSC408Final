const conn = require('./dbConnection');
const fs = require('fs');
const mysql = require('mysql')
const csv = require('fast-csv');
const multer = require('multer');

module.exports = {
  import: function exportToCSV() {
    var query = "Select USWarehouse.SKU, USWarehouse.Description, USWarehouse.SellableOnHand, USWarehouse.OpenPOQuantity, t.OneMonthSales, t.ThreeMonthSales, t.SixMonthSales, USWarehouse.BackOrders, USWarehouse.LeadTime, USWarehouse.MOQ, d.Fob_SH, p.PackagingType, d.L_cm, d.W_cm, d.H_cm, d.G_W_kg, d.N_W_kg, p.CartonQuantity, p.PalletDim, p.PalletCtns, p.PalletQty, p.PalletWeight, sh.ShippingDate, sh.ShippingPONumber, sh.ShippingQty, sh.IncostUnit,sh.ShippingTotalAmt,sh.Received, sh.ShippingDateReceived, s.Vendor, s.SalesPONumber, s.SalesQty, s.SalesDate, s.SalesAmt from USWarehouse join TotalSales t on USWarehouse.SKU = t.SKU join SalesTable s on t.SKU = s.SKU join ShippingTable sh on s.SKU = sh.SKU join DimensionTable d on USWarehouse.WarehouseID = d.WarehouseID join PackagingTable p on d.DimensionId = p.DimensionID order by SKU asc;";
    conn.query(query, function(error, rows, fields){
      var data = rows[0]
      if (error) {
        consol.log(error);
      }else {
        var file = "SKU,Description,Sellable On Hand,Open PO Quantity,One Month Sales,Three Month Sales,Six Month Sales,Backorder,LeadTime,MOQ,Fob SH,Packaging Type,L_cm,W_cm,H_cm,G_W_kg,N_W_kg,Carton Quantity,Pallet Dim_cm,Pallet Ctn,Pallet Quantity,Pallet Weight_kg,Shpping Date,Shipping PO Number,Shipping Quantity,InCost/Unit,Shipping Amount,Received,Shipping Date Received,Vendor,Sales PO Number,Sales Quantity,Sales Date,Sales Amount\n";
        for (var i in rows){
          file += rows[i].SKU + ',';
          file += rows[i].Description + ',';
          file += rows[i].SellableOnHand + ',';
          file += rows[i].OpenPOQuantity + ',';
          file += rows[i].OneMonthSales + ',';
          file += rows[i].ThreeMonthSales + ',';
          file += rows[i].SixMonthSales + ',';
          file += rows[i].BackOrders + ',';
          file += rows[i].LeadTime + ',';
          file += rows[i].MOQ + ',';
          file += rows[i].Fob_SH + ',';
          file += rows[i].PackagingType + ',';
          file += rows[i].L_cm + ',';
          file += rows[i].W_cm + ',';
          file += rows[i].H_cm + ',';
          file += rows[i].G_W_kg + ',';
          file += rows[i].N_W_kg + ',';
          file += rows[i].CartonQuantity + ',';
          file += rows[i].PalletDim + ',';
          file += rows[i].PalletCtns + ',';
          file += rows[i].PalletQty + ',';
          file += rows[i].PalletWeight + ',';
          file += rows[i].ShippingDate + ',';
          file += rows[i].ShippingPONumber + ',';
          file += rows[i].ShippingQty + ',';
          file += rows[i].IncostUnit + ',';
          file += rows[i].ShippingTotalAmt + ',';
          file += rows[i].Received + ',';
          file += rows[i].ShippingDateReceived + ',';
          file += rows[i].Vendor + ',';
          file += rows[i].SalesPONumber + ',';
          file += rows[i].SalesQty + ',';
          file += rows[i].SalesDate + ',';
          file += rows[i].SalesAmt + '\n';

        }
        var filename = 'MaxxHualDB-' + getDate();
        fs.writeFile(require('path').join(require('os').homedir(), 'Desktop/Exports/') + filename, file, function(err) {
          if (err){
            console.log(err);
          }else {
            console.log('Saved!');
          }
        })
      }
    });
  }
}
