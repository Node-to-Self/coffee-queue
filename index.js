import Fastify from "fastify";
import formbody from "@fastify/formbody";

const app = Fastify();
const PORT = 3000;

await app.register(formbody);

app.post("/slow-order", async (request, reply) => {
    const { drinkOrder } = request.body;
    for (let i = 0; i < 10000000000; i++) { }
    console.log("ORDER PLACED");
    reply.send(`Drink order added to queue: ${drinkOrder}`);
});

await app.listen({ port: PORT });

console.log(`Server listening on http://localhost:${PORT}`);