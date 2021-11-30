let endpointAxios = "https://adminloja.webstore.net.br";
let etapa_atual = null;
try { etapa_atual = localStorage.etapa; } catch (e) { console.log(e) };
const variaveis = new ConjuntoVariaveis();
function esvaziandoElemento(...elementos){
	elementos.forEach((elm)=>{
		elm.innerHTML = ''
		console.log('foi limpo!')
	})
};

function escondendoElemento(...elementos){
	elementos.forEach((elm)=>{
		elm.style.display = 'none';
		console.log('foi escondido!')
	})
};

function botaoparaAvancar(elemento){
	elemento.innerHTML = 'Avançar'
};

function mostraElemento(...elementos){
	elementos.forEach((elm)=>{
		elm.style.display = 'block';
	})
};

window.onload =	function () {

		try {

			let url = window.location.href;
			if (url.indexOf("clear_login") >= 0) {
				storage.clear();
            }

			escondendoElemento(variaveis.pinMfa);

			!etapa_atual && etapa_atual == "1" ? NomeDominio() : console.log()
			// if (!etapa_atual && etapa_atual == "1") {
			// 	etapa_1();
			// }

			if (etapa_atual == '2') {
				VerificandoDominio();
			} else {
				try { localStorage.setItem("etapa", 1); } catch (e) { console.log(e) }
				document.querySelector('#input_nome_loja').focus();
			}

			document.querySelector("input").setAttribute('autocomplete', 'off');

			document.querySelector("input").addEventListener('keyup', function (event) {
				if (event.key == 13) {
					if (document.querySelector(this).getAttribute('id') == 'input_login_loja') {
						document.querySelector('#input_senha_loja').focus();
					} else {
						avancar();
					}
				}
			})

			document.querySelector('#input_nome_loja').addEventListener('keyup', function () {

				let inputLoja = document.querySelector('#input_nome_loja').value;
				if (inputLoja == '') {
					document.querySelector('#btn_avancar').setAttribute('disabled', true);
				} else {
					document.querySelector('#btn_avancar').removeAttribute('disabled');
				}
			})

			document.querySelector("input").setAttribute('autocomplete', 'off');

			document.querySelector('#btn_avancar').addEventListener('click', avancar);

			document.querySelector('#trocar_loja').addEventListener('click', NomeDominio);

			let urlGetDados = window.location.href;
			if (urlGetDados.indexOf("logar-") >= 0) {
				let dados = urlGetDados.split("logar-")[1].split("|");
				document.querySelector('#input_nome_loja').value = dados[0];
				document.querySelector('#input_login_loja').value = dados[1];
				document.querySelector('#btn_avancar').removeAttribute('disabled');
				document.querySelector('#btn_avancar').click();
				document.querySelector("#input_senha_loja").focus();
			}	
			clickGoogle()
		} catch (err) {
			alert(err.message);
		}

};

function avancar() {
	console.log("etapa_atual:" + etapa_atual);
	switch (etapa_atual) {
		case '1':
			VerificandoDominio();
			break;
		case '2':
			EmailSenha();
			break;
		case 'lembrar':
			lembrarSenha();
			break;
		default:
			NomeDominio();
			break;
	}
};

function NomeDominio() {
	document.querySelector('#btn_avancar').setAttribute('disabled', true);

	esvaziandoElemento(variaveis.mostraMsg, variaveis.erros, variaveis.suaLojaSpan);
	botaoparaAvancar(variaveis.botaoAvancar);
	mostraElemento(variaveis.nomeLoja);
	escondendoElemento(variaveis.trocarLoja, variaveis.loginLoja, variaveis.senhaLoja, variaveis.suaLoja, variaveis.linkForget, variaveis.botaoGoogle, variaveis.pinMfa);

	let inputNomeLoja = document.querySelector('#input_nome_loja');
	inputNomeLoja.value = '';
	inputNomeLoja.focus();

	try {
		localStorage.removeItem("nome_loja");
		localStorage.setItem("etapa", '1');
	} catch (e) { }
	etapa_atual = '1';


};

