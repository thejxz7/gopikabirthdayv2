/* ==========================================
   PROJECT GOPU V2
   Phase 1
========================================== */

const canvas = document.getElementById("sky");
const ctx = canvas.getContext("2d");

let w, h;

function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

/* ==========================================
        PARTICLES
========================================== */

const particles = [];

const PARTICLE_COUNT =
window.innerWidth < 768 ? 80 : 150;

const mouse = {
    x: null,
    y: null
};

class Particle{

    constructor(){

        this.reset();

        this.x = Math.random()*w;
        this.y = Math.random()*h;

    }

    reset(){

        this.size = Math.random()*2+0.5;

        this.speedX = (Math.random()-0.5)*0.25;
        this.speedY = (Math.random()-0.5)*0.25;

        this.opacity = Math.random()*0.8+0.2;

        this.glow = Math.random()*12+8;

    }

    update(){

        this.x += this.speedX;
        this.y += this.speedY;

        if(this.x<0) this.x=w;
        if(this.x>w) this.x=0;

        if(this.y<0) this.y=h;
        if(this.y>h) this.y=0;

        if(mouse.x!==null){

            const dx=this.x-mouse.x;
            const dy=this.y-mouse.y;

            const dist=Math.sqrt(dx*dx+dy*dy);

            if(dist<120){

                this.x += dx*0.03;
                this.y += dy*0.03;

            }

        }

    }

    draw(){

        ctx.beginPath();

        ctx.fillStyle=`rgba(255,255,255,${this.opacity})`;

        ctx.shadowBlur=this.glow;

        ctx.shadowColor="white";

        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);

        ctx.fill();

    }

}

for(let i=0;i<PARTICLE_COUNT;i++){

    particles.push(new Particle());

}

/* ==========================================
        TOUCH / MOUSE
========================================== */

window.addEventListener("mousemove",(e)=>{

    mouse.x=e.clientX;
    mouse.y=e.clientY;

});

window.addEventListener("touchmove",(e)=>{

    mouse.x=e.touches[0].clientX;
    mouse.y=e.touches[0].clientY;

},{passive:true});

window.addEventListener("mouseleave",()=>{

    mouse.x=null;
    mouse.y=null;

});

window.addEventListener("touchend",()=>{

    mouse.x=null;
    mouse.y=null;

});

/* ==========================================
        SHOOTING STAR
========================================== */

const shootingLayer=document.getElementById("shooting-stars");

function createShootingStar(){

    const star=document.createElement("div");

    star.className="shooting-star";

    star.style.top=Math.random()*40+"vh";

    star.style.left="-150px";

    shootingLayer.appendChild(star);

    setTimeout(()=>{

        star.remove();

    },2500);

}

setInterval(()=>{

    createShootingStar();

},20000+Math.random()*15000);

/* ==========================================
        COUNTDOWN
========================================== */

const targetDate=new Date("2026-07-19T00:00:00+05:30");

/* TEST MODE:
   Visit the page with ?test=1 at the end of the URL
   (e.g. index.html?test=1) to force the site into the
   unlocked state for testing, WITHOUT touching this file
   or the target date. Remove ?test=1 (or just don't use it)
   to see the real locked site. This is the only thing you
   need for testing — you should not need to edit targetDate
   at all going forward. */
const urlParams = new URLSearchParams(window.location.search);
const forceUnlock = urlParams.get("test") === "1";

console.log("[Countdown Debug] targetDate parsed as:", targetDate);
console.log("[Countdown Debug] targetDate is valid:", !isNaN(targetDate.getTime()));
console.log("[Countdown Debug] browser's current date/time:", new Date());
console.log("[Countdown Debug] test mode forced unlock:", forceUnlock);

const days=document.getElementById("days");
const hours=document.getElementById("hours");
const minutes=document.getElementById("minutes");
const seconds=document.getElementById("seconds");

const beginBtn=document.getElementById("beginBtn");
const status=document.getElementById("statusText");

let lockCelebrated=false;

