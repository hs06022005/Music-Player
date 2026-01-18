/* ==== SONG DATA ==== */
var songList = [
    {songName:"Radhe Radhe",songPath:"song/0.mp3"},
    {songName:"boom boom",songPath:"song/1.mp3"},
    {songName:"Gafoor",songPath:"song/2.mp3"},
    {songName:"gina",songPath:"song/3.mp3"},
    {songName:"sason_ki mala",songPath:"song/4.mp3"},
    {songName:"kantara",songPath:"song/5.mp3"},
    {songName:"Radhe Radhe",songPath:"song/6.mp3"},
    {songName:"boom boom",songPath:"song/7.mp3"},
    {songName:"Gafoor",songPath:"song/8.mp3"},
    {songName:"gina",songPath:"song/9.mp3"},
    {songName:"sason_ki mala",songPath:"song/10.mp3"},
];

/* ==== DOM ==== */
const songContainer = document.getElementById("song-list");
const search = document.getElementById("search");
const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const progress = document.getElementById("progress");
const curr = document.getElementById("curr");
const dur = document.getElementById("dur");
const nowPlaying = document.getElementById("now-playing");

// Navigation
const navHome = document.getElementById("nav-home");
const navLibrary = document.getElementById("nav-library");
const navAbout = document.getElementById("nav-about");

// Themes popup
const themeSelect = document.getElementById("theme-select");
const themeMenu = document.getElementById("theme-menu");

/* ==== STATE ==== */
let visibleSongs = [...songList];
let index = 0;
let audio = new Audio(visibleSongs[0].songPath);

/* ==== RENDER SONG LIST ==== */
function render(list){
    visibleSongs = list;
    songContainer.innerHTML = list.map((s,i)=>`
        <div class="song-item">
            <span>${s.songName}</span>
            <button class="song-play" data-id="${i}">▶</button>
        </div>
    `).join("");
}
render(songList);

/* ==== PLAY SONG ==== */
function playSong(i){
    index = i;
    audio.src = visibleSongs[index].songPath;
    audio.play();
    playBtn.textContent = "⏸";
    updateButtons();
    updateNowPlaying();
}

/* ==== BUTTON SYNC ==== */
function updateButtons(){
    document.querySelectorAll(".song-play").forEach((btn,i)=>{
        btn.textContent = (i === index && !audio.paused) ? "⏸" : "▶";
    });
}

/* ==== NOW PLAYING ==== */
function updateNowPlaying(){
    nowPlaying.textContent = "Playing: " + visibleSongs[index].songName;
}

/* ==== CLICK SONG ITEM ==== */
document.addEventListener("click",e=>{
    if(e.target.classList.contains("song-play")){
        let id = parseInt(e.target.dataset.id);
        if(id === index && !audio.paused){
            audio.pause();
        } else {
            playSong(id);
        }
        playBtn.textContent = audio.paused ? "▶" : "⏸";
        updateButtons();
    }
});

/* ==== MAIN PLAY BUTTON ==== */
playBtn.onclick = ()=>{
    if(audio.paused){
        audio.play();
    } else {
        audio.pause();
    }
    playBtn.textContent = audio.paused ? "▶" : "⏸";
    updateButtons();
};

/* ==== SEARCH ==== */
search.oninput = ()=>{
    const v = search.value.toLowerCase();
    render(songList.filter(s=>s.songName.toLowerCase().includes(v)));
    updateButtons();
};

/* ==== NEXT / PREV ==== */
nextBtn.onclick = ()=> playSong((index+1) % visibleSongs.length);
prevBtn.onclick = ()=> playSong((index-1+visibleSongs.length) % visibleSongs.length);

/* ==== PROGRESS BAR ==== */
audio.ontimeupdate = ()=>{
    if(audio.duration){
        progress.value = (audio.currentTime / audio.duration) * 100;
        curr.textContent = format(audio.currentTime);
        dur.textContent = format(audio.duration);
    }
};

progress.oninput = ()=>{
    audio.currentTime = (progress.value * audio.duration) / 100;
};

audio.onended = ()=> nextBtn.onclick();

/* ==== TIME FORMAT ==== */
function format(t){
    let m = Math.floor(t/60);
    let s = Math.floor(t%60).toString().padStart(2,"0");
    return `${m}:${s}`;
}

/* ==== PAGE NAVIGATION ==== */
function show(page){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
    document.getElementById(page).classList.add("active");

    document.querySelectorAll(".menu a").forEach(a=>a.classList.remove("active"));
}

navHome.onclick = ()=>{ show("page-home"); navHome.classList.add("active"); }
navLibrary.onclick = ()=>{ show("page-library"); navLibrary.classList.add("active"); }
navAbout.onclick = ()=>{ show("page-about"); navAbout.classList.add("active"); }

/* ==== THEME SYSTEM ==== */
function setTheme(t){
    document.body.className = "theme" + t;
}

// Popup open/close
themeSelect.onclick = ()=>{
    themeMenu.classList.toggle("show");
};

// Choose theme
themeMenu.onclick = (e)=>{
    if(e.target.dataset.theme){
        setTheme(e.target.dataset.theme);
        themeSelect.textContent = "Theme: " + e.target.innerText + " ▾";
        themeMenu.classList.remove("show");
    }
};

/* Default theme */
setTheme("A");
