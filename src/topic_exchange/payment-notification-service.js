const amqp = require("amqplib");

async function receiveMessages(){
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const exchange = "notification_exchange";
        const queue = "payment_notification_queue";

        await channel.assertExchange(exchange, "topic", { durable: true });
        await channel.assertQueue(queue, { durable: true });

        await channel.bindQueue(queue, exchange, "payment.*");
        
        console.log("Waiting for messages in queue:", queue);   

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                console.log("Received message:", message);
                channel.ack(msg);
            }
        });

    
    }catch(err){
        console.log(err);
    }
}

receiveMessages();