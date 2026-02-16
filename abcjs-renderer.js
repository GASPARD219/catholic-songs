// abcjs-renderer.js
// Optional: Use ABCJS library for professional sheet music rendering

// Load ABCJS dynamically
function loadABCJS() {
    return new Promise((resolve, reject) => {
        if (window.ABCJS) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/abcjs@6.1.2/dist/abcjs-basic-min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Enhanced sheet music renderer
async function renderSheetMusicWithABC(songId, songTitle, abcNotation) {
    try {
        await loadABCJS();
        
        const container = document.getElementById('sheetMusicContainer');
        container.innerHTML = `<div id="abc-renderer" style="min-height: 200px;"></div>`;
        
        // Render with ABCJS
        ABCJS.renderAbc(
            "abc-renderer", 
            abcNotation,
            {
                responsive: "resize",
                paddingtop: 0,
                paddingbottom: 0,
                paddingright: 0,
                paddingleft: 0,
                staffwidth: 700,
                scale: 1.5
            }
        );
        
        // Add download button
        const downloadBtn = document.createElement('div');
        downloadBtn.style.marginTop = '20px';
        downloadBtn.innerHTML = `
            <button onclick="downloadSheetMusic('${songId}')" class="bottom-action-btn">
                ⬇️ Download ABC Notation
            </button>
        `;
        container.appendChild(downloadBtn);
        
    } catch (error) {
        console.error('Failed to load ABCJS:', error);
        // Fallback to basic rendering
        window.displaySheetMusic(songId);
    }
}

// Override the display function to use ABCJS
window.displaySheetMusic = async function(songId) {
    const song = allSongs.find(s => s.id === songId);
    if (!song) return;

    // Get or create notation
    if (!sheetMusicManager.sheetMusicData[songId]) {
        const sampleNotation = `[C]A-[G]men [Am]Mu-[F]kama
[C]U-[G]mwi-[C]ne [F]I-[G]ma-[C]na
[F]Ni-[G]we [C]Mu-[Am]re-[Dm]zi [G7]wan-[C]je`;
        
        sheetMusicManager.createNotation(songId, sampleNotation);
    }

    // Generate ABC notation
    const abcNotation = sheetMusicManager.generateABC(songId, song.title);
    
    // Try to render with ABCJS
    await renderSheetMusicWithABC(songId, song.title, abcNotation);
    
    // Show modal
    document.getElementById('sheetMusicModal').style.display = 'flex';
};
