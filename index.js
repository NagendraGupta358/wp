const express = require('express');
const bodyParser = require('body-parser');
const qrcode = require('qrcode-terminal');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

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

// API endpoint to create a WhatsApp group
app.post('/createGroup', async (req, res) => {
    try {
        const { groupName, numbers } = req.body;

        if (!groupName || !numbers || !Array.isArray(numbers)) {
            return res.status(400).json({ error: 'Invalid data provided' });
        }

        // const formattedNumbers = numbers.map((num) => `${num}@c.us`);

        // Sanitize and format the numbers
        const formattedNumbers = numbers.map((num) => {
            // Remove '+' sign if it exists and add '@c.us' suffix
            const sanitizedNum = num.replace(/\+/g, '').trim();
            return `${sanitizedNum}@c.us`;
        });

        // Create a group
        const group = await client.createGroup(groupName, formattedNumbers);

        // Check if the group creation was successful
        if (group) {
            res.status(200).json({ message: `Group "${group.name}" created successfully!` });
        } else {
            res.status(500).json({ error: 'Failed to create group' });
        }
    } catch (error) {
        console.error('Error creating group:', error.message);
        res.status(500).json({ error: 'Failed to create group', message: error.message });
    }
});


client.initialize();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});