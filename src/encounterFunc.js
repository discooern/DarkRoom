// This is where we define the functions for special encounters.
import { lightLevel, fireWood } from './main.js';

export async function encounterFunc(funcName){
    eval(funcName);
}

function thing(){
    console.log("test");
}
