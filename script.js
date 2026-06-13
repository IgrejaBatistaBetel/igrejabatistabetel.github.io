const API_URL = "https://script.google.com/macros/s/AKfycbwAZp1ylMke-_xptIHcwgWYG5QyGHfX9qIDoGb6w-Sb-TgluzulAGEHbSTmmK3Glx3w/exec";

async function carregarDados() {

  try {

    const response = await fetch(API_URL);
    const data = await response.json();

    console.log(data);

    // =========================
    // ESTATÍSTICAS
    // =========================
    document.getElementById("membros").innerText =
      data.estatisticas?.membros ?? 0;

    document.getElementById("congregados").innerText =
      data.estatisticas?.congregados ?? 0;

    document.getElementById("batizados").innerText =
      data.estatisticas?.batizados ?? 0;


    // =========================
    // AVISOS
    // =========================
    const avisosContainer = document.getElementById("avisos-container");

    if (avisosContainer && Array.isArray(data.avisos)) {

      let htmlAvisos = "";

      data.avisos.forEach(aviso => {
        htmlAvisos += `
          <div class="card">
            <strong>${aviso.titulo}</strong><br>
            ${formatarData(aviso.data)}
          </div>
        `;
      });

      avisosContainer.innerHTML = htmlAvisos;
    }


    // =========================
    // AGENDA
    // =========================
    const agendaContainer = document.getElementById("agenda-container");

    if (agendaContainer && Array.isArray(data.agenda)) {

      let htmlAgenda = "";

      data.agenda.forEach(item => {
        htmlAgenda += `
          <div class="card">
            <strong>${item.evento}</strong><br>
            ${item.dia} • ${item.hora}
          </div>
        `;
      });

      agendaContainer.innerHTML = htmlAgenda;
    }

  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}


// =========================
// UTILITÁRIO DE DATA
// =========================
function formatarData(data) {
  if (!data) return "";

  const d = new Date(data);

  if (isNaN(d.getTime())) return data; // fallback se vier quebrado

  return d.toLocaleDateString("pt-BR");
}


// =========================
// INICIALIZA
// =========================
carregarDados();
