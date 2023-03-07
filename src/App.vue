<script setup type="module">
import { ref } from "vue";
import { reactive } from "vue";
import ProgressBar from 'primevue/progressbar';
import $ from 'jquery';

import {lightLevel, fireWood} from './main.js';
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
  { title: "Title", desc: "Description", options: "Yes No Maybe", outcomes: "10W, -5W, NA" }
]);

let newEvent = ref();
let light = ref(100);
let wood = ref(10);

async function eventTimer(){
  let rnd = Math.random(0,10);
  

  if (newEvent != null){
    if (events[4] != null){
      events.shift();
  }
    await events.push(newEvent);
    newEvent = null;
  }
}

async function openEncounterMenu(){

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

const timer = async () => {
  const myTimeout1 = setInterval(fireTimer, 250);
  const myTimeout2 = setInterval(eventTimer, 1000);
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

  <iframe id="sound" width="0" height="0" src="https://www.youtube.com/embed/6VB4bgiB0yA?rel=0" title="YouTube video player" frameborder="0"></iframe>
</template>
<style scoped>

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

.counter, .counterName, .eventsView{
  color: rgb(134, 134, 134)
}

.eventsView{
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
