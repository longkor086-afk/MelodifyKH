const GITHUB_USER = "longkor086-afk";
const GITHUB_REPO = "MelodifyKH";
const FILE_PATH = "songs.json";

let songs = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 20;

// Load songs
async function loadSongs() {
try {
const url = "https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/${FILE_PATH}";

    const res = await fetch(url);
    songs = await res.json();

    renderSongs();

} catch (err) {
    console.error(err);
    alert("Load songs failed");
}

}

// Render songs
function renderSongs() {

const search =
    document.getElementById("search")
    .value
    .toLowerCase();

const filtered = songs.filter(song =>
    song.title.toLowerCase().includes(search) ||
    song.artist.toLowerCase().includes(search)
);

const start =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

const pageSongs =
    filtered.slice(
        start,
        start + ITEMS_PER_PAGE
    );

const list =
    document.getElementById("songList");

list.innerHTML = "";

pageSongs.forEach(song => {

    list.innerHTML += `
    <div class="song">

        <b>${song.title}</b>

        <br>

        ${song.artist}

        <br><br>

        <button
        onclick="deleteSong('${song.id}')">
        🗑 Delete
        </button>

    </div>
    `;
});

renderPagination(filtered.length);

}

// Pagination
function renderPagination(total) {

const pages =
    Math.ceil(
        total / ITEMS_PER_PAGE
    );

const container =
    document.getElementById(
        "pagination"
    );

container.innerHTML = "";

for(let i=1;i<=pages;i++){

    container.innerHTML += `
    <button onclick="goPage(${i})">
        ${i}
    </button>
    `;
}

}

function goPage(page){
currentPage = page;
renderSongs();
}

// Add song
function addSong(){

const title =
    document.getElementById("title")
    .value
    .trim();

const artist =
    document.getElementById("artist")
    .value
    .trim();

const fileId =
    document.getElementById("fileId")
    .value
    .trim();

const cover =
    document.getElementById("cover")
    .value
    .trim();

if(
    !title ||
    !artist ||
    !fileId
){
    alert("Fill all fields");
    return;
}

songs.unshift({

    id:
    "song_" +
    Date.now(),

    title,

    artist,

    file_id:
    fileId,

    cover,

    addedAt:
    new Date()
    .toISOString()
});

renderSongs();

alert(
    "Song added. Save to GitHub next."
);

}

// Delete song
function deleteSong(id){

if(
    !confirm(
        "Delete this song?"
    )
) return;

songs =
    songs.filter(
        song =>
        song.id !== id
    );

renderSongs();

}

loadSongs();
