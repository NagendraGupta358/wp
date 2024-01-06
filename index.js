const qrcode = require('qrcode-terminal');
import LogRocket from 'logrocket';
LogRocket.init('pcyqtm/wp');

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

// Use the saved values
const client = new Client({
    //authStrategy: new LocalAuth({ clientId: "client-one" })
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
    client.sendMessage(message.from, 'pong');
});

client.initialize();