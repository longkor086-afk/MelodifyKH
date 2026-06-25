const API_URL = "https://melodify-api-2mag.onrender.com/song/";

const ITEMS_PER_PAGE = 20;

let allSongs = [];
let filteredSongs = [];

let currentPage = 1;
let currentSongIndex = -1;

let shuffle = false;
let repeat = false;

const audio = document.getElementById("audio");

// Load songs
async function loadSongs() {
    try {
        const res = await fetch("songs.json");
        allSongs = await res.json();

        filteredSongs = [...allSongs];

        renderSongs();
        renderPagination();

    } catch (err) {
        console.error(err);
    }
}

// Render songs
function renderSongs() {

    const grid = document.getElementById("songGrid");

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    const songs = filteredSongs.slice(start, end);

    grid.innerHTML = "";

    songs.forEach(song => {

        const card = document.createElement("div");
        card.className = "song-card";

        let cover = "";

        if (song.cover) {
            cover = `
            <img
                class="song-cover"
                src="${song.cover}"
                loading="lazy"
            >
            `;
        } else {
            cover = `
            <div class="default-cover">
                🎵
            </div>
            `;
        }

        card.innerHTML = `
            ${cover}

            <div class="song-info">
                <div class="song-title">
                    ${song.title || "Unknown"}
                </div>

                <div class="song-artist">
                    ${song.artist || "Unknown"}
                </div>
            </div>
        `;

        card.onclick = () => playSong(song);

        grid.appendChild(card);

    });

}

// Pagination
function renderPagination() {

    const totalPages =
        Math.ceil(filteredSongs.length / ITEMS_PER_PAGE);

    const pagination =
        document.getElementById("pagination");

    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {

        const btn =
            document.createElement("button");

        btn.textContent = i;

        if (i === currentPage) {
            btn.classList.add("active");
        }

        btn.onclick = () => {

            currentPage = i;

            renderSongs();
            renderPagination();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        };

        pagination.appendChild(btn);

    }

}

// Search
document
.getElementById("searchInput")
.addEventListener("input", function () {

    const q =
        this.value.toLowerCase();

    filteredSongs =
        allSongs.filter(song =>
            (song.title || "")
            .toLowerCase()
            .includes(q)
            ||
            (song.artist || "")
            .toLowerCase()
            .includes(q)
        );

    currentPage = 1;

    renderSongs();
    renderPagination();

});

// Play Song
function playSong(song) {

    if (!song.file_id) return;

    currentSongIndex =
        allSongs.findIndex(
            s => s.id === song.id
        );

    audio.src =
        API_URL + song.file_id;

    audio.play();

    updatePlayer(song);

}

// Update Player
function updatePlayer(song) {

    document
        .getElementById("miniPlayer")
        .classList
        .remove("hidden");

    document
        .getElementById("playerTitle")
        .textContent =
        song.title || "Unknown";

    document
        .getElementById("playerArtist")
        .textContent =
        song.artist || "Unknown";

    document
        .getElementById("modalTitle")
        .textContent =
        song.title || "Unknown";

    document
        .getElementById("modalArtist")
        .textContent =
        song.artist || "Unknown";

    const modalCover =
        document.getElementById("modalCover");

    const miniCover =
        document.getElementById("playerCover");

    if (song.cover) {

        modalCover.innerHTML =
            `<img src="${song.cover}" class="song-cover">`;

        miniCover.innerHTML =
            `<img src="${song.cover}" class="song-cover">`;

    } else {

        modalCover.innerHTML = "";
        miniCover.innerHTML = "";

    }

}

// Play/Pause
function togglePlay() {

    if (!audio.src && allSongs.length) {

        playSong(allSongs[0]);
        return;

    }

    if (audio.paused) {

        audio.play();

    } else {

        audio.pause();

    }

}

// Previous
function prevSong() {

    if (!allSongs.length) return;

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex =
            allSongs.length - 1;
    }

    playSong(
        allSongs[currentSongIndex]
    );

}

// Next
function nextSong() {

    if (!allSongs.length) return;

    if (shuffle) {

        currentSongIndex =
            Math.floor(
                Math.random()
                * allSongs.length
            );

    } else {

        currentSongIndex++;

        if (
            currentSongIndex >=
            allSongs.length
        ) {
            currentSongIndex = 0;
        }

    }

    playSong(
        allSongs[currentSongIndex]
    );

}

// Audio End
audio.addEventListener(
    "ended",
    () => {

        if (repeat) {

            audio.currentTime = 0;
            audio.play();

        } else {

            nextSong();

        }

    }
);

// Shuffle
function toggleShuffle() {

    shuffle = !shuffle;

    alert(
        shuffle
        ? "🔀 Shuffle ON"
        : "🔀 Shuffle OFF"
    );

}

// Repeat
function toggleRepeat() {

    repeat = !repeat;

    alert(
        repeat
        ? "🔁 Repeat ON"
        : "🔁 Repeat OFF"
    );

}

// Modal
function openPlayer() {

    document
        .getElementById("playerModal")
        .classList
        .remove("hidden");

}

function closePlayer() {

    document
        .getElementById("playerModal")
        .classList
        .add("hidden");

}

// Progress
audio.addEventListener(
    "timeupdate",
    () => {

        const progress =
            document
            .getElementById(
                "progressBar"
            );

        if (audio.duration) {

            progress.value =
                (audio.currentTime
                / audio.duration)
                * 100;

        }

    }
);

document
.getElementById("progressBar")
.addEventListener(
    "input",
    function () {

        if (!audio.duration) return;

        audio.currentTime =
            (this.value / 100)
            * audio.duration;

    }
);

// Open full player
document
.getElementById("miniPlayer")
.addEventListener(
    "click",
    openPlayer
);

// Start
loadSongs();
