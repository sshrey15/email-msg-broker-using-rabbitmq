const amqp = require("amqplib");

async function receieveNewVideoNotification() {
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers"

        await channel.assertExchange(exchange, exchangeType, { durable: true });
        

        const q = await channel.assertQueue("", {exclusive: true})
        console.log("Waiting for new streaming notifications...");

        await channel.bindQueue(q.queue, exchange, "", {
            "x-match": "all",
            "notification-type": "live_stream",
            "content-type": "video/avi"
        });

        channel.consume(q.queue, (msg) => {
            if(msg.content){
                const messageContent = msg.content.toString();
                console.log("Received new live_stream notification:", messageContent);
                channel.ack(msg);
            }   
        })
    }catch(err){
        console.log(err);
    }
}

receieveNewVideoNotification(); 