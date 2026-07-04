// ==============================
// LUSO v5.4 — MOTOR LINGUÍSTICO
// PT-PT + Ortografia Pré-1990 (pré-AO90) + Verificação ortográfica real
// ==============================

// ------------------------------
// DICIONÁRIO ORTOGRÁFICO REAL (Hunspell pt_PT, via Typo.js)
// Carregado de forma assíncrona a partir de /dictionaries/pt_PT/
// ------------------------------
let dicionarioPT = null;
let dicionarioProntoPromise = carregarDicionario();

async function carregarDicionario() {
    try {
        const [affResp, dicResp] = await Promise.all([
            fetch("dictionaries/pt_PT/pt_PT.aff"),
            fetch("dictionaries/pt_PT/pt_PT.dic")
        ]);

        if (!affResp.ok || !dicResp.ok) {
            throw new Error("Ficheiros do dicionário não encontrados (HTTP " + affResp.status + "/" + dicResp.status + ")");
        }

        const affData = await affResp.text();
        const wordsData = await dicResp.text();

        dicionarioPT = new Typo("pt_PT", affData, wordsData);
        console.log("Dicionário pt_PT carregado (" + wordsData.split("\n").length + " entradas).");
    } catch (erro) {
        console.error("Não foi possível carregar o dicionário ortográfico:", erro);
        // Nota: isto falha tipicamente se abrires o index.html diretamente
        // com duplo-clique (file://) em vez de o servir por um servidor local,
        // porque o fetch() de ficheiros locais é bloqueado por CORS nesse caso.
    }
}

// Verifica ortografia real, palavra a palavra, contra o dicionário pt_PT.
// NÃO substitui automaticamente — só assinala e sugere, porque as sugestões
// por distância de edição do Hunspell nem sempre acertam na palavra certa
// (ex.: "vosse" pode sugerir "Fosse"/"Posse" em vez de "você").
function verificarOrtografiaReal(texto) {

    if (!dicionarioPT) return [];

    const contagem = new Map();
    const palavras = texto.match(/[A-Za-zÀ-ÖØ-öø-ÿ]+/g) || [];

    palavras.forEach(palavra => {

        if (palavra.length < 2) return;

        let chave = palavra.toLowerCase();

        // Já é tratada pelo dicionário de vocabulário PT-PT (deletar, ok, etc.)
        if (lexicon[chave]) return;

        if (dicionarioPT.check(palavra)) return;

        if (!contagem.has(chave)) {
            let sugestoes = dicionarioPT.suggest(palavra).slice(0, 4);
            contagem.set(chave, { palavra, ocorrencias: 0, sugestoes });
        }
        contagem.get(chave).ocorrencias++;
    });

    return Array.from(contagem.values());
}

// ------------------------------
// VOCABULÁRIO PT-PT (registo)
// ------------------------------
const lexicon = {
    deletar: { ptpt: "apagar", formal: "eliminar", tecnico: "remover" },
    ok: { ptpt: "certo", formal: "entendido", tecnico: "confirmado" },
    please: { ptpt: "por favor", formal: "agradeço que", tecnico: "solicita-se" },
    download: { ptpt: "transferir", formal: "descarregar", tecnico: "obter ficheiro" }
};

