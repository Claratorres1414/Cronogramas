import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const moduleMappings = [
    {
        module: "Arquitetura e setup geral",
        codes: ["F1-01", "F1-02", "F1-03", "F1-04", "F1-05", "F1-06"]
    },
    {
        module: "Padrões de API e erros",
        codes: ["F1-07", "F1-08", "F1-09"]
    },
    {
        module: "Frontend base",
        codes: ["F1-10", "F1-11"]
    },
    {
        module: "Pesquisa e decisões técnicas",
        codes: ["F1-12", "F1-13"]
    },

    // FASE 2
    {
        module: "Login com senha",
        codes: ["F2-01", "F2-02", "F2-03", "F2-04", "F2-05"]
    },
    {
        module: "Passkeys / WebAuthn",
        codes: ["F2-06", "F2-07", "F2-08"]
    },
    {
        module: "TOTP / 2FA",
        codes: ["F2-09", "F2-10", "F2-11"]
    },
    {
        module: "JWT — configuração básica",
        codes: ["F2-12", "F2-13", "F2-14"]
    },
    {
        module: "JWT — invalidação e rotação",
        codes: ["F2-15", "F2-16", "F2-17"]
    },

    // FASE 3
    {
        module: "Assinatura digital",
        codes: ["F3-01", "F3-02", "F3-03", "F3-04", "F3-05"]
    },
    {
        module: "Validação de uploads e sandbox",
        codes: ["F3-06", "F3-07", "F3-08"]
    },
    {
        module: "Verificação pública de autenticidade",
        codes: ["F3-09", "F3-10"]
    },
    {
        module: "Frontend — assinatura e verificação",
        codes: ["F3-11", "F3-12", "F3-13"]
    },

    // FASE 4
    {
        module: "CORS",
        codes: ["F4-01", "F4-02"]
    },
    {
        module: "Security headers",
        codes: ["F4-03", "F4-04"]
    },
    {
        module: "CSRF",
        codes: ["F4-05", "F4-06"]
    },
    {
        module: "Auditoria e sessões",
        codes: ["F4-07", "F4-08", "F4-09"]
    },
    {
        module: "Revisão cruzada de segurança",
        codes: ["F4-10", "F4-11"]
    },

    // FASE 5
    {
        module: "Testes automatizados",
        codes: ["F5-01", "F5-02", "F5-03"]
    },
    {
        module: "Pentest e performance",
        codes: ["F5-04", "F5-05", "F5-06"]
    },
    {
        module: "Documentação e entrega",
        codes: ["F5-07", "F5-08", "F5-09"]
    }
];

async function main() {

    for (const item of moduleMappings) {
        await prisma.ticket.updateMany({
            where: {
                code: {
                    in: item.codes
                }
            },
            data: {
                module: item.module
            }
        });

        console.log(`✔ ${item.module}`);
    }

    console.log("Todos os módulos atualizados.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });