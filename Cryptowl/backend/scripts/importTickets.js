const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");

const prisma = require("../src/lib/prisma");

async function run() {
    const htmlPath = path.join(
        __dirname,
        "../../frontend/index.html"
    );

    const html = fs.readFileSync(htmlPath, "utf-8");

    const $ = cheerio.load(html);

    const tickets = [];

    $(".ticket").each((_, element) => {
        const ticket = $(element);

        const code = ticket
            .find(".ticket-id")
            .text()
            .split("·")[0]
            .trim();

        const title = ticket
            .find(".ticket-title")
            .text()
            .trim();

        const description = ticket
            .find(".ticket-desc")
            .text()
            .trim();

        const weightText = ticket
            .find(".weight-badge")
            .text();

        const weightMatch = weightText.match(/\d+/);

        const weight = weightMatch
            ? parseInt(weightMatch[0])
            : 1;

        const phaseClass = ticket
            .attr("class")
            .split(" ")
            .find(cls => cls.startsWith("p"));

        tickets.push({
            code,
            title,
            description,
            phase: phaseClass,
            weight
        });
    });

    console.log(`Encontrados ${tickets.length} tickets`);

    for (const ticket of tickets) {
        await prisma.ticket.upsert({
            where: {
                code: ticket.code
            },
            update: ticket,
            create: ticket
        });
    }

    console.log("Importação concluída");

    await prisma.$disconnect();
}

run();