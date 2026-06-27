const amqp = require("amqplib");

async function sendMail() {
  try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();

    const exchange = "mail_exchange";
    const routingKey = "mail_routing_key";

    const queue = "mail_queue";
    const message = {
      to: "ruhi@gmail.com",
      from: "stud22.sks2@gec.ac.in",
      subject: "Test Email",
      body: "This is a test email sent from RabbitMQ producer.",
    };

    await channel.assertExchange(exchange, "direct", { durable: true });
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, exchange, routingKey);

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

sendMail();
