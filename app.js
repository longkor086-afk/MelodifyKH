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
// ======================================================
// MelodifyKH V3
// app.js PART 8
// Artist + Album + Recommendation + Theme
// ======================================================

// ---------------- Artist ----------------

function renderArtists(){

const artists=[...new Set(allSongs.map(s=>s.artist).filter(Boolean))];

const box=document.getElementById("artistList");

if(!box) return;

box.innerHTML="";

artists.forEach(name=>{

const songs=allSongs.filter(s=>s.artist===name);

const card=document.createElement("div");

card.className="artistCard";

card.innerHTML=`

<img src="${songs[0]?.cover||'assets/default.png'}">

<h4>${escapeHtml(name)}</h4>

`;

card.onclick=()=>{

filteredSongs=songs;

currentRenderPage=1;

renderDiscover();

showPage("home");

navButtons[0].classList.add("active");

};

box.appendChild(card);

});

}

// ---------------- Album ----------------

function renderAlbums(){

const albums=[...new Set(

allSongs

.filter(s=>s.album)

.map(s=>s.album)

)];

const box=document.getElementById("albumList");

if(!box) return;

box.innerHTML="";

albums.forEach(album=>{

const songs=allSongs.filter(s=>s.album===album);

const card=document.createElement("div");

card.className="albumCard";

card.innerHTML=`

<img src="${songs[0]?.cover||'assets/default.png'}">

<h3>${escapeHtml(album)}</h3>

<p>${songs.length} Songs</p>

`;

card.onclick=()=>{

filteredSongs=songs;

currentRenderPage=1;

renderDiscover();

showPage("home");

navButtons[0].classList.add("active");

};

box.appendChild(card);

});

}

// ---------------- Recommendation ----------------

function renderRecommended(){

const history=

JSON.parse(

localStorage.getItem("history")

)||[];

let recommend=[];

if(history.length){

const favArtist=history[0].artist;

recommend=

allSongs.filter(

s=>s.artist===favArtist

);

}

if(recommend.length<10){

recommend=[

...recommend,

...allSongs.sort(()=>Math.random()-0.5)

];

}

recommendedSongs.innerHTML="";

recommend

.slice(0,10)

.forEach(song=>{

recommendedSongs.appendChild(

createSongCard(song)

);

});

}

// ---------------- Theme ----------------

const themeBtn=document.getElementById("themeBtn");

if(themeBtn){

themeBtn.onclick=toggleTheme;

}

function toggleTheme(){

document.body.classList.toggle("light");

localStorage.setItem(

"theme",

document.body.classList.contains("light")

?"light"

:"dark"

);

}

if(localStorage.getItem("theme")==="light"){

document.body.classList.add("light");

}

// ---------------- Init ----------------

window.addEventListener("load",()=>{

renderArtists();

renderAlbums();

renderRecommended();

});
// ======================================================
// MelodifyKH V3
// app.js PART 9
// Queue + Sleep Timer + Media Session + Keyboard
// ======================================================

// ---------------- Queue ----------------

let playQueue=[];

function addQueue(song){

playQueue.push(song);

renderQueue();

}

function renderQueue(){

const box=document.getElementById("queueSongs");

if(!box) return;

box.innerHTML="";

playQueue.forEach((song,index)=>{

const item=document.createElement("div");

item.className="queueSong";

item.innerHTML=`

<img src="${song.cover||'assets/default.png'}">

<div class="queueSongInfo">

<h3>${escapeHtml(song.title)}</h3>

<p>${escapeHtml(song.artist)}</p>

</div>

`;

item.onclick=()=>{

playSong(song);

playQueue.splice(index,1);

renderQueue();

};

box.appendChild(item);

});

}

audio.addEventListener("ended",()=>{

if(playQueue.length){

const next=playQueue.shift();

renderQueue();

playSong(next);

}

});

// ---------------- Sleep Timer ----------------

let sleepTimer=null;

document.querySelectorAll(".sleep-list button")

.forEach(btn=>{

btn.onclick=()=>{

const min=parseInt(btn.dataset.time);

clearTimeout(sleepTimer);

if(min!==0){

sleepTimer=setTimeout(()=>{

audio.pause();

showToast("😴 Sleep Timer Finished");

},min*60000);

}

document.getElementById("sleepModal")

.classList.add("hidden");

};

});

// ---------------- Media Session ----------------

if("mediaSession" in navigator){

navigator.mediaSession.setActionHandler(

"play",

()=>audio.play()

);

navigator.mediaSession.setActionHandler(

"pause",

()=>audio.pause()

);

navigator.mediaSession.setActionHandler(

"nexttrack",

()=>nextSong()

);

navigator.mediaSession.setActionHandler(

"previoustrack",

()=>prevSong()

);

}

