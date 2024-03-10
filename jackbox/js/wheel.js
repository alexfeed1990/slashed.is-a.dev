import { Wheel } from "./spin-wheel.js";
import * as easing from "./easing.js";

// Declare variables //
const wheelContainer = document.getElementById("wheel-container");
let spun = [],
    wheel,
    ver,
    list;

// Helper Functions //
function getWinnerIndex(props) { return Math.floor(Math.random() * props["items"].length); }
function createWheel() { return new Wheel(wheelContainer, getProps(ver)); }

function getProps() {
    const games = list[ver]; // Get the correct version of the list

    // Template
    var props = { items: [], lineWidth: 0, borderWidth: 0, itemBackgroundColors: ["#fff", "#eee", "#ccc"], pointerAngle: 90, isInteractive: false}

    for(var key in games) {
        // If the key exists and it is not in the spun array,
        if(games.hasOwnProperty(key) && !spun.includes(key)) {
            // Push the game.
            props.items.push({ label: key });
        }
    }

    return props
}

function spin(props) {
    const index = getWinnerIndex(props); // Get a random item from the items in the wheel
    const spinDuration = 4000;
    const setEasing = easing.cubicOut;
    console.log(index);
    wheel.spinToItem(index, spinDuration, true, 2, 1, setEasing); // Spin the wheel to the item

    const label = getProps(ver).items[index].label; // The name of the game
    const data = list[ver][label]; // The pack its from, minplayers and maxplayers

    // Disable the spin button so you cant spam it
    document.getElementById("spin").disabled = true;
    setTimeout(() => {
        // Enable it after the spin is over
        document.getElementById("spin").disabled = false;
        showResult(data.pack, label, data.playersMin, data.playersMax); // Show details about the winner
        addSpun(label, index); // Remove the winner from the wheel
    }, spinDuration + 300);
}

function addSpun(label) { 
    // Add the label to the spun array so it doesnt show up in the wheel
    spun.push(label);

    wheelContainer.innerHTML = ""; // Clear out the existing wheel
    wheel = createWheel(); // Create a new one
}

function showResult(pack, game, minp, maxp) {
    // Set all the variables
    document.getElementById("result-game").innerText = game;
    document.getElementById("result-pack").innerText = "Jackbox Party Pack " + pack;
    document.getElementById("result-players").innerText = minp + "-" + maxp + " Players";

    // Show the modal
    document.getElementById("result-modal").showModal();
}

(async () => {
    // Get the list.json file
    list = await fetch("./assets/list.json").then(resp => resp.json()).catch(err => err);
    if (list instanceof Error) throw new Error("List file is missing or i fucked something up. Sorry /shrug"); // Handle errors

    // Set the correct version according to ?ver=x
    let version = new URLSearchParams(document.location.search);
    if(version.has("ver")) { ver = version.get("ver"); } else { ver = "party"; } // If ?ver doesnt exist then default to "party".

    // Assign the function to the spin button
    document.getElementById("spin").onclick = function () { spin(getProps(ver)); }
    wheel = createWheel(); // Create the wheel
})()
