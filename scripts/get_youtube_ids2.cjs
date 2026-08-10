const ytSearch = require('yt-search');

const songs = [
    "dheere dheere se meri jindagi mei aana audio",
    "Kitni Hasrat Hai Humein audio",
    "Raah mein unse Mulaqat Ho Gai audio",
    "pehli pehli baar mohabbat hui hai"
];

async function getIds() {
    for (let song of songs) {
        const r = await ytSearch(song);
        if (r.videos.length > 0) {
            console.log(`Title: ${r.videos[0].title}`);
            console.log(`ID: ${r.videos[0].videoId}`);
            console.log('---');
        }
    }
}
getIds();
