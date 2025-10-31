import Fastify from "fastify";
import formbody from "@fastify/formbody";

import { createClient } from "redis";

const subscriber = createClient();
await subscriber.connect();

const publisher = createClient();
await publisher.connect();

let connection;

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


app.post("/order", async (request, reply) => {
    const { drinkOrder } = request.body;
    coffeeQueue.push(drinkOrder);
    console.log(coffeeQueue.length);
    reply.send("Drink order added to queue");
});

app.get("/process-order", async (request, reply) => {
    const nextOrder = coffeeQueue.shift();
    if (nextOrder) {
        reply.send({ order: nextOrder });
    } else {
        reply.send("No drink orders in queue");
    }
});

app.get("/order-count", async (request, reply) => {
    reply.send(`${coffeeQueue.length} drink orders in queue`);
});

await subscriber.subscribe("drink-order", (drinkOrder) => {
    console.log(`Received a new ${drinkOrder} order.`);
});

async function connect() {
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel();
        await channel.assertQueue("drink-order");
    } catch (err) {
        console.error(err);
    }
}

async function sendOrderData(data) {
 await channel.sendToQueue("drink-order", Buffer.from(JSON.stringify(data)));
}