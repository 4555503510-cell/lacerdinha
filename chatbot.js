import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import fs from 'fs'; 

// 1. Initialize the client
const client = new Client({
    authStrategy: new LocalAuth() 
});

// 2. Generate and display the QR code for authentication
client.on('qr', qr => {
    console.log('Scan this QR code with your WhatsApp app:');
    qrcode.generate(qr, {small: true});
});

// 3. Confirm successful login
client.on('ready', () => {
    console.log('Chatbot is ready and connected to WhatsApp!');
});

// 4. Handle incoming messages
// ========================================================
// CONTROLE DE INSTÂNCIAS (MEMÓRIA DO BOT)
// ========================================================
const usuariosInstancia = {};

// ========================================================
// 1. MÓDULOS DE INTERFACE (FUNÇÕES ESPECÍFICAS DE MENUS)
// ========================================================

// --- NÍVEL 1: MENU PRINCIPAL ---
async function exibirMenuPrincipal(client, telefone, dadosUsuario) {
    dadosUsuario.estagio = 'menu_principal';
    const texto = `Olá! 👋 Eu sou o Lacerdinha, assistente virtual do CEDUP.
Por favor, digite o número correspondente ao seu perfil para acessar as informações e serviços disponíveis!
Você pode voltar a este menu a qualquer momento digitando "Menu"! 😉

1️⃣ - Público Externo
2️⃣ - Aluno CEDUP
3️⃣ - Ex-Aluno CEDUP
4️⃣ - Responsável por Aluno
5️⃣ - CEJA 🏢`;

    await client.sendMessage(telefone, texto);
}

