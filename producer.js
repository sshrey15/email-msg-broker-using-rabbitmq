const amqp = require("amqplib");

async function sendMail() {
  try {
    // Establish connection and channel 
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    // Define exchange, routing_keys
    const exchange = "mail_exchange";
    const routingKeyForSubUser = "sub_user_routing_key";
    const routingKeyForNormalUser = "normal_user_routing_key";

    // Create a message object
    const message = {
      to: "shrey@gmail.com",
      from: "stud22.sks2@gec.ac.in",        
      subject: "Test Email 2",
      body: "This is a test email sent from RabbitMQ producer. part2 ",
    };
    

    //Create an exchange 
    await channel.assertExchange(exchange, "direct", { durable: true });

    // Define queues for sub_user and normal_user
    const sub_queue = "sub_user_mail_queue";
    const normal_queue = "user_mail_queue";

    // Create queues and bind them to the exchange with routing keys
    await channel.assertQueue(sub_queue, { durable: true });
    await channel.assertQueue(normal_queue, { durable: true });
         
    await channel.bindQueue(sub_queue, exchange, routingKeyForSubUser);
    await channel.bindQueue(normal_queue, exchange, routingKeyForNormalUser);

    // Publish the message to the exchange with the appropriate routing key
    const sent = channel.publish(
      exchange,
      routingKeyForNormalUser,
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
