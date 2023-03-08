<script setup type="module">
import { ref } from "vue";
import { reactive } from "vue";
import ProgressBar from 'primevue/progressbar';
import $ from 'jquery';

import {lightLevel, fireWood, fireTimerJS} from './main.js';
import { SourceNode } from "source-map";

// Events for sidebar showing current events, ex 'The room is getting colder' when the lightlevel reaches a certain point
let events = reactive([
  "A dark room"
]);

// title: "Title", desc: "Description, options: "Different encounter options", outcomes: "corresponding outcomes to selecting a button to press".
// outcomes input = 
// Number = quantity
// W = Wood
// NA = nothing happens
// 'Name()' = function call

let encounters = reactive([
  { title: "Title", desc: "Description", options: "Yes No Maybe", outcomes: "10 W,-5 W,NA", event: "You gained wood,You lost wood,Nothing happened" }
]);
let currentEncounter = reactive([
  { title: "Title", desc: "Description", options: "Yes No Maybe", outcomes: "10 W,-5 W,NA", event: "You gained wood,You lost wood,Nothing happened" }
]);
let options = reactive([
  "Yes",
  "No",
  "Maybe"
]);
let results = reactive([
  "10 W",
  "-5 W",
  "NA NA"
]);

let newEvent = ref();
let light = ref(100);
let wood = ref(10);

async function eventTimer(){
  let encounterTime = Math.random(0,1) * 100;
  console.log(encounterTime)
  if (Math.floor(encounterTime) == 0){
    console.log("getting encounter")
    let getEncounter = Math.random(0, encounters.length);
    runEncounterMenu(encounters[Math.floor(getEncounter)]);
  }
  if (newEvent != null){
    if (events[4] != null){
      events.shift();
  }
    await events.push(newEvent);
    newEvent = null;
  }
}

// encounter parameter ex ( { title: "Title", desc: "Description", options: "Yes No Maybe", outcomes: "10 W,-5 W,NA NA", event: "You gained wood,You lost wood,Nothing happened" } )
async function runEncounterMenu(encounter){
  options = encounter.options.split(" ");
  results = encounter.outcomes.split(",");
  document.getElementById('encounterMenu').style.opacity = 1;
  currentEncounter = encounter;
  console.log(currentEncounter);
  console.log(options);
  stopTimer();
}

async function getResult(option){
  let result = results[options.indexOf(option)].split(" ");
  let getNumber = result[0];
  let getResourceType = result[1];

  if (getNumber != "NA"){
    if (getResourceType == "W"){
      fireWood.value += parseInt(getNumber);
    }
  }

  document.getElementById('encounterMenu').style.opacity = 0;
  document.getElementById('resultMenu').style.opacity = 1;
}

async function resultMenu(){
  document.getElementById('resultMenu').style.opacity = 0;
  document.getElementById('resultTitle').innerHTML = currentEncounter.title;

  timer();
}

async function fireTimer(){
  if (lightLevel != null){
    light.value = lightLevel.value;
    if (light.value == 30){
      newEvent = "The room is getting colder."
    }
  }
  if (fireWood != null){
    if (fireWood.value != wood.value){
      newEvent = "The fire burns brighter."
    }
    wood.value = fireWood.value;
  }
}

$(document).ready(function() {
  $("#sound")[0].src += "&autoplay=1";
    ev.preventDefault();
});

let myTimeout1;
let myTimeout2;
let myTimeout3;

const stopTimer = async() => {
  clearTimeout(myTimeout1);
  clearTimeout(myTimeout2);
  clearTimeout(myTimeout3);
}

const timer = async () => {
  myTimeout1 = setInterval(fireTimer, 250);
  myTimeout2 = setInterval(eventTimer, 1000);
  myTimeout3 = setInterval(fireTimerJS, 250);
}

timer();
</script>

<template>
  <div class="menu">
  <div class="inventoryContainer">
    <span class="spanFlex">
      <h2 class="counterName">Firewood</h2>
      <h2 class="counter">{{ wood }}</h2>
    </span>
  </div>
  <div class="events">
    <span class="spanFlexEvents">
      <transition-group name="enterTransition">
        <h3 class="eventsView" v-for="item in events" :key="item">{{ item }}</h3>
      </transition-group>
    </span>
  </div>
  </div>

  <ProgressBar class="progressBar" :value="light">
    <p class="gradient"></p>
  </ProgressBar>

  <div id="encounterMenu">
    <h3 class="encounterTitle">A Stranger</h3>
    <h4 class="encounterDesc">He offers you something in exchange for warming himself by your fire</h4>
    <button class="encounterBtn" v-for="item in options" :key="item" @click="getResult(item)">{{ item }}</button>
  </div>

  <div id="resultMenu">
    <h3 class="resultTitle" id="resultTitle"></h3>
    <h4 class="resultDesc" id="resultDesc"></h4>
    <button class="resultBtn" id="resultBtn" @click="resultMenu()"></button>
  </div>

  <iframe id="sound" width="0" height="0" src="https://www.youtube.com/embed/6VB4bgiB0yA?rel=0" title="YouTube video player" frameborder="0"></iframe>
</template>
<style scoped>
#encounterMenu, #resultMenu{
  position: absolute;
  height: fit-content;
  width: fit-content;
  opacity: 0;
  padding: 2rem;
  background: whitesmoke;
  border-radius: 40px;
  transition: opacity 1s ease-in-out;
}

.encounterBtn, .resultBtn{
  margin: .5rem;
  border: 1px solid darkgray;
  transition: border .2s ease-in-out;
}
.encounterBtn:hover, .resultBtn:hover{
  border: 1px solid black;
}

.gradient{
  background-image: linear-gradient(to right, yellow , red);
  width: 200px;
  height: 20px;
  box-sizing:border-box;
}

.menu{
    position: absolute;
    top: 5%;
    left: 5%;
    width: 10rem;
  }

.inventoryContainer, .events{
  height: fit-content;
}

.spanFlex, .spanFlexEvents{
  display: flex;
}

.spanFlex{
  justify-content: space-around;
}

.spanFlexEvents{
  flex-direction: column;
  position: absolute;
  width: 100%;
}

.counter, .counterName, .eventsView, .encounterDesc, .encounterTitle, .resultDesc, .resultTitle{
  color: rgb(134, 134, 134)
}

.eventsView, .encounterDesc, .resultDesc{
  position: relative;
  font-style: italic;
  margin: 0;
}

.enterTransition-enter-active, .enterTransition-leave-active{
  transition: all .5s ease-in-out;
}

.enterTransition-enter-from{
  transform: translatey(30px);
  opacity: 0;
}
.enterTransition-leave-to{
  transform: translateY(-30px);
  opacity: 0;
}

.progressBar{
  display: flex;
  align-items: center;
  background: rgb(49, 49, 49);
  width: 200px;
  height: 20px;
  padding: 2px;
  border-radius: 5px;
  position: absolute;
  top: 25%;
  bottom: 75%;
  transform: translate(-50%, -50%);
}

@media screen and (max-width: 1000px){
  .progressBar{
    top: 75% !important;
    bottom: 25% Im !important;
  }
}

.stokeP, .stokeBtn{
  position: absolute;
  top: 30%;
  bottom: 70%;
  transform: translate(-50%, -50%);
}
</style>