function updateCountdown(){

    const now=new Date();

    const diff=forceUnlock ? -1 : targetDate-now;

    if(diff<=0){

        days.textContent="00";
        hours.textContent="00";
        minutes.textContent="00";
        seconds.textContent="00";

        status.innerHTML="🎉 It's officially your birthday!";

        beginBtn.disabled=false;

        beginBtn.classList.add("unlocked");

        beginBtn.innerHTML="❤️ Begin";

        if(!lockCelebrated){

            lockCelebrated=true;

            burstHearts(24);

        }

        return;

    }

    lockCelebrated=false;

    const d=Math.floor(diff/86400000);

    const h=Math.floor(diff%86400000/3600000);

    const m=Math.floor(diff%3600000/60000);

    const s=Math.floor(diff%60000/1000);

    days.textContent=String(d).padStart(2,"0");
    hours.textContent=String(h).padStart(2,"0");
    minutes.textContent=String(m).padStart(2,"0");
    seconds.textContent=String(s).padStart(2,"0");

    beginBtn.disabled=true;

    beginBtn.classList.remove("unlocked");

    beginBtn.innerHTML="🔒 Locked Until Midnight";

}

setInterval(updateCountdown,1000);

updateCountdown();

/* ==========================================
        ANIMATION LOOP
========================================== */

function animate(){

    ctx.clearRect(0,0,w,h);

    particles.forEach(p=>{

        p.update();

        p.draw();

    });

    requestAnimationFrame(animate);

}

animate();

/* ==========================================
        SENSORY UTILITIES
========================================== */

function vibrate(ms=50){

    if(navigator.vibrate){

        try{ navigator.vibrate(ms); }catch(e){}

    }

}

let audioCtx = null;

function playClickSound(){

    try{

        if(!audioCtx){

            audioCtx = new (window.AudioContext||window.webkitAudioContext)();

        }

        if(audioCtx.state === "suspended"){

            audioCtx.resume();

        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.value = 540;

        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime+0.12);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime+0.12);

    }catch(e){}

}

function burstHearts(count=18){

    const emojis=["❤️","💗","💕","✨"];

    for(let i=0;i<count;i++){

        const el=document.createElement("div");

        el.className="confetti-piece";

        el.textContent=emojis[Math.floor(Math.random()*emojis.length)];

        el.style.left=Math.random()*100+"vw";

        el.style.fontSize=(14+Math.random()*18)+"px";

        el.style.animationDuration=(2.5+Math.random()*2)+"s";

        el.style.animationDelay=(Math.random()*0.5)+"s";

        document.body.appendChild(el);

        setTimeout(()=>el.remove(),5200);

    }

}

/* ==========================================
        PROGRESS DOTS
========================================== */

const sceneOrder=["lock","question","instagram","gallery","letter","love","timer","ending","meetup"];

const dotEls=document.querySelectorAll("#progressDots .dot");

function setActiveDot(name){

    const idx=sceneOrder.indexOf(name);

    dotEls.forEach(d=>{

        const dIdx=sceneOrder.indexOf(d.dataset.scene);

        d.classList.toggle("active", dIdx===idx);

        d.classList.toggle("done", dIdx<idx);

    });

}

/* ==========================================
        PHASE 2
========================================== */

const moonEl=document.getElementById("moonEl");
const moonWrapper=document.getElementById("moonWrapper");
const moonPopup=document.getElementById("moonPopup");
const moonMessage=document.getElementById("moonMessage");

let moonPressTimer=null;

function startMoonPress(){

    moonPressTimer=setTimeout(()=>{

        moonEl.classList.add("glowing");

        moonMessage.innerHTML="Paayelmulli...<br>only fear i have after marriage is your payel mullal ❤️";

        moonPopup.classList.remove("hidden");

        vibrate(80);

    },800);

}

function cancelMoonPress(){

    clearTimeout(moonPressTimer);

}

moonEl.addEventListener("mousedown",startMoonPress);
moonEl.addEventListener("touchstart",startMoonPress,{passive:true});

moonEl.addEventListener("mouseup",cancelMoonPress);
moonEl.addEventListener("mouseleave",cancelMoonPress);
moonEl.addEventListener("touchend",cancelMoonPress);
moonEl.addEventListener("touchcancel",cancelMoonPress);

moonPopup.addEventListener("click",()=>{

    moonPopup.classList.add("hidden");

    moonEl.classList.remove("glowing");

});

