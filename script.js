const API_URL = "COLE_AQUI_SEU_APPS_SCRIPT";

async function carregarDados(){

try{

const response =
await fetch(API_URL);

const data =
await response.json();

document.getElementById("membros").innerText =
data.estatisticas.membros;

document.getElementById("congregados").innerText =
data.estatisticas.congregados;

document.getElementById("batizados").innerText =
data.estatisticas.batizados;

document.getElementById("visitantes").innerText =
data.estatisticas.visitantes;

}catch(error){

console.log(error);

}

}

carregarDados();