audio.addEventListener("play",()=>{

if(currentSong && "mediaSession" in navigator){

navigator.mediaSession.metadata=

new MediaMetadata({

title:currentSong.title,

artist:currentSong.artist,

artwork:[

{

src:currentSong.cover,

sizes:"512x512",

type:"image/jpeg"

}

]

});

}

});

// ---------------- Keyboard ----------------

document.addEventListener("keydown",e=>{

switch(e.code){

case"Space":

e.preventDefault();

togglePlay();

break;

case"ArrowRight":

nextSong();

break;

case"ArrowLeft":

prevSong();

break;

}

});

// ---------------- Queue Button ----------------

document.getElementById("addQueue")

?.addEventListener("click",()=>{

if(currentSong){

addQueue(currentSong);

showToast("🎵 Added To Queue");

}

});
// ======================================================
// MelodifyKH V3
// app.js PART 10
// Offline + PWA + Infinite Scroll + Continue Playing
// ======================================================

// ---------------- Continue Playing ----------------

audio.addEventListener("pause",()=>{

localStorage.setItem("lastTime",audio.currentTime);

if(currentSong){

localStorage.setItem(

"lastSong",

currentSong.id

);

}

});

window.addEventListener("load",()=>{

const id=localStorage.getItem("lastSong");

const time=parseFloat(

localStorage.getItem("lastTime")||0

);

if(id){

const song=allSongs.find(s=>s.id===id);

if(song){

currentSong=song;

currentIndex=allSongs.indexOf(song);

audio.src=

"https://melodify-api-2mag.onrender.com/song/"+

song.file_id;

updatePlayer();

audio.currentTime=time;

}

}

});

// ---------------- Infinite Scroll ----------------

window.addEventListener("scroll",()=>{

if(

window.innerHeight+

window.scrollY>=

document.body.offsetHeight-300

){

const total=

Math.ceil(filteredSongs.length/SONG_PER_PAGE);

if(currentRenderPage<total){

currentRenderPage++;

const start=

(currentRenderPage-1)*SONG_PER_PAGE;

const end=start+SONG_PER_PAGE;

filteredSongs

.slice(start,end)

.forEach(song=>{

discoverSongs.appendChild(

createGridCard(song)

);

});

}

}

});

// ---------------- Offline ----------------

window.addEventListener("offline",()=>{

document.getElementById("offlineBanner")

.classList.remove("hidden");

});

window.addEventListener("online",()=>{

document.getElementById("offlineBanner")

.classList.add("hidden");

document.getElementById("onlineBanner")

.classList.remove("hidden");

setTimeout(()=>{

document.getElementById("onlineBanner")

.classList.add("hidden");

},3000);

});

// ---------------- Install App ----------------

let deferredPrompt=null;

window.addEventListener(

"beforeinstallprompt",

e=>{

e.preventDefault();

deferredPrompt=e;

document.getElementById("installPrompt")

.classList.remove("hidden");

});

document.getElementById("installBtn")

?.addEventListener("click",async()=>{

if(!deferredPrompt) return;

deferredPrompt.prompt();

await deferredPrompt.userChoice;

deferredPrompt=null;

document.getElementById("installPrompt")

.classList.add("hidden");

});

// ---------------- Register SW ----------------

if("serviceWorker" in navigator){

window.addEventListener("load",()=>{

navigator.serviceWorker.register(

"service-worker.js"

)

.then(()=>{

console.log("SW Registered");

})

.catch(console.error);

});

}

// ---------------- Auto Save Volume ----------------

audio.volume=parseFloat(

localStorage.getItem("volume")||1

);

audio.addEventListener("volumechange",()=>{

localStorage.setItem(

"volume",

audio.volume

);

});

// ======================================================
// END PART 10
// ======================================================
// ======================================================
// MelodifyKH V3
// app.js PART 11
// AI Recommendation + Trending + Most Played
// ======================================================

// ---------------- Play Counter ----------------

let playCounter = JSON.parse(
    localStorage.getItem("playCounter")
) || {};

function increasePlay(song){

    if(!song) return;

    playCounter[song.id] =
        (playCounter[song.id] || 0) + 1;

    localStorage.setItem(
        "playCounter",
        JSON.stringify(playCounter)
    );

}

audio.addEventListener("play",()=>{

    if(currentSong){

        increasePlay(currentSong);

    }

});

// ---------------- Trending ----------------

