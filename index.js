'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const async = require('async')
const fs = require('fs')

const app = express()

app.set('port', (process.env.PORT || 3000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

var port = app.get("port")

var token = process.env.FB_TOKEN
// Routes

app.get('/', function(req, res){
  res.send("Hi I am bot!!!!!!!!")
})

// Facebook

app.get('/webhook/', function(req, res){
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) { // if /webook/?hub.verify_token=yuyaaaar　的な。GET REQUEST送る時にquery paramsにverify_tokenが合っていたら
    res.send(req.query['hub.challenge'])
  }
  res.sendStatus(400)
})

app.post('/webhook/', function(req, res){
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    let event = messaging_events[i]
    let sender = event.sender.id
    if (event.message) {
      if (event.message.text) {
        let text = event.message.text
        if (text.toLowerCase().substring(0, 4) === "wiki") {
          initWiki(sender, text.replace("wiki ", ""))
        } else {
        setTypingIndicator(sender)
        setTimeout(function(){
          sendText(sender, `voice echo: ${text}`)
        }, 2000)
      }
      }
      if (event.message.attachments) {
        let attachments = event.message.attachments
        attachments.forEach(function(attachment){
          let url = attachment.payload.url
          sendImage(sender, url)
        })
      }
    }
  }
  res.sendStatus(200)
})

function initWiki(sender, query) {
      request({
        url:"https://en.wikipedia.org/w/api.php?",
        qs: {
          action: "opensearch",
          format: "json",
          search: query
        },
        method:"GET"
      }, (err, response, body) => {
        if (err) {
          console.error(`error occurred: ${err}`)
          return
        }
        let wikiRes = JSON.parse(body) // JSON.parse(body) typeof Array // true
        sendGenericMessage(sender, wikiRes)
      })
  }


function sendText(sender, text) {  // bot to sender
  let messageData = {text: text}
  sendMessengerAPI(messageData, sender)
}

function sendGenericMessage(sender, res) {
  sendText(sender, `searching for ${res[0]}...`)
  let messageData =
    {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: []
        }
      }
    }
  for (let i = 0, length = res[1].length; i < length; i++) {
    let boilerplate = {
      title: res[1][i],
      subtitle: res[2][i],
      buttons: [{
        type: "web_url",
        url: res[3][i],
        title: "Open Web URL"
      }]
    }
    messageData.attachment.payload.elements.push(boilerplate)
  }
  sendMessengerAPI(messageData, sender)
}

function sendImage(sender, url) {
  let messageData = {
    "attachment":{
      "type":"image",
      "payload":{
        "url":url
      }
    }
  }
  sendMessengerAPI(messageData, sender)
}
function setTypingIndicator(sender) {
  request({
    url:"https://graph.facebook.com/v2.6/me/messages",
    qs: {access_token : token},
    method: "POST",
    json: {
      recipient: {id: sender},
      sender_action: "typing_on"
    }
  }, function(err, response, body){
    if (err) {
      console.log("Error sending message")
    } else if (response.body.error) {
      console.log("response body error", response.body)
    }
  })
}
function sendMessengerAPI(messageData, sender) {
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
      console.log("response body error", response.body)
    }
  })
}

// Listen to server

app.listen(port, function(){
  console.log(`listening to ${port}`)
})