let nome_loja = "";
let lvID = "";
function VerificandoDominio() {

	console.log("VerificandoDominio iniciada");
	esvaziandoElemento(variaveis.erros);
	escondendoElemento(variaveis.linkBack, variaveis.botaoGoogle);
	botaoparaAvancar(variaveis.botaoAvancar);

	try {
		if (document.querySelector('#input_nome_loja').value == "" && localStorage.nome_loja) {
			nome_loja = localStorage.nome_loja;
			document.querySelector('#input_nome_loja').value = nome_loja;
		} else {
			nome_loja = document.querySelector('#input_nome_loja').value;
		}
	} catch (e) { 
		console.log(e)
		nome_loja = docuemnt.querySelector('#input_nome_loja').value = ''.trim(); }

	console.log(nome_loja)		
	nome_loja = nome_loja.toLowerCase();

	let nomeLOJAsend = nome_loja.replace(".", "_ponto_").replace(".", "_ponto_").replace(".", "_ponto_").replace(".", "_ponto_").replace(".", "_ponto_").replace(".", "_ponto_").replace(".", "_ponto_");
	nomeLOJAsend = nome_loja.replace("www.", "").replace("http://", "").replace("https://", "");

	console.log("nome_loja:" + nome_loja);

	if (nome_loja == '') {

		console.log("Nome obrigatório");
		document.querySelector('#nome_loja .errors').innerHTML = 'Campo obrigatório';
		etapa_atual = "1";
		return;

	} else {
		let data = new FormData();
		data.append('tipo', "verificaDominio");
		data.append('loja', nomeLOJAsend);

		console.log(data)


		let config = {
		  method: 'post',
		  url: endpointAxios + '/painel/login/ajax/login.aspx',
		  data : data
		};

		funcLoading(true);
		document.querySelector("#ShowMsg").innerHTML = "";
		lvID = "";
		
		axios(config)
		.then(function (response) {
		  return response.data;
		}).then((data)=>{
			if(data.indexOf("SUCESSO:") >= 0) {	
			console.log('deu certo!' + data);
			lvID = data.split(':')[1];
			limpandoConfigurando();
			} else {
			document.querySelector("#ShowMsg").innerHTML = data.replace(/['"]+/g, '');
			localStorage.removeItem("nome_loja");
			localStorage.removeItem("etapa");
			etapa_atual = "1";
			funcLoading(false);
			}; 
		})
}	

};

function limpandoConfigurando() {

	try {
		funcLoading(false);
		escondendoElemento(variaveis.nomeLoja)
		mostraElemento(variaveis.suaLoja, variaveis.linkForget, variaveis.trocarLoja, variaveis.loginLoja, variaveis.senhaLoja, variaveis.botaoGoogle)

		document.querySelector('#input_login_loja').focus();

		try {
			localStorage.setItem("nome_loja", nome_loja);
			localStorage.setItem("etapa", '2');
		} catch (e) { }
		etapa_atual = '2';

		document.querySelector('#sua_loja span').innerHTML = nome_loja;

		document.querySelector('#btn_avancar').removeAttribute('disabled');

	} catch (e) { alert(e) }

};

function onSignIn(googleUser) {
	let profile = googleUser.getBasicProfile();
	let id_token = googleUser.getAuthResponse().id_token;
	let dados = {
	  Id: profile.getId(),
	  Name: profile.getName(),
	  Image: profile.getImageUrl(),
	  Email: profile.getEmail(),
	};
	console.log('dasdasasddasasdds' + dados)
	console.log("ID Token: " + id_token);

	document.querySelector("#input_login_loja").value = dados.Email
	
	document.querySelector("#input_login_loja").value = JSON.stringify(dados.Email);

	EmailSenha(true, id_token, 'google');

	// var xhr = new XMLHttpRequest();
	// xhr.open("POST", "/google/tokensignin");
	// xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	// xhr.onload = function () {
	//   if (xhr.responseText == 'sucess') {
	// 	alert('Válido')
	//   } else {
	// 	alert('Inválido')
	//   }
	// };
	// xhr.send("idtoken=" + id_token + '&clientid=' + '863561537270-jhvt2k5a6ifsted8dh5j5gmi5tgca7ec.apps.googleusercontent.com');
};

function clickGoogle() {
	console.log('Funcionando botão google')
	let botaoGoogle = document.querySelector("#botaoGoogle");
	botaoGoogle.onclick = function clicando() {
	  document.querySelector(".abcRioButtonContentWrapper").click();
	};
};

function EmailSenha(nopass, socialtoken, socialtype) {
	esvaziandoElemento(variaveis.erros)
	if (etapa_atual == '2') {

		if (document.querySelector('#input_login_loja').value == '') {
			document.querySelector('#login_loja .errors').innerHTML = 'Campo obrigatório';
			return;
		};

		if (document.querySelector('#input_senha_loja').value == '' && !nopass) {
			document.querySelector('#senha_loja .errors').innerHTML = 'Campo obrigatório';
			return;
		};
		
		var loja = lvID;
		var login = document.querySelector('#input_login_loja').value.trim();
		var senha = document.querySelector('#input_senha_loja').value.trim();
		var pin = document.querySelector('#input_pin_mfa').value.trim();
		var plus = "";
		var urlPage = document.location.href;

		if (urlPage.indexOf("appauthtype=") >= 0) {
			plus = "&appauthtype=" + urlPage.split("appauthtype=")[1];
		};


		if (loja == "" || loja == undefined || loja == null) {
			VerificandoDominio(); return false;
        };

		senha = TrataDescricoesEnviar(senha);
		//alert(senha);
			let dataenviadados = new FormData();
			dataenviadados.append('tipo', 'verificaLogin');
			dataenviadados.append('loja', loja);
			dataenviadados.append('login', login);
			dataenviadados.append('senha', senha);
			dataenviadados.append('pin', pin);
			dataenviadados.append('socialtype', socialtype);
			dataenviadados.append('socialtoken', socialtoken);


			let config = {
				method: 'POST',
				url: endpointAxios + "/painel/login/ajax/login.aspx",
				data : dataenviadados 
			};

			funcLoading(true);
			document.querySelector("#ShowMsg").innerHTML = "";

			axios(config).then((response)=>{
				console.log('resultado' + JSON.stringify(response))
				return response.data
			}).then((data)=>{
				if (data.indexOf("SUCESSO") >= 0) {
					url = data.replace("SUCESSO:", "");
					document.location.href = endpointAxios + url + plus;
				}
					else if (data.indexOf("MFA") >= 0) {
	
						escondendoElemento(variaveis.loginLoja, variaveis.senhaLoja)
						mostraElemento(variaveis.pinMfa)
						document.querySelector('#input_pin_mfa').focus();
						funcLoading(false);
																													
					} else {
	
						document.querySelector("#ShowMsg").innerHTML = data.replace(/['"]+/g, '');
						funcLoading(false);
	
					}
			})
	}
};

let loja = "";
let usuario = "";
function lembrarSenha() {

	if (etapa_atual != 'lembrar') {

		try { localStorage.setItem("etapa", 'lembrar'); } catch (e) { }
		etapa_atual = 'lembrar';

		esvaziandoElemento(variaveis.erros);
		escondendoElemento(variaveis.senhaLoja, variaveis.linkForget, variaveis.botaoGoogle);
		mostraElemento(variaveis.linkBack);
		document.querySelector('#btn_avancar').innerHTML = 'Lembrar Senha';

	} else {

		try { loja = localStorage.nome_loja; } catch (e) { }
		usuario = document.querySelector('#input_login_loja').value.trim();

		if (usuario == '') {

			document.querySelector('#login_loja .errors').innerHTML = 'Campo obrigatório';
			return;

		} else {
			console.log('ID -----------------' + lvID)
			console.log('usuario -----------------' + usuario)
			let datalembrarsenha = new FormData();
			datalembrarsenha.append('lojaid', lvID)
			datalembrarsenha.append('usuario', usuario)

			console.log('data lembrar senha' + data)

			let myheaderslembrarsenha = new Headers();
			myheaderslembrarsenha.append("Cookie", "ASP.NET_SessionId=z5ymksyhexjim4gybd2zx0uy");

			let config = {
				method: 'GET',
				url: endpointAxios + "/painel/ESQUECI_SENHA.aspx",
				headers: myheaderslembrarsenha,
				data: datalembrarsenha
			}

			document.querySelector("#ShowMsg").innerHTML = "";
			funcLoading(true);

			axios(config).then((response)=>{
				console.log('resposta lembrar senha' + response.data)
				return response.data
			}).then((data)=>{
				funcLoading(false);

				VerificandoDominio();

				document.querySelector("#ShowMsg").innerHTML = data;

			}).catch((erro)=>{
				document.querySelector("#ShowMsg").innerHTML = "Não foi possível enviar sua senha, tente novamente." + erro;

				funcLoading(false);
			})
		}
	}

};

function funcLoading(tipo) {

	if (tipo) {
		document.querySelector("#loading").style.display = 'block';
		document.querySelector("#btn_avancar").style.display = 'none'
		document.querySelector("[data-tipo-campo='links-down']").style.display = 'none';
	} else {
		document.querySelector("#loading").style.display = 'none';
		document.querySelector("#btn_avancar").style.display = 'block';
		document.querySelector("[data-tipo-campo='links-down']").style.display = 'block';
	}

};

function TrataDescricoesEnviar(Valor) {

	while (Valor.indexOf("&") >= 0) {
		Valor = Valor.replace("&", "__ECOM__");
	}

	while (Valor.indexOf("+") >= 0) {
		Valor = Valor.replace("+", "__cMAIS__");
	}

	while (Valor.indexOf(".") >= 0) {
		Valor = Valor.replace(".", "__cPONTO__");
	}

	while (Valor.indexOf(" ") >= 0) {
		Valor = Valor.replace(" ", "__cESPACO__");
	}

	while (Valor.indexOf("/") >= 0) {
		Valor = Valor.replace("/", "__BARRA__");
	}

	while (Valor.indexOf(/"\"/) >= 0) {
		Valor = Valor.replace(/"\"/, "__BARRA2__");
	}

	while (Valor.indexOf('"') >= 0) {
		Valor = Valor.replace('"', "__ASPAS__");
	}

	while (Valor.indexOf("'") >= 0) {
		Valor = Valor.replace("'", "__ASPAS2__");
	}

	while (Valor.indexOf("´") >= 0) {
		Valor = Valor.replace("´", "__ASPAS3__");
	}

	while (Valor.indexOf("<") >= 0) {
		Valor = Valor.replace("<", "__MENOR__");
	}

	while (Valor.indexOf(">") >= 0) {
		Valor = Valor.replace(">", "__MAIOR__");
	}

	while (Valor.indexOf("\r") >= 0) {
		Valor = Valor.replace("\r", "__R__");
	}

	while (Valor.indexOf("\n") >= 0) {
		Valor = Valor.replace("\n", "__N__");
	}

	while (Valor.indexOf("=") >= 0) {
		Valor = Valor.replace("=", "__IGUAL__");
	}

	while (Valor.indexOf("@") >= 0) {
		Valor = Valor.replace("@", "__ARROBA__");
	}

	while (Valor.indexOf("*") >= 0) {
		Valor = Valor.replace("*", "__ASTERISCO__");
	}

	while (Valor.indexOf("?") >= 0) {
		Valor = Valor.replace("?", "__INTERROGA__");
	}

	while (Valor.indexOf("#") >= 0) {
		Valor = Valor.replace("#", "__HASH__");
	}

	while (Valor.indexOf("$") >= 0) {
		Valor = Valor.replace("$", "__MONEY__");
	}

	while (Valor.indexOf("%") >= 0) {
		Valor = Valor.replace("%", "__PORCENT__");
	}

	while (Valor.indexOf("!") >= 0) {
		Valor = Valor.replace("!", "__EXCLAMA__");
	}

	return Valor;

};
