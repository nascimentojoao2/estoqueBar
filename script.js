let estoque = JSON.parse(localStorage.getItem("estoqueBar")) || [];
let historico = JSON.parse(localStorage.getItem("historicoBar")) || [];

function salvarDados() {
  localStorage.setItem("estoqueBar", JSON.stringify(estoque));
  localStorage.setItem("historicoBar", JSON.stringify(historico));
  listarEstoque();
  listarHistorico();
}

function adicionarProduto() {
  const nome = document.getElementById("nome").value.trim();
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const tipo = document.getElementById("tipo").value;

  if (nome && quantidade > 0) {
    const existente = estoque.find(p => p.nome.toLowerCase() === nome.toLowerCase());
    if (existente) {
      existente.quantidade += quantidade;
    } else {
      estoque.push({ nome, quantidade, tipo });
    }
    historico.unshift({ acao: 'Entrada', nome, quantidade, data: new Date().toLocaleString() });
    salvarDados();
    document.getElementById("nome").value = '';
    document.getElementById("quantidade").value = '';
  }
}

function removerProduto(nome) {
  const quantidade = prompt(`Quantas unidades de "${nome}" deseja remover?`);
  const qnt = parseInt(quantidade);
  if (!qnt || qnt <= 0) return;

  const produto = estoque.find(p => p.nome === nome);
  if (produto) {
    produto.quantidade -= qnt;
    if (produto.quantidade <= 0) {
      estoque = estoque.filter(p => p.nome !== nome);
    }
    historico.unshift({ acao: 'Saída', nome, quantidade: qnt, data: new Date().toLocaleString() });
    salvarDados();
  }
}

function listarEstoque() {
  const lista = document.getElementById("listaEstoque");
  const filtro = document.getElementById("filtroTipo").value;
  lista.innerHTML = '';
  estoque.forEach(p => {
    if (!filtro || p.tipo === filtro) {
      const li = document.createElement("li");
      li.innerHTML = `${p.nome} (${p.tipo}) - ${p.quantidade} unidades 
        ${p.quantidade <= 5 ? '<strong style="color:red;">[Baixo Estoque]</strong>' : ''}
        <button onclick="removerProduto('${p.nome}')">Retirar</button>`;
      lista.appendChild(li);
    }
  });
}

function listarHistorico() {
  const lista = document.getElementById("historico");
  lista.innerHTML = '';
  historico.slice(0, 20).forEach(h => {
    const li = document.createElement("li");
    li.textContent = `[${h.data}] ${h.acao} de ${h.quantidade} unidade(s) - ${h.nome}`;
    lista.appendChild(li);
  });
}

function exportarEstoque() {
  let conteudo = 'Estoque do Bar:\n\n';
  estoque.forEach(p => {
    conteudo += `${p.nome} (${p.tipo}): ${p.quantidade} unidade(s)\n`;
  });

  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "estoque_bar.txt";
  a.click();
}

listarEstoque();
listarHistorico();
