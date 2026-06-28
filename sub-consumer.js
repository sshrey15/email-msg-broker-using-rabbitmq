const amqp = require("amqplib");

async function  receiveMail(){
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        await channel.assertQueue("sub_user_mail_queue", { durable: true });
        channel.consume("sub_user_mail_queue", (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                console.log("Received message for sub_user: ", message);
                channel.ack(msg);
            }
        }); 
    }catch(err){
        console.log(err);
    }
}

receiveMail();