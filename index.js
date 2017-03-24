'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 3000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

var port = app.get("port")

var token = "EAAIlA8L7tAYBAOYsdb2UNTsh2kvCDCdEm8j1iaFvmAihoKZBGdHCeYXFPfKyyk1C1OaZBY6nUVKNg1m6ivbW1UfiNFkmjZAQ4xV2aXt0Tg3wFACYvfEyxKpyq1QNGJNi8bcZBgErERM2mYZAxKPao29kJR73PCb8r6YCutZBUoNAZDZD"
// Routes

app.get('/', function(req, res){
  res.send("Hi I am chatBot!!!!!!!!aaa")
})

// Facebook

app.get('/webhook/', function(req, res){
  if (req.query['hub.verify_token'] === "yuyaaaar") {
    res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})

app.post('/webhook/', function(req, res){
  let messaging_events = req.body.entry[0].messaging
  console.log(req.body)
  for (let i = 0; i < messaging_events.length; i++) {
    let event = messaging_events[i]
    let sender = event.sender.id
    if (event.message && event.message.text) {
      let text = event.message.text
      sendText(sender, `text echo: ${text.substring(0, 100)}`)
    }
  }
  res.sendStatus(200)
})

function sendText(sender, text) {
  let messageData = {text: text}
  request({
    url:"https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token : token},
    method: "POST",
    json: {
      recipient: {id: sender},
      message: messageData
    }
  }, function(err, response, body){
    if (err) {
      console.log("Error sending message")
    } else if (response.body.error) {
      console.log("response body error")
    }
  })
}

// Listen to server

app.listen(port, function(){
  console.log(`listening to ${port}`)
})
