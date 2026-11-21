// Herramientas de AWS para hablar con DynamoDB (ya vienen instaladas en Lambda)
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
// Para generar ids únicos, como en la API de libros
import { randomUUID } from "node:crypto";

// Cliente de DynamoDB: se crea UNA vez, fuera del handler
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
// Nombre de la tabla que hemos creado
const TABLE = "books";

// Pequeña ayuda para responder siempre igual: código HTTP + JSON
function reply(statusCode, data) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

// Lambda llama a esta función en cada petición
export const handler = async (event) => {
  // Método HTTP: GET, POST, DELETE...
  const method = event.requestContext.http.method;
  // Ruta pedida, partida en trozos: "/books/abc" -> ["books", "abc"]
  const parts = event.rawPath.split("/").filter(Boolean);
  // El id es el segundo trozo (si existe)
  const id = parts[1];

  // Solo atendemos rutas que empiezan por /books
  if (parts[0] !== "books") {
    return reply(404, { error: "Route not found" });
  }

  // GET /books -> todos los libros
  if (method === "GET" && !id) {
    const result = await db.send(new ScanCommand({ TableName: TABLE }));
    return reply(200, result.Items);
  }

  // GET /books/:id -> un libro
  if (method === "GET" && id) {
    const result = await db.send(new GetCommand({ TableName: TABLE, Key: { id } }));
    if (!result.Item) {
      return reply(404, { error: "Book not found" });
    }
    return reply(200, result.Item);
  }

  // POST /books -> crear un libro
  if (method === "POST" && !id) {
    // El body llega como texto: lo convertimos a objeto
    const data = JSON.parse(event.body ?? "{}");
    // Título, autor y precio son obligatorios
    if (!data.title || !data.author || typeof data.price !== "number") {
      return reply(400, { error: "title, author and price are required" });
    }
    const book = {
      id: randomUUID(),
      title: data.title,
      author: data.author,
      price: data.price,
    };
    await db.send(new PutCommand({ TableName: TABLE, Item: book }));
    return reply(201, book);
  }

  // DELETE /books/:id -> borrar un libro y devolverlo
  if (method === "DELETE" && id) {
    const result = await db.send(
      new DeleteCommand({ TableName: TABLE, Key: { id }, ReturnValues: "ALL_OLD" })
    );
    if (!result.Attributes) {
      return reply(404, { error: "Book not found" });
    }
    return reply(200, result.Attributes);
  }

  // Cualquier otra combinación: método no permitido
  return reply(405, { error: "Method not allowed" });
};
