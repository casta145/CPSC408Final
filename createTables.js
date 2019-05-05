var conn = require('./dbConnection');
const mysql = require('mysql')

function intializeTables() {
  var createUSWarehouse = `CREATE TABLE IF NOT EXISTS USWarehouse (
                              WarehouseId INTEGER auto_increment not null,
                              SKU INTEGER UNIQUE,
                              PRIMARY KEY (WarehouseId),
                              Description varchar(25),
                              SellableOnHand INTEGER,
                              OpenPOQuantity INTEGER,
                              MOQ INTEGER,
                              LeadTime INTEGER,
                              BackOrders INTEGER)`;

  // var createTotalSales = `CREATE TABLE IF NOT EXISTS TotalSales (
  //                           SalesId INTEGER auto_increment not null,
  //                           PRIMARY KEY (SalesId),
  //                           OneMonthSales INTEGER,
  //                           ThreeMonthSales INTEGER,
  //                           SixMonthSales INTEGER)`;

  var createDimensionTable = `CREATE TABLE IF NOT EXISTS DimensionTable (
                              DimensionId INTEGER auto_increment not null,
                              PRIMARY KEY (DimensionId),
                              SKU INTEGER,
                              Fob_SH FLOAT,
                              L_cm INTEGER,
                              W_cm INTEGER,
                              H_cm INTEGER,
                              G_W_kg INTEGER,
                              N_W_kg INTEGER)`;

  var createPackagingTable = `CREATE TABLE IF NOT EXISTS PackagingTable (
                              PackagingId INTEGER auto_increment not null,
                              PRIMARY KEY (PackagingId),
                              SKU INTEGER,
                              PackagingType varchar(30),
                              PalletDim varchar(30),
                              PalletCtns INTEGER,
                              PalletQty INTEGER,
                              PalletWeight INTEGER,
                              CartonQuantity INTEGER)`;

  var createShippingTable = `CREATE TABLE IF NOT EXISTS ShippingTable (
                              ShippingId INTEGER auto_increment not null,
                              PRIMARY KEY (ShippingId),
                              SKU INTEGER,
                              ShippingDate varchar(10),
                              ShippingPONumber INTEGER,
                              ShippingQty INTEGER,
                              IncostUnit INTEGER,
                              ShippingTotalAmt FLOAT,
                              Received varchar(3),
                              ShippingDateReceived varchar(10))`;

  var createSalesTable = `CREATE TABLE IF NOT EXISTS SalesTable (
                              SalesId INTEGER auto_increment not null,
                              PRIMARY KEY (SalesId),
                              SKU INTEGER,
                              Vendor varchar(30),
                              SalesPONumber INTEGER,
                              SalesQty INTEGER,
                              SalesDate varchar(10),
                              SalesAmt FLOAT)`;

  var TestTable = 'CREATE TABLE IF NOT EXISTS TestTable (' +
                      'SKU INTEGER UNIQUE,' +
                      'PRIMARY KEY (SKU),' +
                      'Test1 varchar(20),' +
                      'Test2 varchar(20),' +
                      'Test3 varchar(20),' +
                      'Test4 varchar(20),' +
                      'Test5 varchar(20),' +
                      'Test6 varchar(20))';

  conn.query(TestTable, function(err,result) {
    if (err) {
      console.log(err);
    }
    console.log('TestTable Table Created!');
  });
  conn.query(createUSWarehouse, function(err,result) {
    if (err) {
      console.log(err);
    }
    console.log('USWarehouse Table Created!');
  });
  conn.query(createDimensionTable, function(err,result) {
    if (err) {
      console.log(err);
    }
    console.log('Dimension Table Created!');
  });
  conn.query(createPackagingTable, function(err,result) {
    if (err) {
      consol.log(err);
    }
    console.log('Packaging Table Created!');
  });
  conn.query(createShippingTable, function(err,result) {
    if (err) {
      console.log(err);
    }
    console.log('Shipping Table Created!');
  });
  conn.query(createSalesTable, function(err,result) {
    if (err) {
      console.log(err);
    }
    console.log('Sales Table Created!');
  });
}

module.exports = intializeTables();