function renderTrending(){

    trendingSongs.innerHTML="";

    const list=[...allSongs]

    .sort((a,b)=>{

        return (playCounter[b.id]||0) -

               (playCounter[a.id]||0);

    })

    .slice(0,10);

    list.forEach(song=>{

        trendingSongs.appendChild(

            createSongCard(song)

        );

    });

}

// ---------------- Most Played ----------------

function renderMostPlayed(){

    const box=document.getElementById("mostPlayedSongs");

    if(!box) return;

    box.innerHTML="";

    [...allSongs]

    .sort((a,b)=>{

        return (playCounter[b.id]||0)-

               (playCounter[a.id]||0);

    })

    .slice(0,20)

    .forEach(song=>{

        box.appendChild(

            createSongCard(song)

        );

    });

}

// ---------------- AI Recommendation ----------------

function smartRecommend(){

    const history = JSON.parse(

        localStorage.getItem("history")

    ) || [];

    if(history.length===0){

        renderRecommended();

        return;

    }

    const artistCount={};

    history.forEach(song=>{

        artistCount[song.artist]=

        (artistCount[song.artist]||0)+1;

    });

    const favArtist=

    Object.keys(artistCount)

    .sort((a,b)=>

        artistCount[b]-artistCount[a]

    )[0];

    const recommend=

    allSongs.filter(song=>

        song.artist===favArtist

    );

    recommendedSongs.innerHTML="";

    recommend.slice(0,10)

    .forEach(song=>{

        recommendedSongs.appendChild(

            createSongCard(song)

        );

    });

}

// ---------------- Auto Follow Artist ----------------

function getFavoriteArtist(){

    const history=

    JSON.parse(

        localStorage.getItem("history")

    )||[];

    if(history.length===0)

        return null;

    const counter={};

    history.forEach(song=>{

        counter[song.artist]=

        (counter[song.artist]||0)+1;

    });

    return Object.keys(counter)

    .sort((a,b)=>

        counter[b]-counter[a]

    )[0];

}

// ---------------- Artist Badge ----------------

function updateFavoriteArtist(){

    const fav=getFavoriteArtist();

    const profile=

    document.getElementById("profilePage");

    if(!profile||!fav) return;

    let badge=

    document.getElementById("favoriteArtist");

    if(!badge){

        badge=document.createElement("p");

        badge.id="favoriteArtist";

        profile.prepend(badge);

    }

    badge.innerHTML=

    "🎤 Favorite Artist : "+fav;

}

// ---------------- Random Playlist ----------------

function randomPlaylist(){

    return [...allSongs]

    .sort(()=>Math.random()-0.5)

    .slice(0,30);

}

// ---------------- Refresh Home ----------------

function refreshHome(){

    renderTrending();

    smartRecommend();

    renderMostPlayed();

    updateFavoriteArtist();

}

setInterval(refreshHome,30000);

// ======================================================
// END PART 11
// ======================================================
// ======================================================
// MelodifyKH V3
// app.js PART 12
// Favorites + Recently Added + Voice Search + Dynamic Playlist
// ======================================================

// ---------------- Recently Added ----------------

function renderRecentlyAdded(){

const box=document.getElementById("recentSongs");

if(!box) return;

box.innerHTML="";

const list=[...allSongs]

.sort((a,b)=>new Date(b.addedAt)-new Date(a.addedAt))

.slice(0,15);

list.forEach(song=>{

box.appendChild(createSongCard(song));

});

}

// ---------------- Favorites Playlist ----------------

function getFavoriteSongs(){

const counter=JSON.parse(

localStorage.getItem("playCounter")

)||{};

return [...allSongs]

.sort((a,b)=>

(counter[b.id]||0)-(counter[a.id]||0)

)

.slice(0,20);

}

function renderFavoriteSongs(){

const box=document.getElementById("favoriteSongs");

if(!box) return;

box.innerHTML="";

getFavoriteSongs().forEach(song=>{

box.appendChild(createSongCard(song));

});

}

// ---------------- Dynamic Playlist ----------------

function createDynamicPlaylist(){

const history=JSON.parse(

localStorage.getItem("history")

)||[];

let playlist=[];

history.forEach(song=>{

playlist.push(

...allSongs.filter(s=>

s.artist===song.artist

)

);

});

playlist=[...new Map(

playlist.map(s=>[s.id,s])

).values()];

return playlist;

}

// ---------------- Voice Search ----------------

const SpeechRecognition=

window.SpeechRecognition||

window.webkitSpeechRecognition;

