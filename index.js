'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('express')

const app = express()

app.set('port', (process.env.PORT || 3000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

var port = app.get("port")

// Routes

app.get('/', function(req, res){
  res.send("Hi I am chatBot!!")
})

// Facebook

app.get('/webhook/', function(req, res){
  if (req.query['hub.verify_token'] === "yuyaaaar") {
    res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})

// Listen to server

app.listen(port, function(){
  console.log(`listening to ${port}`)
})
