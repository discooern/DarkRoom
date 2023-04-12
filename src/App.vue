<script setup type="module">
import { ref } from "vue";
import { reactive } from "vue";
import ProgressBar from 'primevue/progressbar';
import $ from 'jquery';

import { encounterFunc } from './encounterFunc.js';
import { lightLevel, fireWood, fireTimerJS, changeArea } from './main.js';
import { SourceNode } from "source-map";

// Events for sidebar showing current events, ex 'The room is getting colder' when the lightlevel reaches a certain point
let events = reactive([
  "A dark room"
]);

// title: "Title", desc: "Description, options: "Different encounter options",
// outcomes: "corresponding outcomes to selecting a button to press".
// outcomes input = 
// Number = quantity
// W = Wood
// NA = nothing happens
// 'Name()' = function call

let encounters = reactive([
  { title: "Title", desc: "Description", options: "Yes:No:Maybe", outcomes: "10 W:-5 W:thing()", eventOutcomes: "You gained wood:You lost wood:Nothing happened" }
]);
let currentEncounter = reactive([
  { title: "Title", desc: "Description", options: "Yes:No:Maybe", outcomes: "10 W:-5 W:NA", eventOutcomes: "You gained wood:You lost wood:Nothing happened" }
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
let eventOutcomes = reactive([
"You gained wood",
"You lost wood",
"Nothing happened"
]);
let resultDesc = ref();

let menu = ref("");
let newEvent = ref();
let light = ref(100);
let wood = ref(10);
let currentLocation = ref("room");
let roomActive = ref(true);

async function eventTimer() {
  let encounterTime = Math.random(0, 1) * 1;
  if (Math.floor(encounterTime) == -1) {
    console.log("getting encounter")
    let getEncounter = Math.random(0, encounters.length);
    runEncounterMenu(encounters[Math.floor(getEncounter)]);
  }
  if (newEvent[0] != null && newEvent[1] == currentLocation.value) {
    if (events[4] != null) {
      events.shift();
    }
    await events.push(newEvent[0]);
    console.log(events.length);
  }
  if (light.value > 50 && newEvent[0] == "The fire is roaring."){
    newEvent = ["The room is warm.", "room"];
  } else {
    newEvent = [];
  }
}
// encounter parameter ex ( { title: "Title", desc: "Description", options: "Yes:No:Maybe", outcomes: "10 W:-5 W:NA NA", eventOutcomes: "You gained wood:You lost wood:Nothing happened" } )
async function runEncounterMenu(encounter) {
  // Gets options, Buttons for selection in encounter.
  options = encounter.options.split(":");

  // Gets the possible outcomes of the selection.
  results = encounter.outcomes.split(":");

  // Gets the result desc for the selection.
  eventOutcomes = encounter.eventOutcomes.split(":");

  // Sets which menu is open.
  menu.value = "encounter";

  // Sets our currently ongoing encounter.
  currentEncounter = encounter;

  // Pauses the game so the player can decide on the encounter.
  stopTimer();
}

async function getResult(option) {
  // Gets result based on index of option, since index of option corresponds to the same index in results.
  let result = results[options.indexOf(option)].split(" ");

  // Checks if our encounter should run a special function based on outcome.
  if (result[0].slice(-1) == ")") {
    // Runs function using string, ex result contains encounterFunc() runs it.
    encounterFunc(results[options.indexOf(option)]);
  }
  // If our outcome is not a function. 
  else 
  {
    // Gets quantity of resource.
    let getNumber = result[0];
    // Gets type of resource.
    let getResourceType = result[1];

    // If the quantity of resources is NA/Non Applicable then dont run, 
    // if not then check the resource type and give it to the player.
    if (getNumber != "NA") {
      if (getResourceType == "W") {
        fireWood.value += parseInt(getNumber);
      }
    }
  }

  // Opens result menu.
  menu.value = 'result';
  
  // Sets our resultmenu desc to tell the user what happened because of their choice.
  resultDesc.value = eventOutcomes[options.indexOf(option)];
}

async function resultMenu() {
  menu.value = '';
  timer();
}

function area(location) {
  currentLocation.value = location;
  if (location == "room"){
    document.getElementById('roomBtn').style.color = "white";
    document.getElementById('forestBtn').style.color = "rgb(134, 134, 134)";
    if (light.value == 0) {newEvent = ["The room is cold.", "room"]}
    else if (light.value > 0 && light.value < 50) {newEvent = ["The room is mild.", "room"]}
    else if (light.value > 50 && light.value < 100) {newEvent = ["The fire is roaring.", "room"]}
  }
  if (location == "forest")
  {
    document.getElementById('forestBtn').style.color = "white";
    document.getElementById('roomBtn').style.color = "rgb(134, 134, 134)";
    newEvent = ["The forest is silent", "forest"];
  }
  roomActive.value = !roomActive.value;
  changeArea(location);
}

async function fireTimer() {
  if (lightLevel != null) {
    light.value = lightLevel.value;
    if (light.value == 30) {
      newEvent = ["The room is mild.", "room"];
    } else if (light.value == 0 && events[events.length - 1] != "The room is cold."){
      newEvent = ["The room is cold.", "room"];
    }
  }
  if (fireWood != null) {
    if (wood.value - 1 == fireWood.value) {
      newEvent = ["The fire is roaring.", "room"];
    }
    wood.value = fireWood.value;
  }
}

$(document).ready(function () {
  $("#sound")[0].src += "&autoplay=1";
  ev.preventDefault();
});

let myTimeout1;
let myTimeout2;
let myTimeout3;

const stopTimer = async () => {
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
          <h3 class="eventsView" ref="item" v-for="(item, index) in events" :key="item + index">{{ item }}</h3>
        </transition-group>
      </span>
    </div>
  </div>

  <div class="locationMenu">
    <button id="roomBtn" :disabled="roomActive" @click="area('room')">Room</button>
    <button id="forestBtn" :disabled="!roomActive" @click="area('forest')">Forest</button>
  </div>

  <ProgressBar id="progressBar" :class="{ fadeIn : roomActive, fadeOut: !roomActive }" :value="light">
    <p class="gradient"></p>
  </ProgressBar>

  <transition-group name="menuTransition">
    <div id="menuBlur" v-if="menu != ''">
      <transition-group name="menuTransition">
        <div id="encounterMenu" v-if="menu == 'encounter'">
          <h3 class="encounterTitle">{{ currentEncounter.title }}</h3>
          <h4 class="encounterDesc">{{ currentEncounter.desc }}</h4>
          <button class="encounterBtn" v-for="item in options" :key="item" @click="getResult(item)">{{ item }}</button>
        </div>

        <div id="resultMenu" v-if="menu == 'result'">
          <h3 class="resultTitle" id="resultTitle">{{ currentEncounter.title }}</h3>
          <h4 class="resultDesc" id="resultDesc">{{ resultDesc }}</h4>
          <button class="resultBtn" id="resultBtn" @click="resultMenu()">Ok</button>
        </div>
      </transition-group>
    </div>
  </transition-group>

  <iframe id="sound" width="0" height="0" src="https://www.youtube.com/embed/6VB4bgiB0yA?rel=0"
    title="YouTube video player" frameborder="0"></iframe>
</template>
<style scoped>
#menuBlur {
  position: absolute;
  z-index: 8;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(128, 128, 128, 0.201);
}

#encounterMenu,
#resultMenu {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: fit-content;
  width: 25rem;
  padding: 2rem;
  background: whitesmoke;
  border-radius: 40px;
}

@media screen and (max-width: 600px) {
  #encounterMenu,
  #resultMenu{
    width: 75vw;
  }
}

