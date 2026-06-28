const amqp = require("amqplib")

async function receiveMail(){
    try{
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();

        await channel.assertQueue("user_mail_queue", { durable: true });
        channel.consume("user_mail_queue", (mssg)=>{
            if(mssg!==null){
                const mesage = JSON.parse(mssg.content.toString());
                console.log("Received message for normal_user: ", mesage);
                channel.ack(mssg);
            }
        })
    }catch(err){
        console.log(err)
    }
}

receiveMail();