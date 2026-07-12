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

        return;

    }

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

/* =====================================================
        PHASE 2
===================================================== */

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

    scene1.style.display="none";

    questionPopup.classList.remove("hidden");

});

/* -----------------------
   ASK BUTTON
------------------------ */

askBtn.addEventListener("click",()=>{

    questionPopup.classList.add("hidden");

    instagramScene.classList.remove("hidden");

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

/* -----------------------
   SHOW MEMORY
------------------------ */

function showMemory(index){

memoryImage.style.opacity=0;

setTimeout(()=>{

memoryImage.src=memories[index].image;

memoryTitle.innerHTML=memories[index].title;

memoryText.innerHTML=memories[index].text;

memoryImage.style.opacity=1;

progressBar.style.width=((index+1)/memories.length)*100+"%";

},300);

}

/* -----------------------
   START GALLERY
------------------------ */

function startGallery(){

instagramScene.classList.add("hidden");

galleryScene.classList.remove("hidden");

if(bgMusic.paused){

    bgMusic.play().catch(()=>{});

}

showMemory(0);

const slideshow=setInterval(()=>{

currentMemory++;

if(currentMemory>=memories.length){

clearInterval(slideshow);

/* NEXT PHASE */

setTimeout(()=>{

galleryScene.classList.add("hidden");

typeLetter();

},2000);

return;

}

showMemory(currentMemory);

},5000);

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

let i=0;

function type(){

if(i<birthdayLetter.length){

letterText.innerHTML+=birthdayLetter.charAt(i);

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

letterScene.classList.add("hidden");

loveScene.classList.remove("hidden");

});

bigHeart.addEventListener("click",()=>{

if(reasonIndex<reasons.length){

loveTitle.innerHTML="";

loveReason.innerHTML=reasons[reasonIndex];

reasonIndex++;

}

else{

loveScene.classList.add("hidden");

timerScene.classList.remove("hidden");

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

async function showEnding(){

    timerScene.classList.add("hidden");

    endingScene.classList.remove("hidden");

    fadeMusic();

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

            endingSignature.innerHTML="— Thejus ❤️";

            endingSignature.style.opacity=1;

            return;

        }

        endingText.innerHTML+=messages[i]+"<br>";

        i++;

        setTimeout(next,1700);

    }

    next();

}

/* ==========================================
            BACKGROUND MUSIC
========================================== */

const bgMusic = document.getElementById("bgMusic");

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

timerContinue.addEventListener("click",()=>{

    showEnding();

});