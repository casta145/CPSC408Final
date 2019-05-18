# CPSC408Final

Class: CPSC 408-01 (Professor Rene)

* Name: Alfonso Castanos, SID: 2283681,
* Name: Alberto Garibay, SID: 2271460,
* Name: Kolby Ramirez, SID: 2277817

## NOTICE:
You can go to this link to view it on glitch: LINK
or
You can clone your own copy and cd into the project folder and use 
* node app.js
in the console to run the application on Localhost: 3000

## Program Description
We get the inspiration to create this project through Kolby's uncle. His uncle owns a business where he sells products to customers but he keeps track of everything through an excel sheet. This can be a very tedious and dangerous if not handled properly. So we decided to create a custom database website to help him keep track of everything going in and out of his business.

Our project was created with NodeJS with the Express framework. Using an api that would connect to our database and return the queried information into the ejs files to be viewable to the user. 

## Actions
Our application does the following:
* It prints and displays the records from the database tables; such information as products, sales, and shipping records
* It queries different data based on different inputs
* It can create new records; such a new record in products, sales, and shipping tables
* It can delete/update records
* It utilizes transactions when updated records. For example when updating a record in shipping it must also update within products and this must run together without fail
* It can generate reports such as exporting data to a csv
