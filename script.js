// script.js
// Variáveis globais
let sabeCustoUnitario = false;
let custoGeral = 0;
let unicaSafra = true;


let produtos = {
    "alface": {
        nome: "Alface",
        imagem: "Imagens/ALFACE - Ghibi.png",
        unidade: "un",

    },
    "tomate": {
        nome: "Tomate",
        imagem: "Imagens/tomate.jpg",
        unidade: "kg",
    },
    // ... outros produtos
};


// Custos por serviço (com imagens)
const custosServicos = {
    "insumos": {
        nome: "Custos Insumos<br>R$",
        imagem: "Imagens/MUDAS & SEMENTES - Ghibi.png", // Substitua pelas suas imagens
    },
    "producao": {
        nome: "Custos Produção<br>R$",
        imagem: "Imagens/Custo com água.png",
    },
    "infraestrutura": {
        nome: "Custos Infraestrutura<br>R$",
        imagem: "Imagens/Energia - Bomba de irrigacao.png",
    },
    "transporte": {
        nome: "Custos Transporte<br>R$",
        imagem: "Imagens/Transporte.png",
    },
    "administrativos": {
        nome: "Custos Administrativos<br>R$",
        imagem: "Imagens/Controle de Praga - Ghibi.png",
    },
    "indiretos": {
        nome: "Custos Indiretos<br>R$",
        imagem: "Imagens/ESTUFA - Ghibi.png",
    },
};

const respostasChatbot = {
    "usabilidade": [
        { pergunta: "Como adicionar um novo produto?", resposta: "No momento, não é possível adicionar novos produtos diretamente na interface.  Você precisará modificar o código-fonte para incluir novos produtos." },
        // ... (outras perguntas e respostas de usabilidade)
    ],
    "agricultura": [
        { pergunta: "O que é uma safra?", resposta: "Uma safra é o período em que um determinado produto é cultivado e colhido. Pode haver uma ou mais safras por ano, dependendo do produto e das condições climáticas." },
        // ... (outras perguntas e respostas de agricultura)
    ]
};

function popularChatbot(categoria) {
    const select = document.getElementById('perguntas-chatbot');
    select.innerHTML = '<option value="">Selecione uma pergunta</option>'; // Limpa as opções anteriores

    respostasChatbot[categoria].forEach(item => {
        const option = document.createElement('option');
        option.value = item.pergunta;
        option.text = item.pergunta;
        select.appendChild(option);
    });
}


function enviarPerguntaChatbot() {
    const select = document.getElementById('perguntas-chatbot');
    const perguntaSelecionada = select.value;
    const categoriaSelecionada = document.getElementById('categoria-chatbot').value;



    if (perguntaSelecionada && categoriaSelecionada) {
      const resposta = respostasChatbot[categoriaSelecionada].find(item => item.pergunta === perguntaSelecionada)?.resposta || "Desculpe, não encontrei a resposta.";
      document.getElementById('resposta-chatbot').textContent = resposta;
  } else {
      document.getElementById('resposta-chatbot').textContent = "Por favor, selecione uma pergunta";
  }
}

function criarProdutoHTML(produto) {
    const safraHTML = unicaSafra ? `
        <label for="quantidade-${produto.nome}">Quantidade (${produto.unidade}):</label>
        <input type="number" id="quantidade-${produto.nome}" value="0" disabled>
        <label for="valor-${produto.nome}">Valor de Venda (${produto.unidade}):</label>
        <input type="number" id="valor-${produto.nome}" value="0" disabled>
        ${sabeCustoUnitario ? `<label for="custo-${produto.nome}">Custo (${produto.unidade}):</label><input type="number" id="custo-${produto.nome}" value="0" disabled>` : ''}
    ` : criarSafrasHTML(produto);

    return `
        <div class="produto" id="produto-${produto.nome}">
            <div class="produto-info">
                <img src="${produto.imagem}" alt="${produto.nome}">
                <div class="nome-produto">${produto.nome}</div>
            </div>
            <div class="dados">
                <div class="flag-container">
                    <button class="flag true" onclick="setEstoque('${produto.nome}', true)">Sim</button>
                    <button class="flag false" onclick="setEstoque('${produto.nome}', false)">Não</button>
                </div>
                <div id="estoque-${produto.nome}" class="value"></div>

                ${safraHTML}

                <button onclick="gerarRelatorios('${produto.nome}')" id="botao-relatorio-${produto.nome}" disabled>Gerar Relatório</button>
                <div id="relatorio-${produto.nome}" class="relatorio-produto"></div>
            </div>
        </div>
    `;
}

