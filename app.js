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
// =========================
// Queue
// =========================

let queue=[];

function addToQueue(song){

queue.push(song);

renderQueue();

showToast("🎵 Added to Queue");

}

function renderQueue(){

const box=document.getElementById("queueSongs");

if(!box) return;

box.innerHTML="";

queue.forEach(song=>{

const item=document.createElement("div");

item.className="queueSong";

item.innerHTML=`

<img src="${song.cover||'assets/default.png'}">

<div class="queueSongInfo">

<h3>${escapeHtml(song.title)}</h3>

<p>${escapeHtml(song.artist)}</p>

</div>

`;

item.onclick=()=>playSong(song);

box.appendChild(item);

});

}

document.getElementById("addQueue")
?.addEventListener("click",()=>{

if(currentSong) addToQueue(currentSong);

});

// =========================
// Toast
// =========================

function showToast(text){

const toast=document.getElementById("toast");

if(!toast) return;

toast.textContent=text;

toast.style.display="block";

clearTimeout(window.toastTimer);

window.toastTimer=setTimeout(()=>{

toast.style.display="none";

},2500);

}

// =========================
// Loading
// =========================

function showLoading(show){

const loading=document.getElementById("loading");

if(!loading) return;

loading.style.display=show?"flex":"none";

}

// =========================
// Escape HTML
// =========================

function escapeHtml(text){

return String(text||"")

.replace(/&/g,"&amp;")

.replace(/</g,"&lt;")

.replace(/>/g,"&gt;")

.replace(/"/g,"&quot;")

.replace(/'/g,"&#039;");

}

// =========================
// Open / Close Player
// =========================

document.getElementById("miniPlayer").onclick=()=>{

document.getElementById("playerPage").style.display="flex";

};

document.getElementById("closePlayer").onclick=()=>{

document.getElementById("playerPage").style.display="none";

};

// =========================
// Start App
// =========================

window.onload=()=>{

loadSongs();

setTimeout(()=>{

const splash=document.getElementById("splash");

if(splash){

splash.style.opacity="0";

setTimeout(()=>{

splash.style.display="none";

},500);

}

},1500);

};
// ======================================================
// MelodifyKH V3
// app.js PART 6
// Smart Navigation + Library + Pagination
// ======================================================

// ---------- Pages ----------

const pages = {
    home: document.querySelector("main"),
    search: document.getElementById("searchPage"),
    library: document.getElementById("libraryPage"),
    profile: document.getElementById("profilePage")
};

const navButtons = document.querySelectorAll("nav button");

function showPage(page){

    Object.values(pages).forEach(p=>{

        if(p) p.style.display="none";

    });

    if(pages[page]){

        pages[page].style.display="block";

    }

    navButtons.forEach(btn=>btn.classList.remove("active"));

}

navButtons[0].onclick=()=>{

showPage("home");

navButtons[0].classList.add("active");

};

navButtons[1].onclick=()=>{

showPage("search");

navButtons[1].classList.add("active");

};

navButtons[2].onclick=()=>{

showPage("library");

navButtons[2].classList.add("active");

loadLibrary();

};

navButtons[3].onclick=()=>{

showPage("profile");

navButtons[3].classList.add("active");

updateProfile();

};

showPage("home");
navButtons[0].classList.add("active");

// ======================================================
// Pagination
// ======================================================

let currentRenderPage=1;

const SONG_PER_PAGE=20;

function renderDiscover(){

discoverSongs.innerHTML="";

const start=(currentRenderPage-1)*SONG_PER_PAGE;

const end=start+SONG_PER_PAGE;

filteredSongs

.slice(start,end)

.forEach(song=>{

discoverSongs.appendChild(

createGridCard(song)

);

});

renderPagination();

}

function renderPagination(){

let box=document.getElementById("pagination");

if(!box){

box=document.createElement("div");

box.id="pagination";

discoverSongs.after(box);

}

box.innerHTML="";

const total=Math.ceil(filteredSongs.length/SONG_PER_PAGE);

for(let i=1;i<=total;i++){

const btn=document.createElement("button");

btn.textContent=i;

btn.className="pageBtn";

if(i===currentRenderPage){

btn.classList.add("active");

}

btn.onclick=()=>{

currentRenderPage=i;

renderDiscover();

window.scrollTo({

top:0,

behavior:"smooth"

});

};

box.appendChild(btn);

}

}

// ======================================================
// Library
// ======================================================

function loadLibrary(){

const box=document.getElementById("librarySongs");

if(!box) return;

const liked=JSON.parse(

localStorage.getItem("likedSongs")

)||[];

box.innerHTML="";

if(liked.length===0){

box.innerHTML="<h3>No liked songs.</h3>";

return;

}

liked.forEach(song=>{

box.appendChild(

createGridCard(song)

);

});

}

// ======================================================
// Profile
// ======================================================

function updateProfile(){

document.getElementById("likedCount").textContent=

(JSON.parse(localStorage.getItem("likedSongs"))||[]).length;

document.getElementById("totalPlayed").textContent=

(JSON.parse(localStorage.getItem("history"))||[]).length;

document.getElementById("downloadCount").textContent=

(JSON.parse(localStorage.getItem("downloads"))||[]).length;

}
// ======================================================
// MelodifyKH V3
// app.js PART 7
// Smart Search + History + Liked + Downloads
// ======================================================

// ---------------- Smart Search ----------------

const globalSearch=document.getElementById("globalSearch");

if(globalSearch){

globalSearch.addEventListener("input",smartSearch);

}

function smartSearch(){

const keyword=globalSearch.value

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

title.includes(keyword)||

artist.includes(keyword)||

album.includes(keyword)||

levenshtein(keyword,title)<=2||

levenshtein(keyword,artist)<=2

);

});