.encounterBtn,
.resultBtn {
  margin: .5rem;
  border: 1px solid darkgray;
  transition: border .2s ease-in-out;
}

.encounterBtn:hover,
.resultBtn:hover {
  border: 1px solid black;
}

.gradient {
  background-image: linear-gradient(to right, yellow, red);
  width: 200px;
  height: 20px;
  box-sizing: border-box;
}

.menu {
  position: absolute;
  top: 5%;
  left: 5%;
  width: 10rem;
}

.inventoryContainer,
.events {
  height: fit-content;
}

.spanFlex,
.spanFlexEvents {
  display: flex;
}

.spanFlex {
  justify-content: space-around;
}

.spanFlexEvents {
  flex-direction: column;
  position: absolute;
  width: 100%;
}

.counter,
.counterName,
.eventsView,
.encounterDesc,
.encounterTitle,
.resultDesc,
.resultTitle {
  color: rgb(134, 134, 134)
}

#roomBtn,
#forestBtn{
  background: none;
  font-size: 1.2rem;
  border-radius: 0;
  box-sizing: border-box;
  padding: 1rem;
  padding-left: 1.4rem;
  padding-right: 1.4rem;
  transition: color 1s ease-in-out;
}
#roomBtn{
  border-right: 1px gray solid;
  color: white;
}
#forestBtn{
  border-left: 1px gray solid;
  color: rgb(134,134,134);
}

.encounterDesc,
.resultDesc,
.eventsView {
  position: relative;
  font-style: italic;
}

.eventsView {
  margin: 0;
}
.encounterDesc,
.resultDesc{
  margin-bottom: 1rem;
}

.menuTransition-enter-active,
.menuTransition-leave-active {
  transition: all .5s ease-in-out;
}

.menuTransition-enter-from,
.menuTransition-leave-to {
  opacity: 0;
}

.enterTransition-enter-active,
.enterTransition-leave-active,
.enterTransition-move {
  transition: 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  transition-property: opacity, transform;
}

.enterTransition-enter-from {
  transform: translateY(30px);
  opacity: 0;
}

.enterTransition-leave-to {
  transform: translateY(-30px);
  opacity: 0;
}

.enterTransition-leave-active {
  position: absolute;
  left: 0;
  right: 0;
}

#progressBar {
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

@media screen and (max-width: 1000px) {
  #progressBar {
    top: 75% !important;
    bottom: 25% !important;
  }
}

.stokeP,
.stokeBtn {
  position: absolute;
  top: 30%;
  bottom: 70%;
  transform: translate(-50%, -50%);
}

.locationMenu{
  display: flex;
  position: absolute;
  top: 5%;
  transform: translateX(-50%);
}

.fadeOut {
  visibility: hidden;
  opacity: 0;
  transition: visibility 2s linear 300ms, opacity 2s;
}
.fadeIn {
  visibility: visible;
  opacity: 1;
  transition: visibility 2s linear 0s, opacity 2s;
}
</style>
