const play = require('play-dl');
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
            let search = await play.search(song, { limit: 1 });
            if (search.length > 0) {
                console.log(`Found: ${search[0].title}. Downloading...`);
                let stream = await play.stream(search[0].url);
                
                await new Promise((resolve, reject) => {
                    const writeStream = fs.createWriteStream(`public/songs/song_${i+1}.mp3`);
                    stream.stream.pipe(writeStream);
                    writeStream.on('finish', () => {
                        console.log(`Saved song_${i+1}.mp3`);
                        resolve();
                    });
                    writeStream.on('error', reject);
                });
            } else {
                console.log(`No results for ${song}`);
            }
        } catch (e) {
            console.error(`Error downloading ${song}:`, e.message);
        }
    }
    console.log("All done!");
}

download();