// --- NÍVEL 2: PERFIS PRINCIPAIS ---
async function exibirMenuPublicoExterno(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuPrincipal(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'menu_publico_externo';
    
    const texto = `Menu Público Externo 👤:
1️⃣ - Cursos Disponíveis 📚
2️⃣ - Matrícula 📝
3️⃣ - Eventos e avisos 🔔
4️⃣ - Falar com Atendente 🤝
5️⃣ - Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

async function exibirMenuAlunoCedup(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuPrincipal(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'menu_aluno_cedup';
    
    const texto = `Menu Aluno CEDUP 🎓:
1️⃣ - Eventos 🎉
2️⃣ - Infraestrutura 🏫
3️⃣ - Documentos 📑
4️⃣ - Falar com atendente 🤝
5️⃣ - Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

async function exibirMenuExAlunoCedup(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuPrincipal(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'menu_ex_aluno_cedup';
    
    const texto = `Menu Ex-Aluno CEDUP 📜
1️⃣ - Solicitar Diploma 🎓
2️⃣ - Falar com atendente 🤝
3️⃣ - Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

async function exibirMenuResponsavel(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuPrincipal(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'menu_responsavel';
    
    const texto = `Menu Responsável por Aluno 👨‍👩‍👧‍👦:
1️⃣ - Orientação Pedagógica 💡
2️⃣ - Saída Antecipada 🚪
3️⃣ - Falar com atendente 🤝
4️⃣ - Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

async function exibirMenuCeja(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuPrincipal(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'menu_ceja';
    
    const texto = `📘 CEJA — Centro de Educação de Jovens e Adultos

Para informações sobre o CEJA, entre em contato diretamente pelo telefone:


📞 (48) 3665-5638


🕐 Horários de atendimento:
• Manhã: 08:30 às 11:00
• Tarde: 14:00 às 15:00
• Noite: 19:00 às 21:00

1️⃣ - Falar com atendente 🤝
2️⃣ - Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

// --- NÍVEL 3: SUBMENUS ---

// Submenus do Público Externo
async function exibirMenuCursosDisponiveis(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuPublicoExterno(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'menu_publico_externo_cursos';
    
    const texto = `Cursos Disponíveis 📚:
1️⃣ - Cursos Técnicos
2️⃣ - Cursos EMIEP
3️⃣ - Cursos FIC
4️⃣ - Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

async function exibirMenuPublicoExternoMatricula(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuPublicoExterno(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'menu_publico_externo_matricula';
    
    const texto = `📝 Informações para matrícula:

Documentos necessários:
• RG (original e cópia)
• CPF (original e cópia)
• Comprovante de residência
• Histórico escolar

⚠️ Menor de idade: trazer também RG do responsável (presença obrigatória).

📍 Inscrições presenciais — Secretaria CEDUP JL:
• Manhã: 08:30 às 11:00
• Tarde: 14:00 às 15:00
• Noite: 19:00 às 21:00

📌 Rua General Bittencourt, 234 — Centro, Florianópolis - SC

1️⃣ - Falar com Atendente 🤝
2️⃣ - Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

async function exibirMenuPublicoExternoEventos(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuPublicoExterno(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'menu_publico_externo_eventos';
    
    const texto = `📅 Eventos e avisos do CEDUP JL:

Para informações sobre formaturas, eventos internos e comunicados, acompanhe nossas redes sociais ou entre em contato com a secretaria nos horários de atendimento.
1️⃣ - Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

async function exibirMenuPublicoExternoAtendente(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuPublicoExterno(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'menu_publico_externo_atendente';
    
    const texto = `👤 Vou tentar te conectar com um atendente, por favor, aguarde! 🙏

🕐 Horários de atendimento:
• Manhã: 08:30 às 11:00
• Tarde: 14:00 às 15:00
• Noite: 19:00 às 21:00

Se estiver fora do horário, deixe sua mensagem e retornaremos em breve. 😊

1️⃣ - Cancelar e Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

// Submenus do Aluno
async function exibirMenuAlunoEventos(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuAlunoCedup(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'aluno_eventos';
    
    const texto = `📅 Eventos e avisos para alunos:

Para calendário escolar, provas, formaturas e comunicados da direção, consulte o mural da escola e os comunicados oficiais da coordenação.

1️⃣ - Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

async function exibirMenuAlunoInfraestrutura(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuAlunoCedup(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'aluno_infraestrutura';
    
    const texto = `🏫 Infraestrutura:\n\n1️⃣ - Falar com atendente 🤝\n2️⃣ - Voltar ⬅️`;
    await client.sendMessage(telefone, texto);
}

async function exibirMenuAlunoDocumentos(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuAlunoCedup(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'aluno_documentos';
    
    const texto = `📑 Documentos Escolares

Boletim, declaração de matrícula e carteirinha estudantil não são emitidos por este canal.

👉 Acesse o Portal Aluno SC:
🔗 alunosc.see.sc.gov.br

1️⃣ - Falar com atendente 🤝
2️⃣ - Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

// Submenus do Ex-Aluno
async function iniciarColetaDiploma(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuExAlunoCedup(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'solicitar_diploma_nome';

    dadosUsuario.dadosDiploma = {
        nome: '',
        cpf: '',
        curso: '',
        anoConclusao: ''
    };

    await client.sendMessage(telefone, 'Perfeito! Vamos iniciar a sua solicitação de diploma. 🎓\n\nPor favor, digite o seu **Nome Completo**:');
}

async function exibirMenuExAlunoAtendente(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuExAlunoCedup(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'ex_aluno_atendente';

    const texto = `Vou tentar te conectar com um atendente, por favor, aguarde! 🙏

🕐 Horários de atendimento:
• Manhã: 08:30 às 11:00
• Tarde: 14:00 às 15:00
• Noite: 19:00 às 21:00

Se estiver fora do horário, deixe sua mensagem e retornaremos em breve. 😊

1️⃣ - Cancelar e Voltar ⬅️`;

    await client.sendMessage(telefone, texto);
}

// Submenus do Responsável
async function exibirMenuRespOrientacao(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuResponsavel(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'resp_orientacao';

    const texto = `📚 Orientação pedagógica
Para assuntos relacionados à orientação pedagógica, precisamos conectar você com um atendente especializado.

Vou te transferir agora! 🙏

1️⃣ - Voltar ⬅️`;
    
    await client.sendMessage(telefone, texto);
}

async function exibirMenuRespSaida(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuResponsavel(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'saida_antecipada_doc'; // Ajustado sem acento para casar com o switch
    
    const texto = `🚪 *Solicitação de saída antecipada*

Para autorizar a saída antecipada do(a) aluno(a), envie uma foto do seu documento de identificação (RG ou CNH).

📸 Por favor, envie uma foto clara do documento:`;

    await client.sendMessage(telefone, texto);
}

async function exibirMenuRespAtendente(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuResponsavel(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'resp_atendente';
    
    await client.sendMessage(telefone, `Conectando à Equipe de Orientadores... 🕒\n\n1️⃣ - Cancelar e Voltar ⬅️`);
}

// --- NÍVEL 4: TRAMPAS FINAIS (AÇÕES DE CURSOS) ---
async function exibirCursosTecnicos(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuCursosDisponiveis(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'cursos_tecnicos';
    
    await client.sendMessage(telefone, `📚 Cursos Técnicos Disponíveis:\n\n[Lista de Cursos]\n\n1️⃣ - Quero me inscrever 📝\n2️⃣ - Voltar ⬅️`);
}

async function exibirCursosEmiep(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuCursosDisponiveis(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'cursos_emiep';
    
    await client.sendMessage(telefone, `📐 Cursos EMIEP Disponíveis:\n\n[Lista de Cursos]\n\n1️⃣ - Quero me inscrever 📝\n2️⃣ - Voltar ⬅️`);
}

async function exibirCursosFic(client, telefone, dadosUsuario) {
    dadosUsuario.menuAnterior = async () => await exibirMenuCursosDisponiveis(client, telefone, dadosUsuario);
    dadosUsuario.estagio = 'cursos_fic';
    
    await client.sendMessage(telefone, `🔨 Cursos FIC Disponíveis:\n\n[Lista de Cursos]\n\n1️⃣ - Quero me inscrever 📝\n2️⃣ - Voltar ⬅️`);
}


// ========================================================
// 2. O ESCUTADOR DE MENSAGENS DO WHATSAPP
// ========================================================
client.on('message_create', async msg => {
    // 💡 A TRAVA ANTI-LOOP FINAL: Ignora se a mensagem foi disparada pelo próprio bot
    if (msg.fromMe) return;

    // Filtro de segurança: Responde apenas conversas individuais (não responde grupos)
    if (msg.from.endsWith('@g.us')) return;

    const chat = await msg.getChat();
    const telefone = chat.id._serialized;
    
    // Inicializa os dados do usuário na memória se for o primeiro contato
    if (!usuariosInstancia[telefone]) {
        usuariosInstancia[telefone] = { estagio: 'inicio', menuAnterior: null };
    }  
    
    console.log(`[REDE] Tipo: ${msg.type} | De: ${telefone} | Mídia Disponível: ${msg.hasMedia}`);
    
    const dadosUsuario = usuariosInstancia[telefone];
    const estagioAtual = dadosUsuario.estagio;

    // Se o usuário mandar texto, tratamos aqui
    let textoUsuario = "";
    if (msg.body) {
        textoUsuario = msg.body.trim().toLowerCase();
    }

    // Gatilho Global de Entrada/Reset (Oi, Olá, Menu...)
    if (textoUsuario === 'testecedup2026' || (estagioAtual !== 'inicio' && textoUsuario === 'menu')) {
        await chat.sendStateTyping(); 
        await exibirMenuPrincipal(client, telefone, dadosUsuario);
        return;
    }

    // Se o bot estiver no estágio inicial e a palavra não for o gatilho, ignora
    if (estagioAtual === 'inicio') return;

    // SWITCH: CONTROLADOR MENU PRINCIPAL
    if (estagioAtual === 'menu_principal') {
        switch (textoUsuario) {
            case '1': await exibirMenuPublicoExterno(client, telefone, dadosUsuario); break;
            case '2': await exibirMenuAlunoCedup(client, telefone, dadosUsuario); break;
            case '3': await exibirMenuExAlunoCedup(client, telefone, dadosUsuario); break;
            case '4': await exibirMenuResponsavel(client, telefone, dadosUsuario); break;
            case '5': await exibirMenuCeja(client, telefone, dadosUsuario); break;
            default: await client.sendMessage(telefone, 'Opção inválida. ❌ Digite de 1 a 5.'); break;
        }
        return;
    }

    // SWITCH: CONTROLADOR PÚBLICO EXTERNO
    if (estagioAtual === 'menu_publico_externo') {
        switch (textoUsuario) {
            case '1': await exibirMenuCursosDisponiveis(client, telefone, dadosUsuario); break;
            case '2': await exibirMenuPublicoExternoMatricula(client, telefone, dadosUsuario); break;
            case '3': await exibirMenuPublicoExternoEventos(client, telefone, dadosUsuario); break;
            case '4': await exibirMenuPublicoExternoAtendente(client, telefone, dadosUsuario); break;
            case '5': await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); break;
            default: await client.sendMessage(telefone, 'Opção inválida. ❌'); break;
        }
        return;
    }

    // SWITCH: CONTROLADOR CURSOS DISPONÍVEIS
    if (estagioAtual === 'menu_publico_externo_cursos') {
        switch (textoUsuario) {
            case '1': await exibirCursosTecnicos(client, telefone, dadosUsuario); break;
            case '2': await exibirCursosEmiep(client, telefone, dadosUsuario); break;
            case '3': await exibirCursosFic(client, telefone, dadosUsuario); break;
            case '4': await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); break;
            default: await client.sendMessage(telefone, 'Opção inválida. ❌'); break;
        }
        return;
    }

    // SWITCH: CONTROLADOR FINAL DE INSCRIÇÕES (NÍVEL 4)
    if (estagioAtual === 'cursos_tecnicos' || estagioAtual === 'cursos_emiep' || estagioAtual === 'cursos_fic') {
        switch (textoUsuario) {
            case '1': await client.sendMessage(telefone, 'Inscrição iniciada! 🚀 Acesse o link oficial para concluir: [LINK_AQUI]'); break;
            case '2': await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); break;
            default: await client.sendMessage(telefone, 'Opção inválida. Digite 1 para Inscrição ou 2 para Voltar. ❌'); break;
        }
        return;
    }

    // SWITCH: MATRÍCULA, EVENTOS E ATENDENTE DO PÚBLICO EXTERNO
    if (estagioAtual === 'menu_publico_externo_matricula' || estagioAtual === 'menu_publico_externo_atendente') {
        switch (textoUsuario) {
            case '1': await client.sendMessage(telefone, 'Entendido! Um atendente da secretaria foi notificado e entrará em contato em breve. 👤'); break;
            case '2': await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); break;
            default: await client.sendMessage(telefone, 'Opção inválida. ❌'); break;
        }
        return;
    }
    if (estagioAtual === 'menu_publico_externo_eventos') {
        if (textoUsuario === '1') { await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); }
        else { await client.sendMessage(telefone, 'Opção inválida. Digite 1 para Voltar. ❌'); }
        return;
    }

    // SWITCH: CONTROLADOR ALUNO CEDUP
    if (estagioAtual === 'menu_aluno_cedup') {
        switch (textoUsuario) {
            case '1': await exibirMenuAlunoEventos(client, telefone, dadosUsuario); break;
            case '2': await exibirMenuAlunoInfraestrutura(client, telefone, dadosUsuario); break;
            case '3': await exibirMenuAlunoDocumentos(client, telefone, dadosUsuario); break;
            case '4': await client.sendMessage(telefone, 'Chamando o suporte ao aluno interno. Por favor, aguarde... ⏳'); break;
            case '5': await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); break;
            default: await client.sendMessage(telefone, 'Opção inválida. ❌'); break;
        }
        return;
    }

    // SWITCH: INFRA E DOCUMENTOS DO ALUNO
    if (estagioAtual === 'aluno_infraestrutura' || estagioAtual === 'aluno_documentos') {
        switch (textoUsuario) {
            case '1': await client.sendMessage(telefone, 'Conectando você ao responsável pelo setor... Por favor, aguarde. 🤝'); break;
            case '2': await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); break;
            default: await client.sendMessage(telefone, 'Opção inválida. ❌'); break;
        }
        return;
    }
    if (estagioAtual === 'aluno_eventos') {
        if (textoUsuario === '1') { await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); }
        else { await client.sendMessage(telefone, 'Opção inválida. Digite 1 para Voltar. ❌'); }
        return;
    }

    // SWITCH: CONTROLADOR EX-ALUNO
    if (estagioAtual === 'menu_ex_aluno_cedup') {
        switch (textoUsuario) {
            case '1': await iniciarColetaDiploma(client, telefone, dadosUsuario); break;
            case '2': await exibirMenuExAlunoAtendente(client, telefone, dadosUsuario); break;
            case '3': await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); break;
            default: await client.sendMessage(telefone, 'Opção inválida. ❌'); break;
        }
        return;
    }
    if (estagioAtual === 'ex_aluno_atendente') {
        if (textoUsuario === '1') { await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); }
        else { await client.sendMessage(telefone, 'Opção inválida. Digite 1 para Voltar. ❌'); }
        return;
    }

    // ==========================================
    // FLUXO DE COLETA: SOLICITAÇÃO DE DIPLOMA
    // ==========================================
    if (estagioAtual === 'solicitar_diploma_nome') {
        dadosUsuario.dadosDiploma.nome = msg.body.trim(); // Salva com maiúsculas para ficar bonito
        dadosUsuario.estagio = 'solicitar_diploma_cpf';
        await client.sendMessage(telefone, 'Obrigado! Agora, por favor, digite o seu **CPF** (apenas números):');
        return;
    }

    if (estagioAtual === 'solicitar_diploma_cpf') {
        dadosUsuario.dadosDiploma.cpf = textoUsuario; 
        dadosUsuario.estagio = 'solicitar_diploma_curso';
        await client.sendMessage(telefone, 'Ótimo! Agora, por favor, digite o nome do curso que você concluiu:');
        return;
    }

    if (estagioAtual === 'solicitar_diploma_curso') {
        dadosUsuario.dadosDiploma.curso = msg.body.trim(); 
        dadosUsuario.estagio = 'solicitar_diploma_ano';
        await client.sendMessage(telefone, 'Quase lá! Por último, digite o ano de conclusão do curso:');
        return;
    }

    if (estagioAtual === 'solicitar_diploma_ano') {
        dadosUsuario.dadosDiploma.anoConclusao = textoUsuario; 
        dadosUsuario.estagio = 'solicitar_diploma_confirmacao';
        const resumo = `Confirme se os seus dados estão corretos para enviar a solicitação do diploma:\n\n` +
            `**Nome:** ${dadosUsuario.dadosDiploma.nome}\n` +
            `**CPF:** ${dadosUsuario.dadosDiploma.cpf}\n` +
            `**Curso:** ${dadosUsuario.dadosDiploma.curso}\n` +
            `**Ano de Conclusão:** ${dadosUsuario.dadosDiploma.anoConclusao}\n\n` +
            `Os dados estão corretos?\n` +
            `1️⃣ - Sim, enviar solicitação\n` +
            `2️⃣ - Não, corrigir dados (Reiniciar)`;

        await client.sendMessage(telefone, resumo);
        return;
    }

    if (estagioAtual === 'solicitar_diploma_confirmacao') {
        if (textoUsuario === '1') {
            dadosUsuario.estagio = 'menu_principal'; 
            // 📊 GRAVAÇÃO NA PLANILHA (CSV)
            const nomePlanilha = 'solicitacoes_diploma.csv';
            
            // 1. Prepara a linha com os dados (usamos ponto e vírgula ";" para o Excel brasileiro separar as colunas direto)
            const dataAtual = new Date().toLocaleString('pt-BR');
            const novaLinha = `"${dadosUsuario.dadosDiploma.nome}";"${dadosUsuario.dadosDiploma.cpf}";"${dadosUsuario.dadosDiploma.curso}";"${dadosUsuario.dadosDiploma.anoConclusao}";"${dataAtual}"\n`;

            // 2. Se a planilha não existir, cria com o cabeçalho primeiro
            if (!fs.existsSync(nomePlanilha)) {
                const cabecalho = "Nome Completo;CPF;Curso Concluído;Ano de Conclusão;Data da Solicitação\n";
                fs.writeFileSync(nomePlanilha, cabecalho, 'utf-8');
            }
            
            // 3. Adiciona a nova linha ao final do arquivo (append)
            fs.appendFileSync(nomePlanilha, novaLinha, 'utf-8');
            console.log(`[PLANILHA] Dados de ${dadosUsuario.dadosDiploma.nome} salvos com sucesso!`);
            // ========================================================

            await client.sendMessage(telefone, '✅ Solicitação enviada com sucesso para a secretaria! Seu protocolo foi gerado. Você receberá um retorno em breve.');
            
            // Limpa os dados temporários da memória
            delete dadosUsuario.dadosDiploma;
        } else if (textoUsuario === '2') {
            await client.sendMessage(telefone, '🔄 Vamos recomeçar.');
            await iniciarColetaDiploma(client, telefone, dadosUsuario);
        } else {
            await client.sendMessage(telefone, 'Opção inválida. Digite 1 para Confirmar ou 2 para Recomeçar. ❌');
        }
        return;
    }

    // SWITCH: CONTROLADOR RESPONSÁVEL POR ALUNO
    if (estagioAtual === 'menu_responsavel') {
        switch (textoUsuario) {
            case '1': await exibirMenuRespOrientacao(client, telefone, dadosUsuario); break;
            case '2': await exibirMenuRespSaida(client, telefone, dadosUsuario); break;
            case '3': await exibirMenuRespAtendente(client, telefone, dadosUsuario); break;
            case '4': await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); break;
            default: await client.sendMessage(telefone, 'Opção inválida. ❌'); break;
        }
        return;
    }
    
    if (estagioAtual === 'resp_orientacao' || estagioAtual === 'resp_atendente') {
        if (textoUsuario === '1') { await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); }
        else { await client.sendMessage(telefone, 'Opção inválida. Digite 1 para Voltar. ❌'); }
        return;
    }

    // ========================================================
    // FLUXO: SÁIDA ANTECIPADA - AGUARDANDO FOTO DO DOCUMENTO
    // ========================================================
    if (estagioAtual === 'saida_antecipada_doc') {
        if (msg.hasMedia || msg.type === 'image') {
            try {
                console.log("[SISTEMA] Baixando mídia... Por favor, aguarde.");
                await new Promise(resolve => setTimeout(resolve, 2000)); 
                
                const midia = await msg.downloadMedia();
                if (!midia || !midia.data) {
                    throw new Error("Mídia veio vazia ou corrompida.");
                }

                const nomePasta = './documentos_recebdidos';
                if (!fs.existsSync(nomePasta)) {
                    fs.mkdirSync(nomePasta, { recursive: true });
                }

                const nomeArquivo = `doc_${telefone.replace(/[^0-9]/g, '')}_${Date.now()}.png`;
                
                fs.writeFileSync(`${nomePasta}/${nomeArquivo}`, midia.data, { encoding: 'base64' });
                console.log(`[ARQUIVO] Foto salva com sucesso em: ${nomePasta}/${nomeArquivo}`);

                dadosUsuario.estagio = 'saida_antecipada_fim';

                const contato = await msg.getContact();
                const nomeUsuario = contato.pushname || "Responsável";

                const textoSucesso = `✅ Documento recebido, *${nomeUsuario}*! A solicitação de saída antecipada foi registrada e será analisada pela equipe.\n\n` +
                    `⏱️ Aguarde o retorno da secretaria em breve.\n\n` +
                    `----------------------------------\n` +
                    `Digite a opção desejada:\n` +
                    `1️⃣ - Falar com atendente 🤝\n` +
                    `2️⃣ - Voltar ao menu principal 🏠`;

                await client.sendMessage(telefone, textoSucesso);
                
            } catch (erro) {
                console.error("Erro ao baixar arquivo:", erro);
                await client.sendMessage(telefone, '❌ Desculpe, houve um erro ao processar sua foto. Por favor, tente enviar novamente.');
            }
        } else {
            await client.sendMessage(telefone, '⚠️ Por favor, envie uma **FOTO** nítida do seu documento (RG ou CNH) para podermos prosseguir.');
        }
        return;
    }

    // CONTROLADOR DO MENU FINAL DA SAÍDA ANTECIPADA
    if (estagioAtual === 'saida_antecipada_fim') {
        switch (textoUsuario) {
            case '1':
                await client.sendMessage(telefone, 'Conectando à Equipe de Orientadores... 🕒');
                break;
            case '2':
                await client.sendMessage(telefone, 'Voltando ao menu principal... 🏠');
                await exibirMenuPrincipal(client, telefone, dadosUsuario);
                break;
            default:
                await client.sendMessage(telefone, 'Opção inválida. Digite 1 para Falar com atendente ou 2 para Voltar ao menu.');
                break;
        }
        return;
    }

    // SWITCH: CONTROLADOR CEJA
    if (estagioAtual === 'menu_ceja') {
        switch (textoUsuario) {
            case '1': await client.sendMessage(telefone, 'Transferindo para a Central de Atendimento do CEJA... Aguarde um momento. 🏢'); break;
            case '2': await client.sendMessage(telefone, 'Voltando... ⬅️'); await dadosUsuario.menuAnterior(); break;
            default: await client.sendMessage(telefone, 'Opção inválida. ❌'); break;
        }
        return;
    }
});

// Inicializa o bot e conecta ao WhatsApp
client.initialize();