if(SpeechRecognition){

const recognition=new SpeechRecognition();

recognition.lang="km-KH";

recognition.onresult=e=>{

const text=e.results[0][0].transcript;

searchInput.value=text;

smartSearch();

};

const voiceBtn=document.getElementById("voiceSearch");

if(voiceBtn){

voiceBtn.onclick=()=>recognition.start();

}

}

// ---------------- Refresh ----------------

window.addEventListener("load",()=>{

renderRecentlyAdded();

renderFavoriteSongs();

});

// ======================================================
// END PART 12
// ======================================================
// ======================================================
// MelodifyKH V3
// app.js PART 13
// Lyrics + Equalizer + Audio Cache + Continue Playlist
// ======================================================

// ---------------- Lyrics ----------------

async function loadLyrics(song){

const box=document.getElementById("lyrics");

if(!box) return;

if(song.lyrics){

box.innerHTML=song.lyrics.replace(/\n/g,"<br>");

}else{

box.innerHTML="No Lyrics Available";

}

}

// ---------------- Update Player ----------------

const oldUpdatePlayer=updatePlayer;

updatePlayer=function(){

oldUpdatePlayer();

loadLyrics(currentSong);

updateMediaSession();

};

// ---------------- Equalizer ----------------

const equalizer=document.getElementById("equalizer");

audio.addEventListener("play",()=>{

if(equalizer)

equalizer.style.display="flex";

});

audio.addEventListener("pause",()=>{

if(equalizer)

equalizer.style.display="none";

});

// ---------------- Continue Playlist ----------------

function playPlaylist(list,index=0){

if(!list.length) return;

playSong(list[index]);

audio.onended=()=>{

index++;

if(index<list.length){

playSong(list[index]);

}else{

nextSong();

}

};

}

// ---------------- Random Mix ----------------

function playRandomMix(){

const list=[...allSongs]

.sort(()=>Math.random()-0.5)

.slice(0,30);

playPlaylist(list);

}

// ---------------- Favorite Mix ----------------

function playFavoriteMix(){

const list=getFavoriteSongs();

playPlaylist(list);

}

// ---------------- Recently Played Mix ----------------

function playHistoryMix(){

const list=JSON.parse(

localStorage.getItem("history")

)||[];

playPlaylist(list);

}

// ---------------- Audio Cache ----------------

const audioCache={};

function preloadSong(song){

if(!song||audioCache[song.id]) return;

const a=new Audio();

a.src="https://melodify-api-2mag.onrender.com/song/"+song.file_id;

audioCache[song.id]=a;

}

audio.addEventListener("play",()=>{

if(currentIndex+1<allSongs.length){

preloadSong(allSongs[currentIndex+1]);

}

});

// ---------------- Favorite Artist Playlist ----------------

function playFavoriteArtist(){

const artist=getFavoriteArtist();

if(!artist) return;

const list=allSongs.filter(

s=>s.artist===artist

);

playPlaylist(list);

}

// ======================================================
// END PART 13
// ======================================================
// ======================================================
// MelodifyKH V3
// app.js PART 14
// Smart Cache + Recently Played + Continue Play +
// Auto Next Artist + Performance Boost
// ======================================================

// ---------------- Smart Cache ----------------

const imageCache = {};

function preloadImage(url){

if(!url || imageCache[url]) return;

const img=new Image();

img.src=url;

imageCache[url]=true;

}

// ---------------- Preload Next 5 Covers ----------------

function preloadNextImages(){

for(let i=currentIndex+1;i<currentIndex+6;i++){

if(allSongs[i]){

preloadImage(allSongs[i].cover);

}

}

}

audio.addEventListener("play",preloadNextImages);

// ---------------- Continue Last Session ----------------

window.addEventListener("load",()=>{

const id=localStorage.getItem("lastSong");

if(!id) return;

const song=allSongs.find(s=>s.id===id);

if(song){

currentSong=song;

currentIndex=allSongs.indexOf(song);

updatePlayer();

}

});

// ---------------- Recently Played ----------------

function recentlyPlayed(){

const history=

JSON.parse(

localStorage.getItem("history")

)||[];

return history.slice(0,15);

}

// ---------------- Favorite Genre ----------------

function getFavoriteGenre(){

const history=

JSON.parse(

localStorage.getItem("history")

)||[];

const count={};

history.forEach(song=>{

const genre=song.genre||"Unknown";

count[genre]=(count[genre]||0)+1;

});

return Object.keys(count)

.sort((a,b)=>count[b]-count[a])[0];

}

// ---------------- Smart Auto Next ----------------

function smartNextSong(){

const artist=getFavoriteArtist();

const songs=

allSongs.filter(

s=>s.artist===artist

);

if(songs.length){

playSong(

songs[Math.floor(Math.random()*songs.length)]

);

}else{

nextSong();

}

}

