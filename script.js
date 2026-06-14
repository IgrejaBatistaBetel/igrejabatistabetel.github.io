const API_URL = "https://script.google.com/macros/s/AKfycbzpcnCO3S3JUi-1ti8qYI-IzXCR8wVvJOeKNz1JGHPQntZu7l1skEAth4ZKcKA5gIXe/exec";

// =========================
// CARREGAR DADOS
// =========================
async function carregarDados() {

  try {

    const response = await fetch(
      API_URL + "?nocache=" + Date.now()
    );

    const data = await response.json();

    console.log("DADOS API:", data);

    // =========================
    // ESTATÍSTICAS
    // =========================
    atualizarTexto(
      "membros",
      data.estatisticas?.membros
    );

    atualizarTexto(
      "congregados",
      data.estatisticas?.congregados
    );

    atualizarTexto(
      "batizados",
      data.estatisticas?.batizados
    );

    // =========================
    // AVISOS
    // =========================
    renderLista(
      "avisos-container",
      data.avisos,
      (aviso) => `
        <div class="card">
          <strong>${aviso.titulo}</strong><br>
          📅 ${formatarData(aviso.data)}
          ${aviso.hora ? `<br>🕒 ${aviso.hora}` : ""}
        </div>
      `
    );

    // =========================
    // AGENDA
    // =========================
    renderLista(
      "agenda-container",
      data.agenda,
      (item) => `
        <div class="card">
          <strong>${item.evento}</strong><br>
          📅 ${item.dia}
          ${item.hora ? `<br>🕒 ${item.hora}` : ""}
        </div>
      `
    );

    // =========================
    // ESCALA SEMANAL
    // =========================
    const escalaContainer =
      document.getElementById("escala-container");

    if (
      escalaContainer &&
      Array.isArray(data.escala)
    ) {

      const grupos = {};

      data.escala.forEach(item => {

        if (!grupos[item.dia]) {
          grupos[item.dia] = [];
        }

        grupos[item.dia].push(item);

      });

      let htmlEscala = "";

      Object.keys(grupos).forEach(dia => {

        htmlEscala += `
          <div class="card escala-card">

            <h3>📅 ${dia}</h3>

            ${grupos[dia]
              .map(item => `
                <p>
                  <strong>${item.funcao}:</strong>
                  ${item.responsavel}
                </p>
              `)
              .join("")}

          </div>
        `;

      });

      escalaContainer.innerHTML = htmlEscala;

    }

    // =========================
    // SOBRE NÓS
    // =========================
    renderLista(
      "sobre-container",
      data.sobreNos,
      (item) => `
        <div class="card">
          <h3>${item.titulo}</h3>
          <p>${item.conteudo}</p>
        </div>
      `
    );

    // =========================
    // VERSÍCULO
    // =========================
    const versiculo =
      document.getElementById("versiculo");

    if (versiculo && data.versiculo) {

      versiculo.style.opacity = 0;

      setTimeout(() => {

        versiculo.innerText =
          data.versiculo;

        versiculo.style.transition =
          "opacity .6s ease";

        versiculo.style.opacity = 1;

      }, 200);

    }

  } catch (error) {

    console.error(
      "Erro ao carregar dados:",
      error
    );

  }

}

// =========================
// ENVIO DE ORAÇÃO
// =========================
const form =
  document.getElementById("oracaoForm");

if (form) {

  form.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const nome =
        document.getElementById("nome")
          .value
          .trim();

      const pedido =
        document.getElementById("pedido")
          .value
          .trim();

      if (!nome || !pedido) {

        alert(
          "Preencha todos os campos 🙏"
        );

        return;

      }

      try {

        const response =
          await fetch(API_URL, {

            method: "POST",

            body: JSON.stringify({
              nome,
              pedido
            })

          });

        const texto =
          await response.text();

        console.log(
          "Resposta bruta:",
          texto
        );

        const result =
          JSON.parse(texto);

        if (
          result.status === "ok"
        ) {

          alert(
            "🙏 Pedido enviado com sucesso!"
          );

          form.reset();

        } else {

          alert(
            result.message ||
            "Não foi possível enviar."
          );

        }

      } catch (error) {

        console.error(
          "Erro ao enviar oração:",
          error
        );

        alert(
          "😢 Erro ao enviar pedido."
        );

      }

    }

  );

}

// =========================
// INSTALAR APP (PWA)
// =========================
let deferredPrompt;

const installBtn =
  document.getElementById(
    "installBtn"
  );

window.addEventListener(
  "beforeinstallprompt",
  (e) => {

    e.preventDefault();

    deferredPrompt = e;

    if (installBtn) {

      installBtn.style.display =
        "inline-block";

    }

  }
);

if (installBtn) {

  installBtn.addEventListener(
    "click",
    async () => {

      if (!deferredPrompt)
        return;

      deferredPrompt.prompt();

      const {
        outcome
      } =
      await deferredPrompt.userChoice;

      console.log(
        "Instalação:",
        outcome
      );

      deferredPrompt = null;

      installBtn.style.display =
        "none";

    }
  );

}

window.addEventListener(
  "appinstalled",
  () => {

    alert(
      "📱 Aplicativo instalado com sucesso!"
    );

    console.log(
      "BBNJ instalada!"
    );

    if (installBtn) {

      installBtn.style.display =
        "none";

    }

  }
);

// =========================
// FUNÇÕES AUXILIARES
// =========================
function atualizarTexto(
  id,
  valor
) {

  const el =
    document.getElementById(id);

  if (el) {

    el.innerText =
      valor ?? 0;

  }

}

function renderLista(
  containerId,
  lista,
  templateFn
) {

  const container =
    document.getElementById(
      containerId
    );

  if (
    !container ||
    !Array.isArray(lista)
  ) {
    return;
  }

  container.innerHTML = "";

  lista.forEach(
    (item, index) => {

      const wrapper =
        document.createElement(
          "div"
        );

      wrapper.innerHTML =
        templateFn(item);

      const element =
        wrapper.firstElementChild;

      if (element) {

        element.style.animationDelay =
          (index * 0.08) + "s";

        container.appendChild(
          element
        );

      }

    }
  );

}

function formatarData(
  data
) {

  if (!data)
    return "";

  const d =
    new Date(data);

  if (
    isNaN(
      d.getTime()
    )
  ) {
    return data;
  }

  return d.toLocaleDateString(
    "pt-BR"
  );

}

// =========================
// AUTO ATUALIZAÇÃO
// =========================
setInterval(() => {

  carregarDados();

}, 300000);

// =========================
// INICIAR SITE
// =========================
carregarDados();
