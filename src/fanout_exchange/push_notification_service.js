const amqp = require("amqplib");

async function pushNotificationService(){
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const exchange = "new_product_launch";
        const exchangeType = "fanout";

        

        await channel.assertExchange(exchange, exchangeType, { durable: true });

        // Create a temporary queue for the SMS notification service
        const queue = await channel.assertQueue("", {exclusive: true});
        console.log("waiting for messages in queue:", queue);
        await channel.bindQueue(queue.queue, exchange, "");


        channel.consume(queue.queue, (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                console.log("Received SMS notification:", message);
                channel.ack(msg);
            }
        }); 

    }catch(err){
        console.log(err);
    }
}


pushNotificationService();