const amqp = require("amqplib");

async function sendNotifications(headers, message){
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const exchange = "header_exchange"
        const exchangeType = "headers"
        
        await channel.assertExchange(exchange, exchangeType, { durable: true });

        channel.publish(exchange, "", Buffer.from(JSON.stringify(message)), {
            headers: headers,
            persistent: true
        });

        console.log("Notification sent:", message);

        setTimeout(() => {
            connection.close();
        }, 500);

    }catch(err){
        console.log(err);
    }
}

sendNotifications({
    "x-match": "all",
    "notification-type": "new_video",
    "content-type": "video/mp4"
}, "New video uploaded: 'How to use RabbitMQ with Node.js'");

sendNotifications({
    "x-match": "all",
    "notification-type": "live_stream",
    "content-type": "video/avi"
}, "New live stream started: 'RabbitMQ Live Q&A Session'");


sendNotifications({
    "x-match": "any",
    "notification-type-comment": "comment",
    "content-type": "vlog"
}, "New comment added to video: 'RabbitMQ Tutorial for Beginners'");

sendNotifications({
    "x-match": "any",
    "notification-type-like": "like",
    "content-type": "vlog"
}, "New like received on video: 'RabbitMQ Tutorial for Beginners'");