function criarSafrasHTML(produto) {
    let safrasHTML = "";
    for (let i = 1; i <= 4; i++) {
        safrasHTML += `
            <div class="safra" id="safra-${produto.nome}-${i}-container">
                <p class="titulo-safra">Safra ${i}:</p>
                <label for="quantidade-${produto.nome}-${i}">Quantidade (${produto.unidade}):</label>
                <input type="number" id="quantidade-${produto.nome}-${i}" value="0">
                <label for="valor-${produto.nome}-${i}">Valor de Venda (${produto.unidade}):</label>
                <input type="number" id="valor-${produto.nome}-${i}" value="0">
        `;

        if (sabeCustoUnitario || unicaSafra) { // Se sabe o custo unitário OU é uma única safra
            safrasHTML += `
                <label for="custo-${produto.nome}-${i}">Custo (${produto.unidade}):</label>
                <input type="number" id="custo-${produto.nome}-${i}" value="0">
            `;
        }
        safrasHTML += `</div>`;
    }
    return safrasHTML;
}


function criarCustosServicosHTML() {
    let custosHTML = "";
    for (const custo in custosServicos) {
        custosHTML += `
            <div class="custo" id = "custo-${custo}">
                <img src="${custosServicos[custo].imagem}" alt="${custosServicos[custo].nome}">
                <div class="dados">
                    <label for="${custo}">${custosServicos[custo].nome}:</label>
                    <input type="number" id="valor-${custo}" value = "0">
                </div>
            </div>
        `;
    }
    return custosHTML;
}

function setResposta(containerClass, perguntaId, valor, callback = null) {
    const container = document.querySelector(`.${containerClass}`);
    const elementoResposta = document.getElementById(perguntaId);
    const botoes = container.querySelectorAll('.flag');

    elementoResposta.dataset.valor = valor;
    elementoResposta.textContent = valor ? "Sim" : "Não";

    botoes.forEach(botao => {
        botao.classList.remove('selecionado'); // Remove de todos

        if (botao.classList.contains(valor ? 'true' : 'false')) {
            botao.classList.add('selecionado'); // Adiciona ao clicado
        }

        // Garante que 'true' e 'false' estejam corretos
        botao.classList.toggle('true', valor); // 'true' apenas se o valor for true
        botao.classList.toggle('false', !valor); // 'false' apenas se o valor for false
    });

    // Atualiza as cores imediatamente
    const estoqueDiv = container.querySelector('.value');
    if (estoqueDiv) {
        estoqueDiv.textContent = valor ? "Sim" : "Não";
        estoqueDiv.classList.toggle('true', valor);
        estoqueDiv.classList.toggle('false', !valor);
    }

    if (callback) {
        callback(valor);
    }
}


function calcularFaturamento(produto) {

    // Obtém a quantidade e o valor, levando em conta se há safras ou não
    const quantidade = parseFloat(document.getElementById(`quantidade-${produto}`)?.value) || 0;
    const valor = parseFloat(document.getElementById(`valor-${produto}`)?.value) || 0;
    let custoTotal = 0;
    let faturamento = 0;


if (unicaSafra) { // Calcula para safra única
    if (sabeCustoUnitario) {
        const custo = parseFloat(document.getElementById(`custo-${produto}`)?.value) || 0;
        custoTotal = custo * quantidade;
            for (let i = 1; i <= 4; i++) {
                custoTotal += parseFloat(document.getElementById(`safra-${produto}-${i}`)?.value) || 0;
            }

         faturamento = (valor - custo) * quantidade;
    } else {
        custoTotal = custoGeral;
        faturamento = (valor * quantidade) - custoTotal;
    }

} else { // Calcula para múltiplas safras
    for (let i = 1; i <= 4; i++) {
        const quantidadeSafra = parseFloat(document.getElementById(`quantidade-${produto}-${i}`).value) || 0;
        const valorSafra = parseFloat(document.getElementById(`valor-${produto}-${i}`).value) || 0;


           if (sabeCustoUnitario){
               const custoSafra = parseFloat(document.getElementById(`custo-${produto}-${i}`).value) || 0;

                custoTotal += custoSafra * quantidadeSafra;
                faturamento += valorSafra * quantidadeSafra - custoSafra * quantidadeSafra;

           }else{

                const custoSafraInput = document.getElementById(`safra-${produto}-${i}`);

                if (custoSafraInput){
                const custoSafra = parseFloat(custoSafraInput.value) || 0;
                    custoTotal += custoSafra;
                }
           }

    }

}

document.getElementById(`faturamento-${produto}`).textContent = faturamento.toFixed(2);

}



