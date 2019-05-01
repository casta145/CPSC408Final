 //the app.js runs the enter front end of the website

//these are the tools that are we are using to help with our requests
const express = require('express')
const app = express()
const mysql = require('mysql')
const morgan = require('morgan')
const bodyParser = require('body-parser')

//outputs our api requests to console to help display what is occuring
app.use(morgan('short'))
//this allows access to the any file in the public folder
app.use(express.static('./public'))
app.use(express.static('./public/js'))
//this allows us to parse any info we are attemping to collect form the webpage
app.use(bodyParser.urlencoded({extended: false}))

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
app.get("/js/index.html", (req, res) => {
  console.log("Responding to root route")
  res.send("Hello from root")
})

//this allows the user to create a new user and insert them into the database
app.post("/user_create", (req, res) => {
  console.log("Attempting to create a new user ...")
  //console.log("First name: " + req.body.create_first_name)
  const firstName = req.body.create_first_name
  const lastName = req.body.create_last_name

  const queryString = "INSERT INTO Users(FirstName,LastName) VALUES (?,?)"
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
  const queryString = "SELECT * FROM Users WHERE ID = ?"
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
