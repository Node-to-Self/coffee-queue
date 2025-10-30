import Fastify from "fastify";
import amqp from "amqplib";

const app = Fastify();
const PORT = 3001;
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