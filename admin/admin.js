// admin/admin.js
// MelodifyKH Admin V3

const PASSWORD = "MelodifyKH2026";

const REPO_OWNER = "longkor086-afk";
const REPO_NAME = "MelodifyKH";
const FILE_PATH = "songs.json";
const BRANCH = "main";

let githubToken = "";
let songs = [];
let sha = "";

// ---------------- Login ----------------

const loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = () => {

    const pass = document.getElementById("adminPassword").value.trim();

    githubToken = document.getElementById("githubToken").value.trim();

    if (pass !== PASSWORD) {
        alert("Wrong Password");
        return;
    }

    if (!githubToken) {
        alert("GitHub Token Required");
        return;
    }

    localStorage.setItem("admin_login", "true");
    localStorage.setItem("github_token", githubToken);

    openDashboard();

};

function openDashboard() {

    githubToken = localStorage.getItem("github_token");

    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").style.display = "block";

    loadSongs();

}

if (localStorage.getItem("admin_login") === "true") {
    openDashboard();
}

// ---------------- Logout ----------------

document.getElementById("logoutBtn").onclick = () => {

    localStorage.removeItem("admin_login");

    location.reload();

};

// ---------------- Load Songs ----------------

async function loadSongs() {

    const url =
        `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}/songs.json?` +
        Date.now();

    const res = await fetch(url);

    songs = await res.json();

    renderSongs();

    document.getElementById("totalSongs").textContent = songs.length;

    document.getElementById("totalArtists").textContent =
        [...new Set(songs.map(s => s.artist))].length;

}

// ---------------- Render ----------------

function renderSongs() {

    const list = document.getElementById("songList");

    list.innerHTML = "";

    songs.forEach(song => {

        list.innerHTML += `

<div class="song">

<img src="${song.cover}">

<div class="songInfo">

<h3>${song.title}</h3>

<p>${song.artist}</p>

</div>

<button
class="editBtn"
onclick="editSong('${song.id}')">

Edit

</button>

<button
class="deleteBtn"
onclick="deleteSong('${song.id}')">

Delete

</button>

</div>

`;

    });

}

// ---------------- Add Song ----------------

document.getElementById("addSongBtn").onclick = () => {

    const song = {

        id: "song_" + Date.now(),

        title: document.getElementById("title").value,

        artist: document.getElementById("artist").value,

        album: document.getElementById("album").value,

        cover: document.getElementById("cover").value,

        file_id: document.getElementById("fileid").value,

        addedAt: new Date().toISOString()

    };

    songs.unshift(song);

    renderSongs();

    uploadGithub();

};

// ---------------- Delete ----------------

function deleteSong(id) {

    if (!confirm("Delete Song ?")) return;

    songs = songs.filter(s => s.id !== id);

    renderSongs();

    uploadGithub();

}

// ---------------- Edit ----------------

function editSong(id) {

    const song = songs.find(s => s.id === id);

    if (!song) return;

    const title = prompt("Title", song.title);

    if (title == null) return;

    const artist = prompt("Artist", song.artist);

    const album = prompt("Album", song.album);

    const cover = prompt("Cover", song.cover);

    const file = prompt("Telegram File ID", song.file_id);

    song.title = title;

    song.artist = artist;

    song.album = album;

    song.cover = cover;

    song.file_id = file;

    renderSongs();

    uploadGithub();

}
// ===============================
// GitHub Auto Save
// ===============================

async function uploadGithub() {

    try {

        // Get SHA
        const info = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}?ref=${BRANCH}`,
            {
                headers: {
                    Authorization: `token ${githubToken}`
                }
            }
        );

        const json = await info.json();

        sha = json.sha;

        const content = btoa(
            unescape(
                encodeURIComponent(
                    JSON.stringify(songs, null, 2)
                )
            )
        );

        const res = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `token ${githubToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: "Update songs.json",
                    content: content,
                    sha: sha,
                    branch: BRANCH
                })
            }
        );

        const result = await res.json();

        if(result.commit){

            alert("✅ Saved to GitHub");

            loadSongs();

        }else{

            console.log(result);

            alert("❌ GitHub Save Failed");

        }

    } catch(err){

        console.log(err);

        alert(err.message);

    }

}

// ===============================
// Search
// ===============================

document.getElementById("searchSong").addEventListener("input", function(){

    const keyword = this.value.toLowerCase();

    const list = document.getElementById("songList");

    list.innerHTML = "";

    songs
    .filter(song =>

        song.title.toLowerCase().includes(keyword) ||

        song.artist.toLowerCase().includes(keyword) ||

        (song.album || "").toLowerCase().includes(keyword)

    )
    .forEach(song=>{

        list.innerHTML += `

<div class="song">

<img src="${song.cover}">

<div class="songInfo">

<h3>${song.title}</h3>

<p>${song.artist}</p>

</div>

<button
class="editBtn"
onclick="editSong('${song.id}')">

Edit

</button>

<button
class="deleteBtn"
onclick="deleteSong('${song.id}')">

Delete

</button>

</div>

`;

    });

});

// ===============================
// Today Songs
// ===============================

function updateTodaySongs(){

    const today = new Date().toISOString().slice(0,10);

    const count = songs.filter(song=>

        song.addedAt &&
        song.addedAt.startsWith(today)

    ).length;

    document.getElementById("todaySongs").textContent = count;

}

setInterval(updateTodaySongs,1000);

// ===============================
// Init
// ===============================

updateTodaySongs();