function atualizarFaturamentoTotal() {
    let total = 0;
    document.querySelectorAll('[id^="faturamento-"].produto .dados p span').forEach(span => {
        total += parseFloat(span.textContent) || 0; // Corrigido: parseFloat
    });
    //document.getElementById('faturamento-total').textContent = `Faturamento Total: ${total.toFixed(2)}`; //Removido
}


function gerarRelatorioGeral() {
    let custoTotalGeral = 0;
     let faturamentoTotalGeral = 0;
     let relatorioHTML = "";
     const produtosSelecionados = [];
 
     // Calcula o custo total dos custos de serviço (se aplicável)
     let custoServicosTotal = 0;
     if (!sabeCustoUnitario) {
         for (const custo in custosServicos) {
             custoServicosTotal += parseFloat(document.getElementById(`valor-${custo}`).value) || 0;
         }
     }
 
 
     for (const produto in produtos) {
 
      if (document.getElementById(`estoque-${produtos[produto].nome}`).dataset.estoque === 'true') {
                         produtosSelecionados.push(produtos[produto].nome);
             let custoTotal = 0;
             let faturamento = 0
             const quantidade = parseFloat(document.getElementById(`quantidade-${produtos[produto].nome}`)?.value || document.getElementById(`quantidade-${produtos[produto].nome}-1`)?.value) || 0;
 
             const valor = parseFloat(document.getElementById(`valor-${produtos[produto].nome}`)?.value || document.getElementById(`valor-${produtos[produto].nome}-1`)?.value) || 0;
 
 
 
              if(sabeCustoUnitario){
                      const custo = parseFloat(document.getElementById(`custo-${produtos[produto].nome}`)?.value || document.getElementById(`custo-${produtos[produto].nome}-1`)?.value) || 0;
 
                 if (unicaSafra) {
                      custoTotal = custo * quantidade;
                     for (let i = 1; i <= 4; i++) {
                         custoTotal += parseFloat(document.getElementById(`safra-${produtos[produto].nome}-${i}`)?.value) || 0;
                     }
                 faturamento = (valor-custo) * quantidade;
 
                 } else{
                     for (let i = 1; i <= 4; i++) {
                 const quantidadeSafra = parseFloat(document.getElementById(`quantidade-${produtos[produto].nome}-${i}`)?.value) || 0;
                 const custoSafra = parseFloat(document.getElementById(`custo-${produtos[produto].nome}-${i}`)?.value) || 0;
                 custoTotal += custoSafra * quantidadeSafra;
 
                 faturamento += (parseFloat(document.getElementById(`valor-${produtos[produto].nome}-${i}`)?.value) || 0) * quantidadeSafra - custoSafra * quantidadeSafra;
             }
 
                  }
 
 
              }else{
                  custoTotal = custoGeral;
                  faturamento = valor*quantidade - custoTotal;
              }
             custoTotalGeral += custoTotal;
             faturamentoTotalGeral += faturamento;
 
 
      }
 
     }
 
     relatorioHTML += `
         <p><b>Relatório Geral</b></p>
         <p>1. Faturamento Total: R$ ${faturamentoTotalGeral.toFixed(2)}</p>
         <p>2. Custo Total: R$ ${(custoTotalGeral + custoServicosTotal).toFixed(2)}</p>
         <p>3. Lucro: R$ ${(faturamentoTotalGeral - (custoTotalGeral + custoServicosTotal)).toFixed(2)}</p>
     `;
 
 
     document.getElementById('detalhes-relatorio').innerHTML = relatorioHTML; // Corrigido: adicionado innerHTML
 }
 
 
 function gerarRelatorioIndividual(produto) {
    const quantidade = parseFloat(document.getElementById(`quantidade-${produto}`)?.value) || 0;
    const valor = parseFloat(document.getElementById(`valor-${produto}`)?.value) || 0;
     let custoTotal = 0;
     let faturamento = 0;
     let relatorioHTML = "";
 
 
         if (document.getElementById(`estoque-${produto}`).dataset.estoque === 'true'){
 
             if (sabeCustoUnitario) {
                 if (unicaSafra) {
                     const custo = parseFloat(document.getElementById(`custo-${produto}`).value) || 0;
                     custoTotal = custo * quantidade;
 
                     for (let i = 1; i <= 4; i++) {
                         custoTotal += parseFloat(document.getElementById(`safra-${produto}-${i}`)?.value) || 0;
                     }
 
                 faturamento = (valor-custo) * quantidade;
                 } else {
                     for (let i = 1; i <= 4; i++) {
 
                         const quantidadeSafra = parseFloat(document.getElementById(`quantidade-${produto}-${i}`)?.value) || 0;
                         const valorSafra = parseFloat(document.getElementById(`valor-${produto}-${i}`)?.value) || 0;
                         const custoSafra = parseFloat(document.getElementById(`custo-${produto}-${i}`)?.value) || 0;
                         faturamento += valorSafra * quantidadeSafra - custoSafra * quantidadeSafra;
                         custoTotal += custoSafra * quantidadeSafra;
                     }
                 }
 
 
 
             } else {
                 custoTotal = custoGeral;
                 faturamento = valor * quantidade - custoTotal;
             }
 
             const percentualFaturamento = (faturamento / custoTotal) * 100;
 
 
                     relatorioHTML += `
                         <h3>${produto.charAt(0).toUpperCase() + produto.slice(1)}:</h3>
                         <p>1. Faturamento: R$ ${faturamento.toFixed(2)}</p>
                         <p>2. Valor de produção total: R$ ${custoTotal.toFixed(2)}</p>
                         <p>3. Recomendação: ${percentualFaturamento >= 10 ? 'Faturamento maior ou igual à 10%, é um sinal de que o negócio está indo bem.' : 'Se o faturamento está menor que 10% em relação do custo de produção. Orietamos que o custo de produção está muito alto ou o preço da venda está menor do que a desejado.'}</p>
                     `;
 
 
 
         }
 
 
         document.getElementById(`relatorio-${produto}`).innerHTML = relatorioHTML;
 
 }
 function setSabeCustoUnitario(valor) {
    setResposta('pergunta-custo', 'sabe-custo-unitario', valor, (valor) => {
        sabeCustoUnitario = valor;
        document.getElementById('custos-servicos').style.display = valor ? 'none' : 'flex';
        document.getElementById('custo-geral').style.display = valor ? 'none' : 'block';
        atualizarProdutos();
        gerarRelatorioGeral();
    });
}


