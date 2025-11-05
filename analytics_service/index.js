import Fastify from "fastify";
import amqp from "amqplib";

const app = Fastify();
const PORT = 3002;
let channel, connection;

await app.listen({ port: PORT });
console.log("Server running at http://localhost:" + PORT);

async function connect() {
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel = await connection.createChannel();
        await channel.assertQueue("drink-order");
    } catch (err) {
        console.error(err);
    }
}

const drinkMap = { latte: 0, coffee: 0, cappuccino: 0 };
await channel.assertQueue("analytics");

channel.consume("analytics", (data) => {
    const { content } = data;
    const { order, customer } = JSON.parse(content.toString());
    if (drinkMap[order] !== undefined) {
        drinkMap[order]++;
    }
    console.log(`${order} being analyzed for ${customer}`);
    channel.ack(data);
});