/* -----------------------
   PARALLAX (mouse + tilt)
------------------------ */

window.addEventListener("mousemove",(e)=>{

    const relX=(e.clientX/window.innerWidth)-0.5;
    const relY=(e.clientY/window.innerHeight)-0.5;

    moonWrapper.style.transform=`translate(${relX*-24}px, ${relY*-24}px)`;

});

function handleTilt(e){

    const tiltX=(e.gamma||0)/45;
    const tiltY=(e.beta||0)/90;

    moonWrapper.style.transform=`translate(${tiltX*-20}px, ${tiltY*-14}px)`;

}

function requestTiltPermission(){

    if(typeof DeviceOrientationEvent!=="undefined" && typeof DeviceOrientationEvent.requestPermission==="function"){

        DeviceOrientationEvent.requestPermission().then(state=>{

            if(state==="granted"){

                window.addEventListener("deviceorientation",handleTilt);

            }

        }).catch(()=>{});

    }else if(typeof DeviceOrientationEvent!=="undefined"){

        window.addEventListener("deviceorientation",handleTilt);

    }

}

const scene1 = document.getElementById("scene1");

const questionPopup = document.getElementById("questionPopup");

const instagramScene = document.getElementById("instagramScene");

const askBtn = document.getElementById("askBtn");

const typing = document.getElementById("typing");

const messageContainer = document.getElementById("messageContainer");

const choiceArea = document.getElementById("choiceArea");

const yesBtn = document.getElementById("yesBtn");

const noBtn = document.getElementById("noBtn");

/* -----------------------
   BEGIN BUTTON
------------------------ */

beginBtn.addEventListener("click",()=>{

    unlockMusic();

    requestTiltPermission();

    vibrate(50);

    playClickSound();

    scene1.style.display="none";

    questionPopup.classList.remove("hidden");

    setActiveDot("question");

});

/* -----------------------
   ASK BUTTON
------------------------ */

askBtn.addEventListener("click",()=>{

    vibrate(40);

    playClickSound();

    questionPopup.classList.add("hidden");

    instagramScene.classList.remove("hidden");

    setActiveDot("instagram");

    startInstagram();

});

/* -----------------------
   ADD MESSAGE
------------------------ */

function addMessage(text){

    const div=document.createElement("div");

    div.className="message";

    div.innerHTML=text;

    messageContainer.appendChild(div);

    messageContainer.scrollTop=messageContainer.scrollHeight;

}

/* -----------------------
   INSTAGRAM FLOW
------------------------ */

function startInstagram(){

    typing.classList.remove("hidden");

    setTimeout(()=>{

        typing.classList.add("hidden");

        addMessage("JCETyil aano padikunnath?");

        setTimeout(()=>{

            addMessage("Do you remember this? ❤️");

            choiceArea.classList.remove("hidden");

        },1800);

    },2200);

}

/* -----------------------
   YES
------------------------ */

yesBtn.addEventListener("click",()=>{

    vibrate(50);

    playClickSound();

    choiceArea.classList.add("hidden");

    addMessage("Correct ❤️");

setTimeout(()=>{

addMessage("Let's continue...");

setTimeout(()=>{

startGallery();

},1800);

},1200);

});

/* -----------------------
   NO
------------------------ */

noBtn.addEventListener("click",()=>{

    vibrate(50);

    playClickSound();

    choiceArea.classList.add("hidden");

    addMessage("😂😂");

    setTimeout(()=>{

        addMessage("Allengil venda...");

    },900);

    setTimeout(()=>{

addMessage("Njan avdeya padikunne ❤️");

setTimeout(()=>{

startGallery();

},1800);

},1900);

});

/* =====================================================
                MEMORY GALLERY
===================================================== */

const galleryScene = document.getElementById("galleryScene");

const memoryImage = document.getElementById("memoryImage");
const memoryTitle = document.getElementById("memoryTitle");
const memoryText = document.getElementById("memoryText");
const progressBar = document.getElementById("progressBar");

/* -----------------------
   YOUR MEMORIES
------------------------ */

