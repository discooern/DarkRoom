import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { ref } from "vue";
import { reactive } from "vue";

let lightLevel = ref(100);
let fireWood = ref(10);
let fireScale = ref(1);

async function stokeFire(){
if (fireWood.value > 0){
    lightLevel.value += 40;
    fireWood.value -= 1;
    if (lightLevel.value > 100)
    lightLevel.value = 100;
  }
}

let objectDocument;
let started = ref(true);
async function startGame(){
  createApp(App).mount('#app');
  objectDocument = await document.querySelector('.startScreen');
  objectDocument.style.animationName = "dissappear";
  objectDocument.style.animationTimingFunction = "ease-in-out";
  objectDocument.style.animationDuration = "4s";
  started.value = true;
}


document.querySelector('.title1').addEventListener('animationend', e => {
  document.querySelector('.title1').style.opacity = 1;
});

document.querySelector('.title2').addEventListener('animationend', e => {
  document.querySelector('.title2').style.opacity = 1;
});

document.querySelector('.title3').addEventListener('animationend', e => {
  document.querySelector('.title3').style.opacity = 1;
});

const timer = async () => {
  const myTimeout = setInterval(fireTimer, 250);
}


document.querySelector('.startScreen').addEventListener('animationend', event => {
  if (event.target !== event.currentTarget) {
    return; // Ignore it
  }
  document.querySelector('.startScreen').remove();
  timer();
});

async function fireTimer(){
  if(lightLevel.value > 0){
    lightLevel.value -= 1;
    if (lightLevel.value > 40){
      fireScale.value = lightLevel.value / 100;
    }
    document.getElementById('canvas').style.setProperty('--fireScale', `${ fireScale.value }`);
  }
}

document.querySelector(".startBtn").addEventListener('click', e => {
  startGame();
});

export {stokeFire, lightLevel, fireWood};