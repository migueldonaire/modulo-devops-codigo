// SOLUCIÓN de los ejercicios 10, 11 y 12: body no JSON (400), ?author= y PUT /books/:id

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

  // GET /books -> todos los libros (o solo los de un autor)
  if (method === "GET" && !id) {
    const result = await db.send(new ScanCommand({ TableName: TABLE }));
    const author = event.queryStringParameters?.author;

    // Sin filtro: todos
    if (!author) {
      return reply(200, result.Items);
    }

    // Con filtro: solo los de ese autor
    const filtered = result.Items.filter((book) => book.author === author);
    return reply(200, filtered);
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
    // El body llega como texto: lo convertimos a objeto.
    // Si no es JSON, respondemos 400
    let data;
    try {
      data = JSON.parse(event.body ?? "{}");
    } catch {
      return reply(400, { error: "Body is not valid JSON" });
    }
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

  // PUT /books/:id -> sustituir el libro entero
  if (method === "PUT" && id) {
    const data = JSON.parse(event.body ?? "{}");
    if (!data.title || !data.author || typeof data.price !== "number") {
      return reply(400, { error: "title, author and price are required" });
    }

    // ¿Existe?
    const existing = await db.send(new GetCommand({ TableName: TABLE, Key: { id } }));
    if (!existing.Item) {
      return reply(404, { error: "Book not found" });
    }

    // Mismo id, datos nuevos
    const book = { id, title: data.title, author: data.author, price: data.price };
    await db.send(new PutCommand({ TableName: TABLE, Item: book }));
    return reply(200, book);
  }

  // Cualquier otra combinación: método no permitido
  return reply(405, { error: "Method not allowed" });
};
