const ytSearch = require('yt-search');

const songs = [
    "Barsaat Ke Mausam Mein Kumar Sanu audio",
    "Tu Pyar Hai Kisi Aur Ka Kumar Sanu audio",
    "Hum Pyar Hain Tumhare Kumar Sanu audio",
    "Tere Ishq Mein Naachenge Kumar Sanu audio",
    "Pehli Pehli Baar Mohabbat Ki Hai Kumar Sanu audio"
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
