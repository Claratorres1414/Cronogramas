const API_URL = "http://localhost:3000/tickets";

function filter(phase) {
    document.querySelectorAll('.pnav').forEach(b => b.classList.remove('active'));
    if (phase === 'all') {
        document.querySelector('.pnav.all').classList.add('active');
        document.querySelectorAll('.phase-section').forEach(s => s.classList.remove('hidden'));
    } else {
        document.querySelector('.pnav.' + phase).classList.add('active');
        document.querySelectorAll('.phase-section').forEach(s => {
            s.classList.toggle('hidden', !s.classList.contains(phase));
        });
    }
}

function countTickets() {
    const map = { p1:'c1', p2:'c2', p3:'c4', p4:'c5', p5:'c6' };
    ['p1','p2','p3','p4','p5'].forEach(p => {
        const n = document.querySelectorAll('#phase-' + p + ' .ticket').length;
        const el = document.getElementById(map[p]);
        if (el) el.textContent = n;
    });
}

async function loadTickets() {
    try {
        const response = await fetch(API_URL);
        const tickets = await response.json();

        renderTickets(tickets);
    } catch (error) {
        console.error("Erro ao carregar tickets:", error);
    }
}

function renderTickets(tickets) {
    const main = document.getElementById("main");

    const phases = {
        p1: {
            tag: "Fase 1",
            title: "Fundação e infraestrutura",
            milestone: "M1",
            weeks: "Semana 1",

            calloutLabel: "✓ milestone M1 — entrega ao final da semana 1",
            calloutText: "API em /api/v1/ respondendo com erros padronizados · banco com schema inicial migrado · frontend com rotas e contexto de auth · spikes documentados desbloqueando fases seguintes."
        },

        p2: {
            tag: "Fase 2",
            title: "Autenticação completa",
            milestone: "M2",
            weeks: "Semana 2",

            calloutLabel: "⬡ sincronização obrigatória — semana 2",
            calloutText: "Validar fluxo completo integrado: registro → ativação 2FA + QR code → login (senha + TOTP) → JWT emitido → refresh automático → logout com denylist. Nenhuma Fase 3 começa sem esse fluxo validado pelos três engenheiros."
        },

        p3: {
            tag: "Fase 3",
            title: "Core do produto — assinatura e verificação de PDFs",
            milestone: "M3",
            weeks: "Semana 3",

            calloutLabel: "⬡ sincronização obrigatória — semana 3",
            calloutText: "Teste end-to-end: usuário autenticado faz upload → posiciona selo → assina → baixa PDF. Sem login, carrega o mesmo PDF em /verificar → resultado \"íntegro\". Alterar 1 byte do PDF e verificar novamente → resultado \"adulterado\". Testar PDF com JS → deve ser rejeitado na entrada."
        },

        p4: {
            tag: "Fase 4",
            title: "Hardening de segurança",
            milestone: "M4",
            weeks: "Semana 4",

            calloutLabel: "✓ milestone M4 — entrega ao final da semana 4",
            calloutText: "Score A+ no SecurityHeaders.com · audit log registrando todos os eventos obrigatórios · painel de sessões com revogação funcionando · CSRF protection testada manualmente."
        },

        p5: {
            tag: "Fase 5",
            title: "Qualidade, testes e entrega",
            milestone: "M5",
            weeks: "Semana 5",

            calloutLabel: "✓ milestone M5 — entrega final semana 5",
            calloutText: "100% dos requisitos implementados e verificados · pentest realizado sem vulnerabilidades críticas abertas · testes E2E passando no CI · documentação completa e .env.example revisado."
        }
    };

    main.innerHTML = "";

    Object.entries(phases).forEach(([phaseKey, phase]) => {

        const phaseTickets = tickets.filter(
            ticket => ticket.phase === phaseKey
        );

        if (!phaseTickets.length) return;

        // agrupamento por módulo
        const groupedModules = {};

        phaseTickets.forEach(ticket => {
            const moduleName = ticket.module || "Sem módulo";

            if (!groupedModules[moduleName]) {
                groupedModules[moduleName] = [];
            }

            groupedModules[moduleName].push(ticket);
        });

        const section = document.createElement("div");
        section.className = `phase-section ${phaseKey}`;
        section.id = `phase-${phaseKey}`;

        section.innerHTML = `
            <div class="phase-heading">
                <span
                    class="phase-tag"
                    style="
                        color: var(--${phaseKey}-accent);
                        border-color: var(--${phaseKey}-border);
                        background: var(--${phaseKey}-bg);
                    "
                >
                    ${phase.tag}
                </span>
                
                <span class="phase-title-text">${phase.title}</span>
                
                <span
                    class="milestone-badge"
                    style="
                        color: var(--${phaseKey}-accent);
                        border-color: var(--${phaseKey}-border);
                        background: var(--${phaseKey}-bg);
                    "
                >
                    ${phase.milestone}
                </span>
                <span class="phase-weeks">
                    ${phase.weeks}
                </span>
            </div>
        `;

        Object.entries(groupedModules).forEach(([moduleName, moduleTickets]) => {

            const moduleEl = document.createElement("div");
            moduleEl.className = "module-group";

            moduleEl.innerHTML = `
                <div class="module-label">
                    ${moduleName}
                </div>

                <div class="ticket-grid">
                    ${moduleTickets.map(ticket => `
                        <div class="ticket ${phaseKey}">
                            <div class="ticket-top">
                                <span class="ticket-id">
                                    ${ticket.code}
                                </span>

                                <span class="weight-badge w${ticket.weight}">
                                    peso ${ticket.weight}
                                </span>
                            </div>

                            <div class="ticket-title">
                                ${ticket.title}
                            </div>

                            <div class="ticket-desc">
                                ${ticket.description}
                            </div>

                            <div class="ticket-footer">
                                <div class="tag-list">
                                    ${(ticket.tags || []).map(tag =>
                `<span class="tag">${tag}</span>`
            ).join("")}
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            `;

            section.appendChild(moduleEl);
        });

        const callout = document.createElement("div");

        callout.className = "sync-callout";

        callout.style.background = `var(--${phaseKey}-bg`;
        callout.style.borderColor = `var(--${phaseKey}-accent`;

        callout.innerHTML = `
            <div
                class="sc-label"
                style="color: var(--${phaseKey}-accent)"
            >
                ${phase.calloutLabel}
            </div>
            
            <p>
                ${phase.calloutText}
            </p>
        `;

        section.appendChild(callout)
        main.appendChild(section);
    });
}

loadTickets();

window.filter = filter;
countTickets();