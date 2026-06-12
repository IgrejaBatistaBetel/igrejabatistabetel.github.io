const API_URL = "https://script.google.com/macros/s/AKfycbwSyP1LWxMeaOAGGsyy8mKW_a1LmLzZzINz8Zp5vc-z0pkLk0g0D7r0eJbwS5jBXTp7EA/exec";

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
