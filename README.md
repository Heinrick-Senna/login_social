<h1>Processo - Marketplace</h1>

# 1- Atualizar servidor
Antes de começar a instalar as dependências é necessário atualizar todos os pacotes do servidor
Use o comando:
```sh
$ sudo yum update
```

# 2- Após atualizar o servidor, instale o node
Use os comandos:
```sh
$ sudo yum install -y gcc-c++ make
$ curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -
$ sudo yum install -y nodejs
```
# 3- Em seguida, instale o git no linux
Use o comando:
```sh
$ sudo yum install git
```
# 4- Agora, clone o repositório para dentro do servidor.
Antes de clonar, crie uma SSH key e adicione a sua conta github.
Para criar uma SSH Key, use o comando abaixo informando o seu email vinculado ao repositório do projeto. 
```sh
$ ssh-keygen -t rsa -b 4096 -C "SEUEMAIL@EMAIL.COM"
$ eval "$(ssh-agent -s)"
$ ssh-add -k /Users/you/.ssh/id_rsa
```
No github, vá em https://github.com/settings/keys e adicione uma nova key colando o conteúdo do arquivo id_rsa.pub que foi criado no passo anterior.

Agora basta clonar o repositório.
Dentro do diretório determinado, use o comando:
```sh
$ git clone "URL DO REPOSITÓRIO"
```
# 5- Entre no repositório e instale todas as dependências do projeto node
Use o comando:
```sh
$ npm install
```
# 6- Execute o projeto e inicie os primeiros testes no servidor
Use o comando um dos três comandos abaixo:
```sh
$ npm start
$ nodemon index.js
$ sudo node index.js
```
# 7- É recomendado instalar PM2.
Com ele, será possível gerenciar os logs, execução do node em tempo real e permissão root para execução da porta 80 e posteriormente do SSL.
No repositório tem um json ( pm2.json ) com as configurações de execução do PM2.
Use o comando:
```sh
$ sudo npm i -g pm2
$ pm2 -v
$ sudo pm2 start pm2.json
```
  
# 8- Por fim instale o SSL usando o Let's Encrypt
Inicialmente é preciso instalar o certbot para emissão do certificado
```sh
$ sudo amazon-linux-extras install epel
$ sudo yum install certbot
```
Agora gere o certificado
```sh
$ sudo certbot certonly --manual
```
Para validar o certificado, você precisa criar um novo arquivo no repositório \.well-known\acme-challenge.
O nome do arquivo é informado na etapa anterior.
Para que o serviço consiga acessar o arquivo criado. Você precisará adicionar um linha no index.js do projeto.
```JS
app.use(express.static(__dirname, { dotfiles: 'allow' } ));
```
Podendo ser acessado http://dominiodoprojeto.com.br/.well-known/acme-challenge/NOVOARQUIVO


## Após validação, prepare o projeto para rodar HTTPS
Veja o exemplo abaixo. Compare e ajuste seu arquivo index.js.

```JS
// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const app = express();

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/dominiodoprojeto.com.br/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/dominiodoprojeto.com.br/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/dominiodoprojeto.com.br/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

app.use((req, res) => {
	res.send('Hello there !');
});

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});
```
## Agora é preciso automatizar o processo de renovação o certificado.
```sh
$ sudo crontab -e
```

Copie e cole a linha abaixo:
```sh
0 1,12 * * * python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew
```

# Pronto, temos um projeto rodando