// ------------------------------
// ORTOGRAFIA PRÉ-1990 (AO90 → pré-AO90)
// Restituição de consoantes mudas + acentos circunflexos
// Lista não exaustiva — cobre os casos mais comuns.
// ------------------------------
const lexiconOrtografiaPre1990 = {
    "ação": "acção", "ações": "acções", "acionista": "accionista", "acionistas": "accionistas",
    "acionar": "accionar",
    "adjetivo": "adjectivo", "adjetivos": "adjectivos",
    "adoção": "adopção", "adotar": "adoptar", "adotado": "adoptado", "adotivo": "adoptivo",
    "afeto": "afecto", "afetivo": "afectivo", "afetar": "afectar",
    "aspeto": "aspecto", "aspetos": "aspectos",
    "ativo": "activo", "ativa": "activa", "ativos": "activos", "ativas": "activas",
    "atividade": "actividade", "atividades": "actividades",
    "arquiteto": "arquitecto", "arquitetura": "arquitectura",
    "cético": "céptico", "ceticismo": "cepticismo",
    "coleção": "colecção", "coleções": "colecções",
    "coletivo": "colectivo", "coletor": "colector",
    "confeção": "confecção",
    "concetual": "conceptual",
    "correto": "correcto", "correção": "correcção", "corretor": "corrector",
    "deteção": "detecção", "detetive": "detective", "detetar": "detectar",
    "dialeto": "dialecto",
    "direção": "direcção", "diretiva": "directiva", "diretor": "director",
    "diretório": "directório", "diretriz": "directriz",
    "efetivo": "efectivo", "efetivamente": "efectivamente", "efetuar": "efectuar",
    "elétrico": "eléctrico", "eletricidade": "electricidade",
    "eletrónico": "electrónico", "eletrodoméstico": "electrodoméstico",
    "exato": "exacto", "exatidão": "exactidão",
    "exceção": "excepção", "excecional": "excepcional", "exceto": "excepto",
    "expetativa": "expectativa",
    "fator": "factor",
    "indireto": "indirecto",
    "infeção": "infecção", "infetar": "infectar", "infecioso": "infeccioso",
    "inspeção": "inspecção", "inspetor": "inspector",
    "lecionar": "leccionar", "letivo": "lectivo",
    "noturno": "nocturno",
    "objeto": "objecto", "objetivo": "objectivo", "objeção": "objecção",
    "ótimo": "óptimo", "ótica": "óptica", "ótico": "óptico",
    "perspetiva": "perspectiva",
    "projeto": "projecto", "projetar": "projectar", "projétil": "projéctil",
    "receção": "recepção", "recetivo": "receptivo", "recetor": "receptor",
    "receciona": "recepciona", "rececionista": "recepcionista",
    "respetivo": "respectivo", "respetivamente": "respectivamente",
    "retrospetiva": "retrospectiva",
    "seleção": "selecção", "selecionar": "seleccionar", "seletivo": "selectivo",
    "setor": "sector",
    "tato": "tacto",
    "vetor": "vector",
    "espetáculo": "espectáculo", "espetador": "espectador",

    // acentos circunflexos restituídos (casos sem ambiguidade)
    "voo": "vôo", "voos": "vôos",
    "enjoo": "enjôo", "enjoos": "enjôos",
    "veem": "vêem", "deem": "dêem", "creem": "crêem", "leem": "lêem", "releem": "relêem"
};

// Palavras que MUDAM de grafia consoante o contexto gramatical.
// Não são corrigidas automaticamente — só sinalizadas para revisão manual,
// porque trocar sem perceber a função da palavra na frase introduz erros.
const palavrasAmbiguasPre1990 = {
    "para": "verbo 'parar' (pára) vs. preposição (para)",
    "pelo": "substantivo 'pêlo' (pelo do corpo/animal) vs. contração 'por'+'o' (pelo)",
    "pelos": "substantivo 'pêlos' vs. contração 'por'+'os'",
    "polo": "substantivo 'pólo' (jogo/campo magnético) vs. 'polo' (peça de vestuário)",
    "forma": "substantivo 'fôrma' (utensílio de cozinha) vs. 'forma' (formato/maneira)"
};

// ==============================
// UTILITÁRIO — preservar maiúsculas/minúsculas na substituição
// ==============================
function preservarCaso(original, novo) {
    if (original === original.toUpperCase() && original !== original.toLowerCase()) {
        return novo.toUpperCase();
    }
    if (original[0] === original[0].toUpperCase()) {
        return novo.charAt(0).toUpperCase() + novo.slice(1);
    }
    return novo;
}

// ==============================
// CONVERSÃO PARA ORTOGRAFIA PRÉ-1990
// ==============================
function aplicarOrtografiaPre1990(texto) {

    let result = texto;
    let changes = [];

    for (let palavra in lexiconOrtografiaPre1990) {

        let regex = new RegExp("\\b" + palavra + "\\b", "gi");

        result = result.replace(regex, (match) => {
            let novo = preservarCaso(match, lexiconOrtografiaPre1990[palavra]);
            changes.push({
                original: match,
                principal: novo,
                alternativas: [],
                motivo: "Ortografia pré-1990 (pré-AO90)"
            });
            return novo;
        });
    }

    return { result, changes };
}

// Deteta palavras ambíguas sem as alterar — apenas para aviso ao utilizador
function detetarAmbiguidadesPre1990(texto) {

    let encontradas = [];

    for (let palavra in palavrasAmbiguasPre1990) {
        let regex = new RegExp("\\b" + palavra + "\\b", "gi");
        let matches = texto.match(regex);
        if (matches) {
            encontradas.push({
                palavra,
                ocorrencias: matches.length,
                explicacao: palavrasAmbiguasPre1990[palavra]
            });
        }
    }

    return encontradas;
}