currentRenderPage=1;

renderDiscover();

}

// ---------------- Levenshtein ----------------

function levenshtein(a,b){

const matrix=[];

for(let i=0;i<=b.length;i++){

matrix[i]=[i];

}

for(let j=0;j<=a.length;j++){

matrix[0][j]=j;

}

for(let i=1;i<=b.length;i++){

for(let j=1;j<=a.length;j++){

if(b.charAt(i-1)==a.charAt(j-1)){

matrix[i][j]=matrix[i-1][j-1];

}else{

matrix[i][j]=Math.min(

matrix[i-1][j-1]+1,

matrix[i][j-1]+1,

matrix[i-1][j]+1

);

}

}

}

return matrix[b.length][a.length];

}

// ---------------- History ----------------

function renderHistory(){

const history=

JSON.parse(

localStorage.getItem("history")

)||[];

const box=document.getElementById("librarySongs");

box.innerHTML="";

history.forEach(song=>{

box.appendChild(

createGridCard(song)

);

});

}

document.getElementById("historyCard")

?.addEventListener(

"click",

renderHistory

);

// ---------------- Liked ----------------

function renderLiked(){

const liked=

JSON.parse(

localStorage.getItem("likedSongs")

)||[];

const box=document.getElementById("librarySongs");

box.innerHTML="";

liked.forEach(song=>{

box.appendChild(

createGridCard(song)

);

});

}

document.getElementById("likedCard")

?.addEventListener(

"click",

renderLiked

);

// ---------------- Downloads ----------------

function renderDownloads(){

const downloads=

JSON.parse(

localStorage.getItem("downloads")

)||[];

const box=document.getElementById("librarySongs");

box.innerHTML="";

downloads.forEach(song=>{

box.appendChild(

createGridCard(song)

);

});

}

document.getElementById("downloadCard")

?.addEventListener(

"click",

renderDownloads

);

// ---------------- Save Download ----------------

function saveDownload(song){

let downloads=

JSON.parse(

localStorage.getItem("downloads")

)||[];

if(!downloads.find(s=>s.id===song.id)){

downloads.unshift(song);

}

localStorage.setItem(

"downloads",

JSON.stringify(downloads)

);

}
