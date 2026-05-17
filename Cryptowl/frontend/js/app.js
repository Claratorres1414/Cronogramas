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
            weeks: "Semanas 1–2"
        },

        p2: {
            tag: "Fase 2",
            title: "Autenticação completa",
            milestone: "M2",
            weeks: "Semanas 3–6"
        },

        p3: {
            tag: "Fase 3",
            title: "Core do produto — assinatura e verificação de PDFs",
            milestone: "M3",
            weeks: "Semanas 7–10"
        },

        p4: {
            tag: "Fase 4",
            title: "Hardening de segurança",
            milestone: "M4",
            weeks: "Semanas 11–13"
        },

        p5: {
            tag: "Fase 5",
            title: "Qualidade, testes e entrega",
            milestone: "M5",
            weeks: "Semanas 14–16"
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

        main.appendChild(section);
    });
}

loadTickets();

window.filter = filter;
countTickets();