// ==============================
// DETEÇÃO DE ESTILO
// ==============================
function detectarEstilo(texto) {

    let t = texto.toLowerCase();

    let formal = (t.match(/\b(agradeço|solicito|por favor|gentileza)\b/g) || []).length;
    let informal = (t.match(/\b(ok|mano|tipo|ya|fixe)\b/g) || []).length;
    let tecnico = (t.match(/\b(ficheiro|sistema|processo|dados|transferir)\b/g) || []).length;
    let academico = (t.match(/\b(análise|conclui|verifica|evidencia|hipótese)\b/g) || []).length;

    let tipo = "Neutro";
    let max = Math.max(formal, informal, tecnico, academico);

    if (max > 0) {
        if (max === formal) tipo = "Formal";
        else if (max === tecnico) tipo = "Técnico";
        else if (max === academico) tipo = "Académico";
        else if (max === informal) tipo = "Informal";
    }

    return { formal, informal, tecnico, academico, tipo };
}

// ==============================
// DETEÇÃO DE INTENÇÃO
// ==============================
function detectarIntencao(texto, style) {

    let t = texto.trim().toLowerCase();

    if (t.endsWith("?")) return "pergunta";
    if (/\b(podes|poderias|por favor|agradeço|solicito)\b/.test(t)) return "pedido";
    if (style.tipo === "Formal") return "formal";
    if (style.tipo === "Informal") return "informal";

    return "neutro";
}

// ==============================
// CORREÇÃO LEXICAL (registo PT-PT)
// ==============================
function corrigirTexto(texto) {

    let result = texto;
    let changes = [];

    for (let word in lexicon) {

        let regex = new RegExp("\\b" + word + "\\b", "gi");

        if (result.match(regex)) {
            let options = lexicon[word];
            result = result.replace(regex, options.ptpt);
            changes.push({
                original: word,
                principal: options.ptpt,
                alternativas: [options.formal, options.tecnico],
                motivo: "Normalização PT-PT"
            });
        }
    }

    return { result, changes };
}

// ==============================
// CORREÇÃO GRAMATICAL (AUTOMÁTICA)
// ==============================
function autoCorrigirGramatica(texto) {

    let issues = [];
    const frases = texto.split(" ");

    for (let i = 0; i < frases.length - 1; i++) {

        let palavra = frases[i].toLowerCase();
        let proxima = frases[i + 1]?.toLowerCase();

        if (palavra === "eu" && proxima === "vai") {
            frases[i + 1] = "vou";
            issues.push({ erro: "eu vai", correcao: "eu vou", detalhe: "concordância verbal" });
        }

        if (palavra === "tu" && proxima === "vai") {
            frases[i + 1] = "vais";
            issues.push({ erro: "tu vai", correcao: "tu vais", detalhe: "concordância verbal" });
        }
    }

    return { texto: frases.join(" "), issues };
}

// ==============================
// REESCRITA INTELIGENTE
// ==============================
function reescreverInteligente(texto, semantica) {

    let out = "";

    if (semantica.intencao === "pedido") {
        out = "Versão formal do pedido:\n\n" + "Podes, por favor, " + texto.toLowerCase();
    } else if (semantica.intencao === "pergunta") {
        out = "Versão estruturada da pergunta:\n\n" + texto.charAt(0).toUpperCase() + texto.slice(1);
    } else if (semantica.intencao === "formal") {
        out = "Texto formal mantido:\n\n" + texto;
    } else if (semantica.intencao === "informal") {
        out = "Versão formalizada:\n\n" +
            texto.replace(/\bok\b/gi, "certo").replace(/\btipo\b/gi, "").replace(/\s{2,}/g, " ");
    } else {
        out = "Versão neutra otimizada:\n\n" + texto;
    }

    return out;
}

