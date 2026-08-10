const ytSearch = require('yt-search');

const songs = [
    "Mujhko Rana Ji Maaf Karna audio"
];

async function getIds() {
    for (let song of songs) {
        try {
            const r = await ytSearch(song);
            const videos = r.videos.slice(0, 3);
            console.log(`\nResults for: ${song}`);
            videos.forEach((v, i) => {
                console.log(`${i+1}. ${v.title}`);
                console.log(`   ID: ${v.videoId}`);
                console.log(`   Duration: ${v.timestamp}`);
            });
        } catch (e) {
            console.error(`Error for ${song}:`, e);
        }
    }
}

getIds();
