const amqp = require("amqplib");

async function receieveNewVideoNotification() {
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers"

        await channel.assertExchange(exchange, exchangeType, { durable: true });
        

        const q = await channel.assertQueue("", {exclusive: true})
        console.log("Waiting for new video notifications...");

        await channel.bindQueue(q.queue, exchange, "", {
            "x-match": "all",
            "notification-type": "new_video",
            "content-type": "video/mp4"
        });

        channel.consume(q.queue, (msg) => {
            if(msg.content){
                const messageContent = msg.content.toString();
                console.log("Received new video  notification:", messageContent);
                channel.ack(msg);
            }   
        })
    }catch(err){
        console.log(err);
    }
}

receieveNewVideoNotification(); 