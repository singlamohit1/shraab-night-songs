import subprocess
import os

songs = [
    "Barsaat Ke Mausam Mein Kumar Sanu",
    "Tu Pyar Hai Kisi Aur Ka Kumar Sanu",
    "Hum Pyar Hain Tumhare Kumar Sanu",
    "Tere Ishq Mein Naachenge Kumar Sanu",
    "Pehli Pehli Baar Mohabbat Ki Hai Kumar Sanu"
]

output_dir = "public/songs"

# Use yt-dlp to search and download the first audio result
for i, song in enumerate(songs, 1):
    print(f"Downloading {song}...")
    output_path = os.path.join(output_dir, f"song_{i}.%(ext)s")
    
    command = [
        "./yt-dlp",
        f"ytsearch1:{song}",
        "-x", # Extract audio
        "--audio-format", "mp3",
        "--audio-quality", "0", # Best quality
        "-o", output_path
    ]
    
    try:
        subprocess.run(command, check=True)
        print(f"Successfully downloaded {song}")
    except subprocess.CalledProcessError as e:
        print(f"Failed to download {song}. Error: {e}")

print("Download complete.")
