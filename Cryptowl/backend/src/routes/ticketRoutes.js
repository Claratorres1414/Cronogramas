const express = require("express");
const prisma = require("../lib/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
    const tickets = await prisma.ticket.findMany({
        orderBy: {
            id: "asc"
        }
    });

    res.json(tickets);
});

module.exports = router;