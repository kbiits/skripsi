import amqp from 'amqplib';
import env from '../env.js';

export let amqpConnection!: amqp.Connection;
export let amqpChannel!: amqp.Channel;

export const connectAmqp = async () => {
    if (!amqpConnection) {
        amqpConnection = await amqp.connect(env.AMQP_URL);
        amqpChannel = await amqpConnection.createChannel();
    }
}