const memories = [

{
image:"images/1.jpg",
title:"The Beginning ❤️",
text:"The day a simple Instagram message changed my life."
},

{
image:"images/2.jpg",
title:"Us",
text:"Every picture with you became one of my favourites."
},

{
image:"images/3.jpg",
title:"Smiles",
text:"Your smile is still my favourite view."
},

{
image:"images/4.jpg",
title:"Together",
text:"Every little moment became a memory worth keeping."
},

{
image:"images/5.jpg",
title:"Scooby ❤️",
text:"The nickname that always makes me smile."
},

{
image:"images/6.jpg",
title:"Forever",
text:"If I could relive one chapter again and again, I'd choose us."
},

{
image:"images/7.jpg",
title:"Laugh",
text:"One laugh from you can fix my entire day."
},

{
image:"images/8.jpg",
title:"My Favourite Person",
text:"Thank you for simply being you."
},

{
image:"images/9.jpg",
title:"Almost There...",
text:"One more memory before the next chapter..."
},

{
image:"images/10.jpg",
title:"Happy Birthday Gopu ❤️",
text:"This is only the beginning of today's surprise."
}

];

let currentMemory = 0;
let galleryAdvanceTimeout = null;

const starRating = document.getElementById("starRating");
const memoryReveal = document.getElementById("memoryReveal");
const starEls = starRating.querySelectorAll(".star");

function setStars(val){

    starEls.forEach(s=>{

        s.classList.toggle("selected", parseInt(s.dataset.value,10)<=val);

    });

}

starEls.forEach(star=>{

    star.addEventListener("click",()=>{

        const val=parseInt(star.dataset.value,10);

        setStars(val);

        vibrate(30);

        playClickSound();

        memoryReveal.classList.remove("hidden");

        clearTimeout(galleryAdvanceTimeout);

        galleryAdvanceTimeout=setTimeout(advanceGallery,4000);

    });

});

/* -----------------------
   SHOW MEMORY
------------------------ */

function showMemory(index){

memoryImage.style.opacity=0;

setStars(0);

memoryReveal.classList.add("hidden");

const nextSrc=memories[index].image;

const preloader=new Image();

preloader.src=nextSrc;

function reveal(){

memoryImage.src=nextSrc;

memoryTitle.innerHTML=memories[index].title;

memoryText.innerHTML=memories[index].text;

progressBar.style.width=((index+1)/memories.length)*100+"%";

requestAnimationFrame(()=>{

requestAnimationFrame(()=>{

memoryImage.style.opacity=1;

});

});

}

setTimeout(()=>{

if(preloader.complete){

reveal();

}else{

preloader.onload=reveal;

preloader.onerror=reveal;

}

},620);

}

/* -----------------------
   ADVANCE GALLERY
------------------------ */

function advanceGallery(){

currentMemory++;

if(currentMemory>=memories.length){

setTimeout(()=>{

galleryScene.classList.add("hidden");

typeLetter();

},1000);

return;

}

showMemory(currentMemory);

}

/* -----------------------
   START GALLERY
------------------------ */

function startGallery(){

instagramScene.classList.add("hidden");

galleryScene.classList.remove("hidden");

setActiveDot("gallery");

if(bgMusic.paused){

    bgMusic.play().catch(()=>{});

}

currentMemory=0;

showMemory(0);

}

/* =====================================================
                LETTER
===================================================== */

const letterScene=document.getElementById("letterScene");

const letterText=document.getElementById("letterText");

const continueBtn=document.getElementById("continueBtn");

const cursor=document.getElementById("cursor");

const birthdayLetter=`Dear Gopu,

Happy Birthday ❤️

From the very first message...

"JCETyil aano padikunnath?"

...I never imagined that one simple conversation would become the most beautiful chapter of my life.

Every laugh, every call, every memory and every moment with you has become something I cherish.

Thank you for being my safe place.

Thank you for being you.

I love you.

Forever,

Thejus ❤️`;

async function typeLetter(){

letterScene.classList.remove("hidden");

setActiveDot("letter");

duckMusicForVoice();

let i=0;

function type(){

if(i<birthdayLetter.length){

letterText.innerHTML+=birthdayLetter.charAt(i);

if(i%4===0){ playClickSound(); }

i++;

setTimeout(type,35);

}else{

continueBtn.classList.remove("hidden");

}

}

type();

}

/* =======================================
        LOVE SCENE
======================================= */

