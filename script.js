const API_URL = "https://script.google.com/macros/s/AKfycbzYpL9ixNvK2WD_g34ob3F9P9TBSUTPQaEDxZC-0_rn78xi-sRFRcO9mwRjC9PX0Jp7lg/exec";

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