function setEstoque(produto, estoque) {
    const estoqueDiv = document.getElementById(`estoque-${produto}`);
    estoqueDiv.dataset.estoque = estoque;

    const inputs = document.querySelectorAll(`#produto-${produto} input`);
     const safras = document.querySelectorAll(`#produto-${produto} .safra input`);

      if (!unicaSafra) {
             safras.forEach(safra => {
                 safra.disabled = !estoque;
             })


         }

    inputs.forEach(input => input.disabled = !estoque);
    const botaoRelatorio = document.getElementById(`botao-relatorio-${produto}`);
   
   
       if (estoque) {
           estoqueDiv.textContent = "Sim";
           estoqueDiv.classList.add('selecionado');
           estoqueDiv.classList.add('true');
           estoqueDiv.classList.remove('false');  // garante que não tenha a classe 'false'
   
           document.querySelectorAll(`#produto-${produto} .flag:not(.true)`).forEach(el => el.classList.remove('selecionado'));
           document.querySelectorAll(`#produto-${produto} .flag:not(.true)`).forEach(el => el.classList.add('false')); // adiciona classe false
   
           botaoRelatorio.disabled = false;
       } else {
           estoqueDiv.textContent = "Não";
           estoqueDiv.classList.add('selecionado');
           estoqueDiv.classList.remove('true');
           estoqueDiv.classList.add('false');
           document.querySelectorAll(`#produto-${produto} .flag:not(.false)`).forEach(el => el.classList.remove('selecionado'));
            document.querySelectorAll(`#produto-${produto} .flag:not(.false)`).forEach(el => el.classList.add('true'));
           botaoRelatorio.disabled = true;
   
           // Limpa o relatório individual se o estoque for "Não"
           document.getElementById(`relatorio-${produto}`).innerHTML = "";
   
   
       }
   gerarRelatorioGeral(); //gera relatório geral toda vez que muda o estoque
   
   
   
   }
   function setUnicaSafra(valor) {
    setResposta('pergunta-safra', 'unica-safra', valor, (valor) => {
        unicaSafra = valor;
        atualizarProdutos();
    });
}
   