const continueButton=document.getElementById("continueBtn");

const loveScene=document.getElementById("loveScene");

const bigHeart=document.getElementById("bigHeart");

const loveTitle=document.getElementById("loveTitle");

const loveReason=document.getElementById("loveReason");

const reasons=[

"Your laugh 😊",

"Your beautiful hair ❤️",

"Your character.\nThe person you are."

];

let reasonIndex=0;

continueButton.addEventListener("click",()=>{

vibrate(40);

playClickSound();

if(voiceNote && !voiceNote.paused){

    voiceNote.pause();

    restoreMusicVolume();

}

letterScene.classList.add("hidden");

loveScene.classList.remove("hidden");

setActiveDot("love");

});

bigHeart.addEventListener("click",()=>{

vibrate(35);

playClickSound();

if(reasonIndex<reasons.length){

loveTitle.innerHTML="";

loveReason.innerHTML=reasons[reasonIndex];

reasonIndex++;

}

else{

loveScene.classList.add("hidden");

timerScene.classList.remove("hidden");

setActiveDot("timer");

startRelationshipTimer();

}

});

/* =====================================================
        RELATIONSHIP TIMER
===================================================== */

const timerScene=document.getElementById("timerScene");

const timerContinue=document.getElementById("timerContinue");

/* ==========================================
        RELATIONSHIP TIMER
========================================== */

const relationshipStart = new Date("2025-02-15T16:32:00");

const relYears = document.getElementById("relYears");
const relMonths = document.getElementById("relMonths");
const relDays = document.getElementById("relDays");
const relHours = document.getElementById("relHours");
const relMinutes = document.getElementById("relMinutes");
const relSeconds = document.getElementById("relSeconds");

let relationshipInterval = null;

function updateRelationshipTimer(){

    const now = new Date();

    let temp = new Date(relationshipStart);

    let years = 0;
    let months = 0;

    while (true) {

        const next = new Date(temp);
        next.setFullYear(next.getFullYear() + 1);

        if (next <= now) {

            years++;
            temp = next;

        } else {

            break;

        }

    }

    while (true) {

        const next = new Date(temp);
        next.setMonth(next.getMonth() + 1);

        if (next <= now) {

            months++;
            temp = next;

        } else {

            break;

        }

    }

    let remaining = now - temp;

    const days = Math.floor(remaining / 86400000);
    remaining %= 86400000;

    const hours = Math.floor(remaining / 3600000);
    remaining %= 3600000;

    const minutes = Math.floor(remaining / 60000);
    remaining %= 60000;

    const seconds = Math.floor(remaining / 1000);

    relYears.textContent = years;
    relMonths.textContent = months;
    relDays.textContent = days;
    relHours.textContent = String(hours).padStart(2, "0");
    relMinutes.textContent = String(minutes).padStart(2, "0");
    relSeconds.textContent = String(seconds).padStart(2, "0");

}

function startRelationshipTimer(){

    updateRelationshipTimer();

    timerContinue.classList.add("hidden");

setTimeout(()=>{

    timerContinue.classList.remove("hidden");

},8000);

    if (relationshipInterval) {

        clearInterval(relationshipInterval);

    }

    relationshipInterval = setInterval(updateRelationshipTimer, 1000);

}

/* =====================================================
                ENDING
===================================================== */

const endingScene=document.getElementById("endingScene");

const endingTitle=document.getElementById("endingTitle");
const endingText=document.getElementById("endingText");
const endingSignature=document.getElementById("endingSignature");
const endingContinue=document.getElementById("endingContinue");

endingContinue.addEventListener("click",()=>{

    vibrate(50);

    playClickSound();

    stopWordsLayer();

    startMeetupCountdown();

});

