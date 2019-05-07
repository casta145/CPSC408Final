var conn = require('./dbConnection');
const mysql = require('mysql')

$(document).ready(function(){
  $('#skuSearch').click(function(){
    var sku = $('#skuNumber').val();
    const sqlquery = "SELECT * FROM USWarehouse WHERE SKU = ?"
    if (sku == "") {
      alert("Please Enter a Sku!");
    } else {
      conn.query(sqlquery, [sku],function(error,rows,fields) {
        var data = json(rows);
      }
      $.ajax({
        type: "POST",
        url: "products.html",
        data: data,
        cache: false,
        success: function(result) {
          alert(result);
        }
      });
    }
    return false;
  });
});


//   var sku = req.body.skuNumber;
//   const sqlquery = "SELECT * FROM USWarehouse WHERE SKU = ?"
//   conn.query(sqlquery, [sku],function(error,rows,fields) {
//     res.json(rows);
