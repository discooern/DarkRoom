import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { ref } from "vue";
import { reactive } from "vue";

let lightLevel = ref(100);
let fireWood = ref(10);
let fireScale = ref(1);
let location = ref("room");

document.querySelector('#canvas').classList.toggle("m-fadeIn");
document.querySelector('#forestMain').classList.toggle("m-fadeOut");

async function stokeFire(){
if (fireWood.value > 0){
    lightLevel.value += 40;
    fireWood.value -= 1;
    if (lightLevel.value > 100)
    lightLevel.value = 100;
  }
}

let objectDocument;
async function startGame(){
  createApp(App).mount('#app');
  objectDocument = await document.querySelector('.startScreen');
  objectDocument.style.animationName = "dissappear";
  objectDocument.style.animationTimingFunction = "ease-in-out";
  objectDocument.style.animationDuration = "4s";
}

export function changeArea(area){
  location.value = area;
  console.log(location.value);
  
  document.querySelector('#canvas').classList.toggle("m-fadeOut");
  document.querySelector('#canvas').classList.toggle("m-fadeIn");
  document.querySelector('#forestMain').classList.toggle("m-fadeOut");
  document.querySelector('#forestMain').classList.toggle("m-fadeIn");
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

document.querySelector('.startScreen').addEventListener('animationend', event => {
  if (event.target !== event.currentTarget) {
    return; // Ignore it
  }
  document.querySelector('.startScreen').remove();
  fireTimerJS();
});

async function fireTimerJS(){
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

export {stokeFire, lightLevel, fireWood, fireTimerJS};