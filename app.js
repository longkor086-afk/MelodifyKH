// =========================
// MelodifyKH V3
// app.js Part 1
// =========================

const audio = document.getElementById("audio");

let allSongs = [];
let filteredSongs = [];

let currentSong = null;
let currentIndex = -1;

let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

const SONGS_PER_PAGE = 20;
let currentPage = 1;

// =========================
// DOM
// =========================

const discoverSongs =
document.getElementById("discoverSongs");

const trendingSongs =
document.getElementById("trendingSongs");

const recommendedSongs =
document.getElementById("recommendedSongs");

const newSongs =
document.getElementById("newSongs");

const searchInput =
document.getElementById("searchInput");

// =========================
// Load Songs
// =========================

async function loadSongs(){

showLoading(true);

try{

const res = await fetch("songs.json");

allSongs = await res.json();

filteredSongs = [...allSongs];

renderHome();

}
catch(e){

console.log(e);

showToast("❌ Cannot load songs");

}

showLoading(false);

}

// =========================
// Render Home
// =========================

function renderHome(){

renderTrending();

renderNewSongs();

renderRecommended();

renderDiscover();

}

// =========================
// Trending
// =========================

function renderTrending(){

trendingSongs.innerHTML="";

const list=[...allSongs]
.slice(0,10);

list.forEach(song=>{

trendingSongs.appendChild(

createSongCard(song)

);

});

}

// =========================
// New Songs
// =========================

function renderNewSongs(){

newSongs.innerHTML="";

const list=[...allSongs]

.sort((a,b)=>

new Date(b.addedAt)-new Date(a.addedAt)

)

.slice(0,10);

list.forEach(song=>{

newSongs.appendChild(

createSongCard(song)

);

});

}

// =========================
// Recommended
// =========================

function renderRecommended(){

recommendedSongs.innerHTML="";

const random=[...allSongs]

.sort(()=>Math.random()-0.5)

.slice(0,10);

random.forEach(song=>{

recommendedSongs.appendChild(

createSongCard(song)

);

});

}

// =========================
// Discover
// =========================

function renderDiscover(){

discoverSongs.innerHTML="";

filteredSongs.forEach(song=>{

discoverSongs.appendChild(

createGridCard(song)

);

});

}
// =========================
// Create Horizontal Card
// =========================

function createSongCard(song){

const card=document.createElement("div");

card.className="songCard";

card.innerHTML=`

<img src="${song.cover || 'assets/default.png'}">

<h3>${escapeHtml(song.title)}</h3>

<p>${escapeHtml(song.artist)}</p>

`;

card.onclick=()=>{

playSong(song);

};

return card;

}

// =========================
// Create Grid Card
// =========================

function createGridCard(song){

const card=document.createElement("div");

card.className="songItem";

card.innerHTML=`

<img src="${song.cover || 'assets/default.png'}">

<div class="songInfo">

<h3>${escapeHtml(song.title)}</h3>

<p>${escapeHtml(song.artist)}</p>

</div>

`;

card.onclick=()=>{

playSong(song);

};

return card;

}

// =========================
// Play Song
// =========================

function playSong(song){

if(!song.file_id){

showToast("❌ File ID not found");

return;

}

currentSong=song;

currentIndex=allSongs.findIndex(

s=>s.id===song.id

);

audio.src=

"https://melodify-api-2mag.onrender.com/song/"+

song.file_id;

audio.play();

updatePlayer();

saveHistory(song);

}

// =========================
// Update Player
// =========================

function updatePlayer(){

document.getElementById("miniTitle").textContent=

currentSong.title;

document.getElementById("miniArtist").textContent=

currentSong.artist;

document.getElementById("playerTitle").textContent=

currentSong.title;

document.getElementById("playerArtist").textContent=

currentSong.artist;

document.getElementById("miniCover").src=

currentSong.cover;

document.getElementById("playerCover").src=

currentSong.cover;

document.getElementById("miniPlayer").style.display=

"flex";

}

// =========================
// Toggle Play
// =========================

document.getElementById("playBtn").onclick=()=>{

if(audio.paused){

audio.play();

}else{

audio.pause();

}

};

document.getElementById("miniPlay").onclick=()=>{

if(audio.paused){

audio.play();

}else{

audio.pause();

}

};

audio.onplay=()=>{

isPlaying=true;

document.getElementById("playBtn").innerHTML="⏸";

document.getElementById("miniPlay").innerHTML="⏸";

};

