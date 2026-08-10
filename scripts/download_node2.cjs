const youtubedl = require('youtube-dl-exec');
const ytSearch = require('yt-search');
const fs = require('fs');

const songs = [
    "Barsaat Ke Mausam Mein Kumar Sanu audio",
    "Tu Pyar Hai Kisi Aur Ka Kumar Sanu audio",
    "Hum Pyar Hain Tumhare Kumar Sanu audio",
    "Tere Ishq Mein Naachenge Kumar Sanu audio",
    "Pehli Pehli Baar Mohabbat Ki Hai Kumar Sanu audio"
];

async function download() {
    for (let i = 0; i < songs.length; i++) {
        const song = songs[i];
        console.log(`Searching for: ${song}`);
        try {
            const r = await ytSearch(song);
            if (r.videos.length > 0) {
                const url = r.videos[0].url;
                console.log(`Found: ${r.videos[0].title}. Downloading...`);
                await youtubedl(url, {
                    extractAudio: true,
                    audioFormat: 'mp3',
                    output: `public/songs/song_${i+1}.%(ext)s`
                });
                console.log(`Saved song_${i+1}.mp3`);
            }
        } catch (e) {
            console.error(`Error downloading ${song}:`, e.message);
        }
    }
    console.log("All done!");
}

download();
