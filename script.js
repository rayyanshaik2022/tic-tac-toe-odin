

// Toggle the "select sign" buttons
const xContainer = document.querySelector("#x-container");
const yContainer = document.querySelector("#y-container")
let currentlySelected = 0;
let xyContainers = [xContainer, yContainer];

xyContainers.forEach((cont) => cont.addEventListener("click", (e) => {
    if (cont.classList.contains("active")) {
        return;
    }

    xyContainers[currentlySelected].classList.remove("active");
    currentlySelected = Math.abs(currentlySelected - 1);
    xyContainers[currentlySelected].classList.add("active");
}));


// Button send to game
const startBtn = document.querySelector(".start-btn");
startBtn.addEventListener("click", (e) => {
    window.location.href = "./html/game.html?mark=x";

    if (yContainer.classList.contains("active")) {
        window.location.href = "./html/game.html?mark=o";
    }
});