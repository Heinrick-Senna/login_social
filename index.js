const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const fs = require('fs');
const http = require('http');
const https = require('https');
const bodyParser = require('body-parser')
const nets = require('os').networkInterfaces()
const credentials = {}

const {OAuth2Client} = require('google-auth-library');

// Certificate
if (process.argv[2] == undefined || process.argv[2] != '-dev') {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/server-login-social-ws.webstore.net.br/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/server-login-social-ws.webstore.net.br/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/server-login-social-ws.webstore.net.br/chain.pem', 'utf8');
  
  credentials['key'] = privateKey
  credentials['cert'] = certificate
  credentials['ca'] = ca
}

const app = express()
app.use(express.static(__dirname, { dotfiles: 'allow' } ));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

// Include Routas
app.get('/google', (req, res) => {
  res.render('loginGoogle', {dados: req.body})
})

app.get('/loginGoogle', (req, res)=> {
    res.render('mainLogin');
})

app.post('/google/tokensignin', async (req, res) => {
  try {
    const token = req.body.idtoken, CLIENT_ID = req.body.clientid
    const client = new OAuth2Client(CLIENT_ID);
    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      // If request specified a G Suite domain:
      // const domain = payload['hd'];
    }
    
    await verify()

    res.send('sucess')
  } catch (err) {
    console.log(err.message)
    res.send('err')
  }
})

app.get('/facebook', (req, res) => {
  res.render('loginFacebook', {dados: req.body})
})

app.get('/privacidade', (req, res) => {
  res.render('privacidade')
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

  const httpsServer = https.createServer(credentials, app);

  httpsServer.listen(443, console.log('HTTPS Server running on port 443'))
} else {
  const httpServer = http.createServer(app);

  httpServer.listen(3000, console.log(`HTTP Server running on http://${nets['Ethernet'][1].address}:3000`))
}