audio.onpause=()=>{

isPlaying=false;

document.getElementById("playBtn").innerHTML="▶";

document.getElementById("miniPlay").innerHTML="▶";

};
// =========================
// Next Song
// =========================

document.getElementById("nextBtn").onclick = nextSong;

function nextSong(){

if(allSongs.length===0) return;

if(isShuffle){

currentIndex=Math.floor(Math.random()*allSongs.length);

}else{

currentIndex++;

if(currentIndex>=allSongs.length){

currentIndex=0;

}

}

playSong(allSongs[currentIndex]);

}

// =========================
// Previous Song
// =========================

document.getElementById("prevBtn").onclick = prevSong;

function prevSong(){

if(allSongs.length===0) return;

if(isShuffle){

currentIndex=Math.floor(Math.random()*allSongs.length);

}else{

currentIndex--;

if(currentIndex<0){

currentIndex=allSongs.length-1;

}

}

playSong(allSongs[currentIndex]);

}

// =========================
// Repeat
// =========================

document.getElementById("repeatBtn").onclick=()=>{

isRepeat=!isRepeat;

document.getElementById("repeatBtn").style.color=

isRepeat ? "#8b5cf6" : "#ffffff";

};

// =========================
// Shuffle
// =========================

document.getElementById("shuffleBtn").onclick=()=>{

isShuffle=!isShuffle;

document.getElementById("shuffleBtn").style.color=

isShuffle ? "#8b5cf6" : "#ffffff";

};

// =========================
// Song End
// =========================

audio.onended=()=>{

if(isRepeat){

audio.currentTime=0;

audio.play();

return;

}

nextSong();

};

// =========================
// Progress
// =========================

const seekBar=document.getElementById("seekBar");

audio.ontimeupdate=()=>{

if(audio.duration){

seekBar.max=audio.duration;

seekBar.value=audio.currentTime;

}

document.getElementById("currentTime").textContent=

formatTime(audio.currentTime);

document.getElementById("duration").textContent=

formatTime(audio.duration);

};

seekBar.oninput=()=>{

audio.currentTime=seekBar.value;

};

// =========================
// Format Time
// =========================

function formatTime(sec){

if(isNaN(sec)) return "0:00";

const m=Math.floor(sec/60);

const s=Math.floor(sec%60);

return m+":"+(s<10?"0":"")+s;

}
// =========================
// Search
// =========================

searchInput.addEventListener("input", searchSongs);

function searchSongs(){

const keyword=searchInput.value
.toLowerCase()
.trim();

if(keyword===""){

filteredSongs=[...allSongs];

renderDiscover();

return;

}

filteredSongs=allSongs.filter(song=>{

const title=(song.title||"").toLowerCase();

const artist=(song.artist||"").toLowerCase();

const album=(song.album||"").toLowerCase();

return(

title.includes(keyword) ||

artist.includes(keyword) ||

album.includes(keyword)

);

});

renderDiscover();

}

// =========================
// Like Song
// =========================

let likedSongs=

JSON.parse(

localStorage.getItem("likedSongs")

)||[];

function likeCurrentSong(){

if(!currentSong) return;

const exists=

likedSongs.find(

s=>s.id===currentSong.id

);

if(exists){

showToast("❤️ Already liked");

return;

}

likedSongs.push(currentSong);

localStorage.setItem(

"likedSongs",

JSON.stringify(likedSongs)

);

showToast("❤️ Added to Liked Songs");

}

document.getElementById("likeSong")
?.addEventListener("click",likeCurrentSong);

// =========================
// History
// =========================

function saveHistory(song){

let history=

JSON.parse(

localStorage.getItem("history")

)||[];

history=history.filter(

s=>s.id!==song.id

);

history.unshift(song);

if(history.length>100){

history.length=100;

}

localStorage.setItem(

"history",

JSON.stringify(history)

);

}

// =========================
// Download
// =========================

function downloadCurrentSong(){

if(!currentSong) return;

window.open(

audio.src,

"_blank"

);

}

document.getElementById("downloadSong")
?.addEventListener(

"click",

downloadCurrentSong

);

// =========================
// Share
// =========================

function shareSong(){

if(!currentSong) return;

if(navigator.share){

navigator.share({

title:currentSong.title,

text:currentSong.artist,

url:location.href

});

}else{

navigator.clipboard.writeText(location.href);

showToast("📋 Link Copied");

}

}

document.getElementById("shareSong")
?.addEventListener(

"click",

shareSong

);
