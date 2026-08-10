const ytSearch = require('yt-search');

const songs = [
    "mittran da naa chalda audio",
    "de de gera audio",
    "pind pehra lagda audio",
    "naag jazzy b audio",
    "saun di jhadi audio",
    "saat samundar paar audio"
];

async function getIds() {
    for (let song of songs) {
        try {
            const r = await ytSearch(song);
            const videos = r.videos.slice(0, 1);
            console.log(`\nResults for: ${song}`);
            videos.forEach((v, i) => {
                console.log(`${i+1}. ${v.title}`);
                console.log(`   ID: ${v.videoId}`);
            });
        } catch (e) {
            console.error(`Error for ${song}:`, e);
        }
    }
}

getIds();
