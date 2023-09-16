import { fastify } from "fastify";
//import { DatabaseMemory } from "./database-memory.js";
//import { request } from "http";
import { DatabasePostgres } from "./database-postgres.js";

const server = fastify();

// Criando rota
// Quando for solicitado a raiz da aplicação "localhost:3333/" apresentar a mensagem...

//const database = new DatabaseMemory();
const database = new DatabasePostgres();

//request Body ( para os metodos POST e PUT)

server.post("/videos", async (request, reply) => {
  //const body = request.body;
  //console.log(body);

  //desestrutura-lo
  const { title, description, duration } = request.body;

  //o padrao do fastify é replay e não response.
  //return "Aló Mundo!";
  await database.create({
    title,
    description,
    duration,
  });

  //console.log(database.list());

  return reply.status(201).send();
  //o status code 201 quer dizer que algo foi criado.
});

//rota para listagem
server.get("/videos", async (request) => {
  const search = request.query.search;
  //console.log(search);
  const videos = await database.list(search);
  //console.log(videos);
  return videos;
});

// Alterar
server.put("/videos/:id", async (request, reply) => {
  const videoId = request.params.id;
  const { title, description, duration } = request.body;

  await database.update(videoId, {
    title,
    description,
    duration,
  });
  return reply.status(204).send();
});

server.delete("/videos/:id", async (request, reply) => {
  const videoId = request.params.id;

  await database.delete(videoId);

  return reply.status(204).send();
});

server.listen({
  host: "0.0.0.0",
  port: process.env.PORT ?? 3333,
});
