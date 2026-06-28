const amqp = require("amqplib");

async function sendMessage(routingKey, message) {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const exchange = "notification_exchange";
    await channel.assertExchange(exchange, "topic", { durable: true });

    const sent = channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(message)),
    );
    console.log("message sent to queue:", message);

    setTimeout(() => {
      channel.close();
      connection.close();
    }, 500);
  } catch (err) {
    console.log(err);
  }
}

sendMessage("payment.placed", {
  orderId: "12345",
  customerName: "John Doe",
  totalAmount: 99.99,
  status: "placed",
});
sendMessage("order.completed", {
  orderId: "12345",
  customerName: "shrey Doe",
  totalAmount: 99.99,
  status: "completed",
});
