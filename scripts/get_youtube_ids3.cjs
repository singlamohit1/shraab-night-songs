const ytSearch = require('yt-search');

const songs = [
    "Tujhe Yaad Na Meri Aayee audio",
    "o saathi re kishore kumar audio",
    "likhe jo khat tujhe audio",
    "o mere dil ke chain kishore kumar audio"
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
