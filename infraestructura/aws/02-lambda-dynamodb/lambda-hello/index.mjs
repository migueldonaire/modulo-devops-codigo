// AWS llama a "handler" cada vez que se ejecuta la Lambda.
// "event" son los datos que le llegan.
export const handler = async (event) => {
  // Sale en los logs (CloudWatch en AWS, la respuesta del invoke en el emulador)
  console.log("Event received:", JSON.stringify(event));

  // Si el evento no trae "name", usamos "persona"
  const name = event.name ?? "persona";

  // Lo que devolvemos es la respuesta de la Lambda
  return { message: `Hola, ${name}` };
};