async function showEnding(){

    timerScene.classList.add("hidden");

    endingScene.classList.remove("hidden");

    endingScene.classList.remove("sunrise");

    setActiveDot("ending");

    fadeMusic();

    burstHearts(24);

    startWordsLayer();

    endingTitle.innerHTML="";

    endingText.innerHTML="";

    endingSignature.innerHTML="";
    endingSignature.style.opacity=0;

    const messages=[

        "This website ends here.",

        "But our story doesn't.",

        "",

        "Everything started with one small message...",

        "\"JCETyil aano padikunnath?\"",

        "",

        "And today...",

        "I'm grateful it did.",

        "",

        "Happy Birthday Gopu ❤️"

    ];

    let i=0;

    function next(){

        if(i>=messages.length){

            endingScene.classList.add("sunrise");

            endingSignature.innerHTML='<span class="signature-text">— Thejus ❤️</span>';

            endingSignature.style.opacity=1;

            setTimeout(()=>{

                endingContinue.classList.remove("hidden");

            },2200);

            return;

        }

        endingText.innerHTML+=messages[i]+"<br>";

        playClickSound();

        i++;

        setTimeout(next,1700);

    }

    next();

}

/* ==========================================
            BACKGROUND MUSIC
========================================== */

const bgMusic = document.getElementById("bgMusic");
const voiceNote = document.getElementById("voiceNote");

let musicUnlocked = false;

function unlockMusic(){

    if(musicUnlocked) return;

    musicUnlocked = true;

    bgMusic.volume = 0.35;

    bgMusic.play().then(()=>{

        bgMusic.pause();

        bgMusic.currentTime = 0;

    }).catch(()=>{});

}

function fadeMusic(){

    const fade = setInterval(()=>{

        if(bgMusic.volume > 0.02){

            bgMusic.volume -= 0.02;

        }else{

            bgMusic.volume = 0;

            bgMusic.pause();

            clearInterval(fade);

        }

    },200);

}

function fadeVolumeTo(audioEl, target, duration){

    const start=audioEl.volume;

    const steps=20;

    const stepTime=duration/steps;

    let count=0;

    const iv=setInterval(()=>{

        count++;

        const v=start+(target-start)*(count/steps);

        audioEl.volume=Math.max(0,Math.min(1,v));

        if(count>=steps){

            audioEl.volume=target;

            clearInterval(iv);

        }

    },stepTime);

}

function duckMusicForVoice(){

    fadeVolumeTo(bgMusic,0.25,600);

    if(!voiceNote) return;

    voiceNote.volume=0.75;

    voiceNote.currentTime=0;

    voiceNote.play().catch(()=>{});

    voiceNote.onended=restoreMusicVolume;

}

function restoreMusicVolume(){

    fadeVolumeTo(bgMusic,0.35,800);

}

timerContinue.addEventListener("click",()=>{

    vibrate(50);

    playClickSound();

    showEnding();

});

/* ==========================================
        HER WORDS / MY WORDS (EASTER EGG)
========================================== */

const wordsLayer = document.getElementById("wordsLayer");

const herWords = [
"JCETyil aano padikunnath?",
"Thannik valorant aano njn aano valuth?",
"Veetil vilichit enne vilichamathi.",
"Theeejusseee",
"Enik thante kann nalla Ishta.",
"Nammal ndha dora buji kalikuvano.",
"Thante oru odukathhe oru game kali.",
"Verthe alla srlxmi itt poyath",
"Enik thanne Kalyanm kazhikanam",
"Enne sherikum ishtano",
"Thanik game aa valuth"
];

const myWords = [
"Ninte sound nalla rasam aanu.",
"Enik thante chiri nalla ishtanu",
"Njan ippo ee game theerth varam",
"Oru game vavachaneyt kalichit varam",
"Nandu game kalikan vilikunu",
"Enik ninne kaananam"
];

let wordsInterval = null;

const wordLanes=[8,19,30,41,52,63,74,85];
let laneIndex=0;

function spawnWordLine(){

    if(!wordsLayer) return;

    const totalHer=herWords.length;
    const totalAll=herWords.length+myWords.length;

    const isHer=Math.random()<(totalHer/totalAll);

    const pool=isHer?herWords:myWords;

    const text=pool[Math.floor(Math.random()*pool.length)];

    const line=document.createElement("div");

    line.className="drift-line "+(isHer?"her-word":"my-word");

    line.textContent=text;

    const lane=wordLanes[laneIndex % wordLanes.length];

    laneIndex++;

    const jitter=(Math.random()*4)-2;

    line.style.top=(lane+jitter)+"%";

    const fromLeft=Math.random()<0.5;

    if(fromLeft){

        line.classList.add("from-left");

        line.style.left="-45%";

    }else{

        line.classList.add("from-right");

        line.style.right="-45%";

    }

    const duration=16+Math.random()*8;

    line.style.animationDuration=duration+"s";

    wordsLayer.appendChild(line);

    setTimeout(()=>line.remove(),duration*1000+400);

}

