const ytSearch = require('yt-search');

const songs = [
    "Main Duniya Bhula Doonga audio",
    "Meri Bheegi Bheegi Si audio",
    "Ankhiyon Ke Jharokhon Se audio",
    "Dulhe Ka Sehra audio"
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
