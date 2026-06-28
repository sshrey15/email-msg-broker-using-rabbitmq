const amqp = require("amqplib");

async function announcenNewProduct(product) {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();

    const exchange = "new_product_launch";
    const exchangeType = "fanout";
    await channel.assertExchange(exchange, exchangeType, { durable: true });
    
    const message = JSON.stringify(product);

    channel.publish(exchange, "", Buffer.from(message), { persistent: true });
    console.log("New product announcement sent:", message);

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.log(err);
  }
}

data ={
    productId: "P12345",
    productName: "New Product",
    launchDate: "2024-06-15",
    description: "This is a new product launch announcement."
}

announcenNewProduct(data);