function startWordsLayer(){

    if(!wordsLayer) return;

    wordsLayer.innerHTML="";

    laneIndex=0;

    for(let i=0;i<8;i++){

        setTimeout(spawnWordLine,i*350);

    }

    if(wordsInterval){ clearInterval(wordsInterval); }

    wordsInterval=setInterval(spawnWordLine,1700);

}

function stopWordsLayer(){

    if(wordsInterval){ clearInterval(wordsInterval); }

    if(wordsLayer){ wordsLayer.innerHTML=""; }

}

/* ==========================================
        MEETUP COUNTDOWN
========================================== */

const meetupScene = document.getElementById("meetupScene");

const meetupTarget = new Date("2026-07-25T16:00:00+05:30");

const mDays = document.getElementById("mDays");
const mHours = document.getElementById("mHours");
const mMinutes = document.getElementById("mMinutes");
const mSeconds = document.getElementById("mSeconds");
const meetupStatus = document.getElementById("meetupStatus");

let meetupInterval = null;
let meetupCelebrated = false;

function updateMeetupCountdown(){

    const now=new Date();

    const diff=forceUnlock ? -1 : meetupTarget-now;

    if(diff<=0){

        mDays.textContent="00";
        mHours.textContent="00";
        mMinutes.textContent="00";
        mSeconds.textContent="00";

        meetupStatus.innerHTML="This night belongs to us.";

        if(!meetupCelebrated){

            meetupCelebrated=true;

            burstHearts(20);

        }

        return;

    }

    meetupCelebrated=false;

    const d=Math.floor(diff/86400000);
    const h=Math.floor(diff%86400000/3600000);
    const m=Math.floor(diff%3600000/60000);
    const s=Math.floor(diff%60000/1000);

    mDays.textContent=String(d).padStart(2,"0");
    mHours.textContent=String(h).padStart(2,"0");
    mMinutes.textContent=String(m).padStart(2,"0");
    mSeconds.textContent=String(s).padStart(2,"0");

    meetupStatus.innerHTML="25 July 2026 • 4:00 PM";

}

function startMeetupCountdown(){

    endingScene.classList.add("hidden");

    meetupScene.classList.remove("hidden");

    setActiveDot("meetup");

    updateMeetupCountdown();

    if(meetupInterval){ clearInterval(meetupInterval); }

    meetupInterval=setInterval(updateMeetupCountdown,1000);

}

/* ==========================================
        REPLAY / RESET
========================================== */

const replayBtn = document.getElementById("replayBtn");

function resetExperience(){

    [questionPopup, instagramScene, galleryScene, letterScene,
     loveScene, timerScene, endingScene, meetupScene].forEach(s=>{

        s.classList.add("hidden");

    });

    endingScene.classList.remove("sunrise");

    scene1.style.display="";

    messageContainer.innerHTML="";

    typing.classList.add("hidden");

    choiceArea.classList.add("hidden");

    letterText.innerHTML="";

    continueBtn.classList.add("hidden");

    reasonIndex=0;

    loveTitle.innerHTML="Tap the heart";

    loveReason.innerHTML="";

    endingText.innerHTML="";

    endingTitle.innerHTML="";

    endingSignature.innerHTML="";
    endingSignature.style.opacity=0;

    endingContinue.classList.add("hidden");

    stopWordsLayer();

    currentMemory=0;

    setStars(0);

    memoryReveal.classList.add("hidden");

    setActiveDot("lock");

    if(relationshipInterval){ clearInterval(relationshipInterval); }

    if(meetupInterval){ clearInterval(meetupInterval); }

    bgMusic.pause();

    bgMusic.currentTime=0;

    musicUnlocked=false;

    if(voiceNote){

        voiceNote.pause();

        voiceNote.currentTime=0;

    }

}

if(replayBtn){

    replayBtn.addEventListener("click",()=>{

        vibrate(50);

        playClickSound();

        resetExperience();

    });

}