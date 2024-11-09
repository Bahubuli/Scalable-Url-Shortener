const {createClient} = require("redis")

const client = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
    password: process.env.REDIS_PW,
});

client.on('error', err => console.error('Redis Client Error', err));
client.connect();
client.on('connect', () => console.log('Redis Client Connected'));

module.exports =  {client};
