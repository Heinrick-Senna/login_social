const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser')
const nets = require('os').networkInterfaces()

/* Global Variables */
global.axios 	  = require('axios')
global.baseurl 	= 'https://ENDPOINT-PARCEIRO'
if (process.argv[2] == undefined || process.argv[2] != '-dev') {
  global.host 	  = 'https://ENDPOINT-DA-PRÓPRIA-APLICAÇÃO'
} else {
  global.host 	  = `http://${nets['Ethernet'][1].address}:3000/`
}

const app = express()
app.use(express.static(__dirname, { dotfiles: 'allow' } ));
app.set('view engine', 'ejs');
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Include Routas
app.get('/google', (req, res) => {
  res.render('loginGoogle', {dados: req.body})
})

app.get('/facebook', (req, res) => {
  res.render('loginFacebook', {dados: req.body})
})

app.get('/apple', (req, res) => {
  res.render('loginApple', {dados: req.body})
})

app.use((error, req, res, next) => {
  return res.status(400).json({'sucesso': false, 'mensagem': error.toString() });
});

// Starting both http & https servers
if (process.argv[2] == undefined || process.argv[2] != '-dev') {
  const httpServer = http.createServer(app);

  httpServer.listen(80, console.log('HTTP Server running on port 80'))
} else {
  const httpServer = http.createServer(app);

  httpServer.listen(3000, console.log(`HTTP Server running on http://${nets['Ethernet'][1].address}:3000`))
}