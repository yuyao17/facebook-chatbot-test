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
  res.send("Hi I am chatBot!!!!!!!!aaa")
})

// Facebook

app.get('/webhook/', function(req, res){
  if (req.query['hub.verify_token'] === "yuyaaaar") {
    res.send(req.query['hub.challenge'])
    res.json(req.query)
  }
  res.send("Wrong token")
})

app.post('/webhook/', function(req, res){
  let messaging_events = req.body.entry[0].messaging_events
  for (let i = 0; i < messaging_events.length; i++) {

  }
})

// Listen to server

app.listen(port, function(){
  console.log(`listening to ${port}`)
})
