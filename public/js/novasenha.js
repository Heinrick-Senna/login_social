var etapa_atual = localStorage.etapa;

$(document).ready(

	function () {

		try {



		} catch (e) {

			alert(e.message);

		}

	}

);

function ValidaCampos() {

	__doPostBack("BT_login_entrar", "");

}