// ==============================
// FUNÇÃO PRINCIPAL — CORRIGIR
// (aplica: ortografia pré-1990 → vocabulário PT-PT → gramática)
// ==============================
async function corrigir() {

    let text = document.getElementById("input").value;

    await dicionarioProntoPromise;

    let errosOrtografia = verificarOrtografiaReal(text);
    let pre1990 = aplicarOrtografiaPre1990(text);
    let style = detectarEstilo(pre1990.result);
    let lex = corrigirTexto(pre1990.result);
    let gram = autoCorrigirGramatica(lex.result);
    let ambiguas = detetarAmbiguidadesPre1990(text);

    document.getElementById("output").innerText = gram.texto;

    let avisoAmbiguas = "";
    if (ambiguas.length > 0) {
        avisoAmbiguas = "<br>⚠️ " + ambiguas.length +
            " palavra(s) ambígua(s) para revisão manual (ver tabela)";
    }

    let avisoDicionario = dicionarioPT
        ? ""
        : "<br>⚠️ Dicionário ortográfico indisponível (ver consola)";

    document.getElementById("stats").innerHTML =
        "📊 Estilo dominante: " + style.tipo +
        "<br>❌ Erros ortográficos: " + errosOrtografia.length +
        "<br>🧠 Erros gramaticais: " + gram.issues.length +
        "<br>🔧 Substituições lexicais: " + lex.changes.length +
        "<br>📜 Ajustes ortografia pré-1990: " + pre1990.changes.length +
        avisoAmbiguas + avisoDicionario;

    let todasAsAlteracoes = errosOrtografia.map(e => ({
            original: e.palavra + (e.ocorrencias > 1 ? " (x" + e.ocorrencias + ")" : ""),
            principal: e.sugestoes.length ? e.sugestoes.join(" / ") : "(sem sugestão)",
            alternativas: [],
            motivo: "Erro ortográfico — não reconhecido pelo dicionário PT-PT"
        })).concat(pre1990.changes).concat(lex.changes).concat(
        gram.issues.map(i => ({
            original: i.erro,
            principal: i.correcao,
            alternativas: [],
            motivo: i.detalhe
        }))
    ).concat(
        ambiguas.map(a => ({
            original: a.palavra,
            principal: "— revisão manual —",
            alternativas: [],
            motivo: "Ambíguo: " + a.explicacao + " (" + a.ocorrencias + "x)"
        }))
    );

    renderChanges(todasAsAlteracoes);
}

// ==============================
// REESCRITA (usa ortografia pré-1990 + reescrita inteligente)
// ==============================
function reescrever() {

    let text = document.getElementById("input").value;

    let pre1990 = aplicarOrtografiaPre1990(text);
    let style = detectarEstilo(pre1990.result);
    let intencao = detectarIntencao(pre1990.result, style);

    let out = reescreverInteligente(pre1990.result, { intencao });

    document.getElementById("output").innerText = out;
}

// ==============================
// ANÁLISE DE ESTILO
// ==============================
function analisar() {

    let text = document.getElementById("input").value;
    let style = detectarEstilo(text);
    let intencao = detectarIntencao(text, style);

    document.getElementById("output").innerText =
        "🔍 Análise:\n\n" +
        "Tipo: " + style.tipo + "\n" +
        "Formal: " + style.formal + "\n" +
        "Informal: " + style.informal + "\n" +
        "Técnico: " + style.tecnico + "\n" +
        "Académico: " + style.academico;

    // Atualiza o cartão de intenção no painel lateral, se existir no HTML
    let intentEl = document.getElementById("intent");
    if (intentEl) {
        intentEl.innerText = "Tipo de texto: " + style.tipo + " (intenção: " + intencao + ")";
    }
}

// ==============================
// RENDER DE ALTERAÇÕES
// ==============================
function renderChanges(changes) {

    let html = "<table>";
    html += "<tr><td><b>Original</b></td><td><b>Corrigido</b></td><td><b>Motivo</b></td></tr>";

    changes.forEach(c => {
        html += `
        <tr>
            <td>${c.original}</td>
            <td>${c.principal}</td>
            <td>${c.motivo}</td>
        </tr>`;
    });

    html += "</table>";

    let changesEl = document.getElementById("changes");
    if (changesEl) changesEl.innerHTML = html;

    // Explicação em linguagem simples, frase a frase
    let explainEl = document.getElementById("explain");
    if (explainEl) {
        if (changes.length === 0) {
            explainEl.innerHTML = "Não foram encontradas alterações a fazer.";
        } else {
            explainEl.innerHTML = changes.map(c =>
                `• <b>${c.original}</b> → <b>${c.principal}</b> — ${c.motivo}`
            ).join("<br>");
        }
    }
}
