// 1.Generate all section using data and JSON
// 2. Add event listeners to play Audio
// 3.audio navbar
// 4-scroll StaticRange
// 5-quey

// constant
const musicLibsContainer = document.getElementById('music-libs');
const audioPlayer = document.getElementById('audio_Player');
const pausedBtn = document.getElementById('paused');
const playingBtn = document.getElementById('playing');

const songCurrentTime = document.getElementById('songTimeStart')
const songTotalTime = document.getElementById('songTotalTime')

var currentSongObj ={};
var defaultImage ="assests/images/defaultImage.gif";


// core app logic
window.addEventListener('load',bootUpApp);

function bootUpApp(){
    fetchAndRenderAllSections();
}

function fetchAndRenderAllSections(){
    //fetch all section data
    fetch('/assests/js/ganna.json')
    .then(res=>res.json())
    .then(res=>{
        console.table('response',res);
        const {cardbox} = res;
        if(Array.isArray(cardbox) && cardbox.length){
            cardbox.forEach(section => {
                const{songsbox , songscards} = section;
                 renderSection(songsbox,songscards);
            }) 
        }
        
    })
    .catch(()=>{
        alert('error failing data');
    })
    
}

function renderSection(title,songsList){
    const songsSection = makeSectionDom(title,songsList);
    musicLibsContainer.appendChild(songsSection);
}
function makeSectionDom(title,songsList){
     const sectionDiv = document.createElement('div');
     sectionDiv.className = 'songs-sections';

     // add songs html
     sectionDiv.innerHTML = `
        <h2 class="section-heading">${title}</h2>
        <div class ="songs-cont">
             ${songsList.map(songObj=>buildSongCardDom(songObj)).join('')}
        </div>
     `
     console.log(sectionDiv);
     return sectionDiv;
}
function buildSongCardDom(songObj){
    return `
    <div class="song-card" onclick="playSong(this)" data-songobj='${JSON.stringify(songObj)}'>
        <div class="img-cont">
            <img src="/${songObj.image_source}" alt="${songObj.song_name}">
            <div class="overlay"></div>
    </div>
    <p class="song-name">${songObj.song_name}</p>
</div>`;
}

//Music Player Functions
function playSong(songCardEl){
    
    const songObj = JSON.parse(songCardEl.dataset.songobj);
    console.log(songObj, "song");
    setAndPlayCurrentSong(songObj)

    document.getElementById('music-player').classList.remove('hidden');

}
function setAndPlayCurrentSong(songObj){
    currentSongObj = songObj ;
    audioPlayer?.pause();
    const result = songObj.quality.low;
    // audioPlayer?.src= songObj.quality.low;
    audioPlayer.currentTime = 0;
    audioPlayer.play();
   

    updatePlayerUi(songObj);
}

function updatePlayerUi(songObj){
    const songImg = document.getElementById('song-img');
    const songName = document.getElementById('song-name');
    
    
    songImg.src = songObj.image_source;
    songName.innerHTML = songObj.song_name;

    songCurrentTime.innerHTML = audioPlayer.currentTime;
    
    
    pausedBtn.style.display = 'none';
    playingBtn.style.display = 'block';
}

function togglePlayer(){
    if(audioPlayer.paused) {
    audioPlayer.play();
    
    }
    else {
        audioPlayer?.pause();
    }

    pausedBtn.style.display = audioPlayer?.paused ? 'block': 'none';
    playingBtn.style.display = audioPlayer?.paused ? 'none': 'block';
    
}

// console.log(togglePlayer, "toggle function call here");


function updatePlayerTime (){
    if(!audioPlayer || audioPlayer.paused) 
    
    return;

    const songCurrentTime = document.getElementsById('songTimeStart');
    songCurrentTime.innerHTML = getTimeString(audioPlayer.currentTime);

    songTotalTime.innerHTML = getTimeString(audioPlayer.duration);
}

function getTimeString(time){
    return isNan(audioPlayer.duration)?"0:00":Math.floor(time/60)+":"+parseInt((((time/60)%1)*100).toPrecision(2));
}

