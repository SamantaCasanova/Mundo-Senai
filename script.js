const palavras = [
  "ABRIR", "ACENO", "ADEUS", "AFINS", "AGUDO", "ALETA", "ALVOZ", "AMIDO", "AMPLO",
"ANGEL", "ANTES", "APITO", "AROMA", "ATRAS", "AVISO", "AZULE", "BALDE", "BASTA",
"BATOM", "BEMOS", "BICAR", "BONDE", "BOTAR", "BRISA", "BROTO", "BURRO", "CABOS",
"CAFÉZ", "CAIUS", "CAMPO", "CANIL", "CAPUZ", "CAVAL", "CEDRO", "CEGAR", "CIFRA",
"CIRCO", "CLIMA", "COFRE", "COLAR", "COMER", "CORDA", "CRAVO", "CRUEL", "DANOS",
"DEPOR", "DESCE", "DINHO", "DIZEM", "DORES", "DUROS", "EIXOS", "ENTRE", "ERROS",
"ESCOL", "EXATO", "FAROL", "FENDA", "FICOU", "FIRMA", "FLUIR", "FOLHA", "FUNDO",
"GALHO", "GEMAS", "GLÓRI", "GRITO", "GUETO", "HABIL", "HASTE", "IDEAL", "ÍNDIO",
"INFRA", "INGRE", "INTER", "JOGOS", "JUNTO", "JUSTA", "LAGOS", "LARGO", "LENÇO",
"LIMÃO", "LIVRE", "LOUCO", "LUTAR", "MANSO", "MARCA", "MELHO", "MESMO", "METAL",
"MODOS", "MORRO", "MURAL", "MUSAS", "NAVEG", "NOBRE", "NOMES", "NUDES", "NUNCA",
"OBRAS", "ONDAZ", "OPACO", "ORDEM", "OUVIR", "PAUSA", "PEDIR", "PISTA", "PLENO",
"POETA", "PONTO", "PORTE", "PULSO", "QUEDA", "QUERO", "RAMOS", "RAZÃO", "ROCHA",
"RUINS", "SABIA", "SALTO", "SENHA", "SEREM", "SINAL", "SOBRE", "TALHO", "TESÃO",
"TIPOS", "TORRE", "TRAJE", "TREVO", "TURMA", "UNIAM", "URROS", "VAGAR", "VENTO"
];

const palavraSecreta = palavras[Math.floor(Math.random() * palavras.length)];

let linhaAtual = 0;
let posicaoAtual = 0;
let jogoFinalizado = false;

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const mensagem = document.getElementById("message");

const teclasMap = {};
const blocos = [];

// Criar tabuleiro 6x5
for(let r = 0; r < 6; r++) {
  const linha = document.createElement("div");
  linha.classList.add("row");
  blocos[r] = [];
  for(let c = 0; c < 5; c++) {
    const bloco = document.createElement("div");
    bloco.classList.add("tile");
    linha.appendChild(bloco);
    blocos[r][c] = bloco;
  }
  board.appendChild(linha);
}

// Layout teclado:
// Linha 1: QWERTYUIOP
// Linha 2: ASDFGHJKL ←
// Linha 3: ZXCVBNM ENTER
const layoutTeclado = [
  [..."QWERTYUIOP"],
  [..."ASDFGHJKL", "←"],
  [..."ZXCVBNM", "ENTER"]
];

layoutTeclado.forEach(linha => {
  const linhaDiv = document.createElement("div");
  linhaDiv.classList.add("keyboard-row");
  linha.forEach(tecla => {
    const botao = document.createElement("button");
    botao.textContent = tecla;
    botao.classList.add("key");
    if(tecla === "ENTER" || tecla === "←") botao.classList.add("wide");
    botao.onclick = () => pressionarTecla(tecla);
    teclasMap[tecla] = botao;
    linhaDiv.appendChild(botao);
  });
  keyboard.appendChild(linhaDiv);
});

// Suporte teclado físico
document.addEventListener("keydown", (e) => {
  const key = e.key.toUpperCase();
  if(key === "BACKSPACE") {
    pressionarTecla("←");
  } else if(key === "ENTER") {
    pressionarTecla("ENTER");
  } else if (/^[A-ZÇ]$/.test(key) && key.length === 1) {
    pressionarTecla(key);
  }
});

function pressionarTecla(tecla) {
  if(jogoFinalizado) return;

  if(tecla === "←") {
    if(posicaoAtual > 0) {
      posicaoAtual--;
      blocos[linhaAtual][posicaoAtual].textContent = "";
    }
  } else if(tecla === "ENTER") {
    enviarPalavra();
  } else if (/^[A-ZÇ]$/.test(tecla)) {
    if(posicaoAtual < 5) {
      blocos[linhaAtual][posicaoAtual].textContent = tecla;
      posicaoAtual++;
    }
  }
}

function enviarPalavra() {
  if(posicaoAtual < 5) {
    mensagem.textContent = "Palavra incompleta.";
    return;
  }

  const tentativa = blocos[linhaAtual].map(b => b.textContent).join("");

  // ❗ Impede palavras com todas as letras iguais, como AAAAA ou CCCCC
  if (/^([A-ZÇ])\1{4}$/.test(tentativa)) {
    mensagem.textContent = "Palavra inválida: todas as letras são iguais.";
    return;
  }

  // Verificar se a palavra está na lista para aceitar (opcional, mas você pediu sem)
  // Se quiser ativar, descomente:
  /*
  if(!palavras.includes(tentativa)) {
    mensagem.textContent = "Palavra não existe na lista.";
    return;
  }
  */

  mensagem.textContent = "";

  let segredo = palavraSecreta.split("");
  let resposta = Array(5).fill("absent");
  
  // Primeiro, marcar as letras corretas (verde)
  for(let i=0; i<5; i++) {
    if(tentativa[i] === segredo[i]) {
      resposta[i] = "correct";
      segredo[i] = null; // Marca como usada
    }
  }

  // Depois, marcar letras presentes, mas fora do lugar (amarelo)
  for(let i=0; i<5; i++) {
    if(resposta[i] !== "correct") {
      const index = segredo.indexOf(tentativa[i]);
      if(index !== -1) {
        resposta[i] = "present";
        segredo[index] = null; // Marca como usada
      }
    }
  }

  // Aplicar as cores nas tiles e no teclado
  for(let i=0; i<5; i++) {
    const tile = blocos[linhaAtual][i];
    tile.classList.add(resposta[i]);
    const teclaBotao = teclasMap[tentativa[i]];
    
    // Atualizar teclado com prioridades: correct > present > absent
    if(teclaBotao) {
      if(resposta[i] === "correct") {
        teclaBotao.classList.remove("present", "absent");
        teclaBotao.classList.add("correct");
        teclaBotao.disabled = true;
      } else if(resposta[i] === "present" && !teclaBotao.classList.contains("correct")) {
        teclaBotao.classList.remove("absent");
        teclaBotao.classList.add("present");
        teclaBotao.disabled = true;
      } else if(resposta[i] === "absent" && !teclaBotao.classList.contains("correct") && !teclaBotao.classList.contains("present")) {
        teclaBotao.classList.add("absent");
        teclaBotao.disabled = true;
      }
    }
  }

  if(tentativa === palavraSecreta) {
    mensagem.textContent = "Parabéns! Você acertou!";
    jogoFinalizado = true;
    return;
  }

  linhaAtual++;
  posicaoAtual = 0;

  if(linhaAtual === 6) {
    mensagem.textContent = `Fim de jogo! A palavra era: ${palavraSecreta}`;
    jogoFinalizado = true;
  }
}
