import Fastify from "fastify";
import amqp from "amqplib";

const app = Fastify();
const PORT = 3002;
let channel, connection;

await app.listen({ port: PORT });
console.log("Server running at http://localhost:" + PORT);