// Função para atualizar os produtos na tela
function atualizarProdutos() {
    const produtosDiv = document.querySelector('.produtos');
    let produtosHTML = "";
    for (const produto in produtos) {
        produtosHTML += criarProdutoHTML(produtos[produto]);
    }
    produtosDiv.innerHTML = produtosHTML;
    inicializarProdutos();
}

function inicializarProdutos() {
    for (const produto in produtos) {
            setEstoque(produtos[produto].nome, false);

            if (unicaSafra) {
                document.getElementById(`quantidade-${produtos[produto].nome}`).addEventListener('input', () => calcularFaturamento(produtos[produto].nome));
                document.getElementById(`valor-${produtos[produto].nome}`).addEventListener('input', () => calcularFaturamento(produtos[produto].nome));
                if (sabeCustoUnitario) {
                    document.getElementById(`custo-${produtos[produto].nome}`).addEventListener('input', () => calcularFaturamento(produtos[produto].nome));
                }

            } else {
                adicionarSafras(produtos[produto].nome);

            }


            for (let i = 1; i <= 4; i++) {
                            if(!unicaSafra){
                    document.getElementById(`quantidade-${produtos[produto].nome}-${i}`).addEventListener('input', () => calcularFaturamento(produtos[produto].nome));
                    document.getElementById(`valor-${produtos[produto].nome}-${i}`).addEventListener('input', () => calcularFaturamento(produtos[produto].nome));
                    if (sabeCustoUnitario) {
                        document.getElementById(`custo-${produtos[produto].nome}-${i}`).addEventListener('input', () => calcularFaturamento(produtos[produto].nome));
                    }



                }
                                        document.getElementById(`safra-${produtos[produto].nome}-${i}`)?.addEventListener('input', () => calcularFaturamento(produtos[produto].nome));

            }
        }

}

function adicionarSafras(produto) {
    const safrasDiv = document.getElementById(`safras-${produto}`);
    let safrasHTML = "";
    for (let i = 1; i <= 4; i++) {
        safrasHTML += `
            <div>
                <p class = "titulo-safra">Safra ${i}:</p>
               <label for="safra-${produto}-${i}">Custo da Safra ${i}:</label>
                <input type="number" id="safra-${produto}-${i}" value="0" disabled>

            </div>
        `;
    }
    safrasDiv.innerHTML = safrasHTML;
}

function calcularCustoGeral() {
    if (!sabeCustoUnitario) { // Só calcula se a opção "Não" estiver selecionada
        custoGeral = 0;
        for (let custo in custosServicos) {
            custoGeral += (parseFloat(document.getElementById(`valor-${custo}`).value) || 0);
        }
        document.getElementById('valor-custo-geral').value = custoGeral; // Atualiza o input do custo geral
        gerarRelatorioGeral(); // Atualiza o relatório geral imediatamente

        for (const produto in produtos) { //atualiza o relatorio individual de cada produto
            gerarRelatorioIndividual(produtos[produto].nome);

        }

    }
}

// Função para gerar relatórios individuais e geral
function gerarRelatorios(produto) {
    gerarRelatorioIndividual(produto);
    gerarRelatorioGeral();
}

// Inicialização
setSabeCustoUnitario(true);
setUnicaSafra(true)
atualizarProdutos();
document.getElementById('custos-servicos').innerHTML += criarCustosServicosHTML();


// Adiciona event listeners para os custos de serviço
for (let custo in custosServicos) {
    document.getElementById(`valor-${custo}`).addEventListener('input', () => {
        calcularCustoGeral();
        for (let produto in produtos) {
            gerarRelatorioIndividual(produtos[produto].nome)
        }
        gerarRelatorioGeral();


    });
}

document.getElementById('valor-custo-geral').addEventListener('input', () => {
    if (!sabeCustoUnitario) {
        custoGeral = parseFloat(document.getElementById('valor-custo-geral').value) || 0;
        for (let produto in produtos) {
            gerarRelatorioIndividual(produtos[produto].nome)
        }
        gerarRelatorioGeral();


    }
});

gerarRelatorioGeral();