const ytSearch = require('yt-search');

const songs = [
    "Apne Viah De Vich Nachda Phire Balkar Sidhu audio",
    "Daru Peeke Kaka Bhaniawala audio",
    "Peg Sarthi K audio",
    "Alrhaan Kuarian Diljit Dosanjh audio",
    "Daka Diljit Dosanjh audio",
    "Rang Rara Riri Rara Sarbjit Cheema audio"
];

async function getIds() {
    for (let song of songs) {
        try {
            const r = await ytSearch(song);
            const videos = r.videos.slice(0, 2);
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
