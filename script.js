const API_URL = "https://script.google.com/macros/s/AKfycbwAZp1ylMke-_xptIHcwgWYG5QyGHfX9qIDoGb6w-Sb-TgluzulAGEHbSTmmK3Glx3w/exec";

async function carregarDados() {

  try {

    const response = await fetch(API_URL);
    const data = await response.json();

    console.log(data);

    document.getElementById("membros").innerText =
      data.estatisticas.membros;

    document.getElementById("congregados").innerText =
      data.estatisticas.congregados;

    document.getElementById("batizados").innerText =
      data.estatisticas.batizados;

    const avisosContainer =
      document.getElementById("avisos-container");

    if (avisosContainer && data.avisos) {

      avisosContainer.innerHTML = "";

      data.avisos.forEach(aviso => {

        avisosContainer.innerHTML += `
          <div class="card">
            <strong>${aviso.titulo}</strong><br>
            ${new Date(aviso.data).toLocaleDateString("pt-BR")}
          </div>
        `;

const agendaContainer =
  document.getElementById("agenda-container");

if (agendaContainer && data.agenda) {

  agendaContainer.innerHTML = "";

  data.agenda.forEach(item => {

    agendaContainer.innerHTML += `
      <div class="card">
        <strong>${item.evento}</strong><br>
        ${item.dia} • ${item.hora}
      </div>
    `;

  });

}  
    
  } catch (error) {

    console.error(error);

  }

}

carregarDados();
