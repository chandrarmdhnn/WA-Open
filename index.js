const qrcode = require('qrcode-terminal');
const { EditPhotoHandler } = require('./edit_foto');
const axios = require('axios')
const fs = require("fs")
const { Client, LegacySessionAuth, LocalAuth, MessageMedia} = require('whatsapp-web.js');
const { getSystemErrorMap } = require('util');
const { Configuration, OpenAIApi } = require("openai");
const { url } = require('inspector');
const { Socket } = require('dgram');

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);
const client = new Client({
     authStrategy: new LocalAuth({
          clientId: "client-one" //Un identificador(Sugiero que no lo modifiques)
     })
})

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    console.log(session);
});
 

client.initialize();
client.on("qr", qr => {
    qrcode.generate(qr, {small: true} );
})

client.on('ready', () => {
    console.log("ready to message")
});

function man(){
    client.on('message', async message => {
        if(message.body.includes('/ask')) {
            let text = message.body.split('/ask')[1];
            var qst = `Q: ${text}\nA:`;
            const response = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: qst,
                temperature: 0,
                max_tokens: 300,
                top_p: 1.0,
                frequency_penalty: 0.0,
                presence_penalty: 0.0,
            });
            message.reply(response.data.choices[0].text);
        }
        else if(message.body.includes('/draw')) {
            let text = message.body.split('/draw')[1];
            var qst = `Q: ${text}\nA:`;
            const response = await openai.createImage({
                prompt: text,
                n: 1,
                size: '512x512'
            });
            var imgUrl = response.data.data[0].url;
            const media = await MessageMedia.fromUrl(imgUrl);
            await client.sendMessage(message.from, media, {caption: "your image"})
        }

    });
}
man();

client.on('message', async msg => {

    const text = msg.body.toLowerCase() || '';

    //check status
    if (text === '!command') {
        msg.reply('/ask untuk bertanya \n\n /draw untuk membuat gambar \n\n #edit_bg/color untuk mengedit background foto \n\n !info untuk mengetahui info terbaru');
    }

    // #edit_bg/bg_color
    if (text.includes("#edit_bg/")) {
        await EditPhotoHandler(text, msg);
    }

    // profil developer
    if (text === '!profil') {
        msg.reply('Saya Rizky Chandra Ramadhan, Umur 18 tahun, Bermain untuk IGET ESPORT Divisi PUBGM');
    }
    if (text === '!pic') {
        const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
        chat.sendMessage(media);
    }
});

    // info terkini tentang developer
client.on('message', message => {   
	if(message.body === '!inf') {
		message.reply('Sementara lagi pusing nyari hosting buat deploy bot');
	}
});

    // sticker maker
client.on('message', async (msg) => {
    if(msg.body.startsWith('!sticker') && msg.type === 'image') {
        const media = await msg.downloadMedia();

        client.sendMessage(msg.from, media, {
            sendMediaAsSticker: true,
        })
    }
    })

    // spam message
    client.on('message', message => {
        if(message.body === '!spam') {
            for (let i = 0; i <15; i++) {       
                message.reply('hitam legam👱🏿‍♂️👱🏿‍♂️👱🏿‍♂️');
            }
        }
    });    