// ---------------- Replace onEnded ----------------

audio.onended=()=>{

if(playQueue.length){

const song=playQueue.shift();

renderQueue();

playSong(song);

return;

}

if(isRepeat){

audio.currentTime=0;

audio.play();

return;

}

smartNextSong();

};

// ---------------- RAM Cleaner ----------------

setInterval(()=>{

Object.keys(audioCache)

.slice(10)

.forEach(key=>{

delete audioCache[key];

});

},300000);

// ---------------- Performance ----------------

function optimize(){

document

.querySelectorAll("img")

.forEach(img=>{

img.loading="lazy";

img.decoding="async";

});

}

window.addEventListener("load",optimize);

// ---------------- Statistics ----------------

function updateStatistics(){

const played=

JSON.parse(

localStorage.getItem("history")

)||[];

localStorage.setItem(

"statistics",

JSON.stringify({

played:played.length,

liked:likedSongs.length,

downloads:

(JSON.parse(

localStorage.getItem("downloads")

)||[]).length,

lastOpen:new Date()

})

);

}

setInterval(updateStatistics,60000);

// ======================================================
// END PART 14
// ======================================================
// ======================================================
// MelodifyKH V3
// app.js PART 15 (FINAL)
// Playlist + Notification + Crossfade + Error Recovery
// ======================================================

// ---------------- Playlist ----------------

let playlists = JSON.parse(
localStorage.getItem("playlists")
) || [];

function createPlaylist(name){

if(!name) return;

playlists.push({

id:"pl_"+Date.now(),

name:name,

songs:[]

});

savePlaylists();

}

function addSongToPlaylist(id,song){

const p=playlists.find(x=>x.id===id);

if(!p) return;

if(!p.songs.find(s=>s.id===song.id)){

p.songs.push(song);

savePlaylists();

showToast("✅ Added To Playlist");

}

}

function savePlaylists(){

localStorage.setItem(

"playlists",

JSON.stringify(playlists)

);

}

// ---------------- Notification ----------------

async function enableNotification(){

if(!("Notification" in window)) return;

if(Notification.permission==="default"){

await Notification.requestPermission();

}

}

audio.addEventListener("play",()=>{

if(Notification.permission==="granted"&&currentSong){

new Notification(currentSong.title,{

body:currentSong.artist,

icon:currentSong.cover

});

}

});

// ---------------- Crossfade ----------------

let crossfadeTime=3;

audio.addEventListener("timeupdate",()=>{

if(

audio.duration &&

audio.duration-audio.currentTime<=crossfadeTime

){

if(playQueue.length){

const next=playQueue[0];

preloadSong(next);

}

}

});

// ---------------- Auto Resume ----------------

document.addEventListener(

"visibilitychange",

()=>{

if(

!document.hidden &&

currentSong &&

isPlaying

){

audio.play().catch(()=>{});

}

});

// ---------------- Error Recovery ----------------

audio.addEventListener("error",()=>{

showToast("❌ Cannot Play Song");

setTimeout(()=>{

nextSong();

},1000);

});

// ---------------- Online Recovery ----------------

window.addEventListener("online",()=>{

showToast("✅ Internet Connected");

});

window.addEventListener("offline",()=>{

showToast("📡 Offline");

});

// ---------------- Favorite Artist Shortcut ----------------

const favArtistBtn=document.getElementById("artistCard");

if(favArtistBtn){

favArtistBtn.onclick=()=>{

const artist=getFavoriteArtist();

if(!artist) return;

filteredSongs=allSongs.filter(

s=>s.artist===artist

);

renderDiscover();

showPage("home");

};

}

// ---------------- Album Shortcut ----------------

const albumBtn=document.getElementById("albumCard");

if(albumBtn){

albumBtn.onclick=()=>{

renderAlbums();

showPage("home");

};

}

// ---------------- Random Discover ----------------

function discoverRandom(){

filteredSongs=[

...allSongs

]

.sort(()=>Math.random()-0.5);

renderDiscover();

}

// ---------------- Memory Cleanup ----------------

setInterval(()=>{

if(playQueue.length>100){

playQueue.splice(100);

}

},300000);

// ---------------- Startup ----------------

window.addEventListener("load",()=>{

enableNotification();

optimize();

renderArtists();

renderAlbums();

renderTrending();

renderRecommended();

renderDiscover();

renderFavoriteSongs();

renderRecentlyAdded();

updateProfile();

});

// ======================================================
// MelodifyKH V3 Finished
// ======================================================
