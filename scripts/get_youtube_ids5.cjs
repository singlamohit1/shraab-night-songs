const ytSearch = require('yt-search');

const songs = [
    "takue te takua khadke audio",
    "nachan ton pehlan hoka deange audio",
    "Mera Mahi Tu Pateya audio",
    "Aashiq feat Miss Pooja audio",
    "tera yaar bolda audio"
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
