const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const ticketRoutes = require("./routes/ticketRoutes");

app.use(cors());
app.use(express.json());
app.use("/tickets", ticketRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Cryptowl API running"
    });
});

app.get("/tickets", async (req, res) => {
    const tickets = await prisma.ticket.findMany();
    res.json(tickets);
});

app.get("/tickets/phase/:phase", async (req, res) => {
    const tickets = await prisma.ticket.findMany({
        where: { phase: req.params.phase }
    });

    res.json(tickets);
});

app.post("/tickets", async (req, res) => {
    const ticket = await prisma.ticket.create({
        data: req.body
    });

    res.json(ticket);
});

app.patch("/tickets/:id/complete", async (req, res) => {
    const ticket = await prisma.ticket.update({
        where: { id: Number(req.params.id) },
        data: { completed: true }
    });

    res.json(ticket);
});

app.listen(3000, () => {
    console.log("API rodando em http://localhost:3000");
});