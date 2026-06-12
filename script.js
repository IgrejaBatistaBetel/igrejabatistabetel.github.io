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

/* AVISOS */

const avisosContainer =
document.getElementById("avisos-container");

avisosContainer.innerHTML = "";

data.avisos.forEach(aviso => {

avisosContainer.innerHTML += `
<div class="card">
<strong>${aviso.titulo}</strong>
<br>
${aviso.data}
</div>
`;

});

}catch(error){

console.error(error);

}

}

carregarDados();
});
