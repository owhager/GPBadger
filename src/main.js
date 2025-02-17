import getRateMyProfData from "./RateMyProf";

let profData = await getRateMyProfData("scott", "swanson")

const name = document.createElement('h3');
name.innerText = profData.firstName + " " + profData.lastName;
document.body.appendChild(name);

const difficulty = document.createElement('h5');
difficulty.innerText = "Average Difficulty: " + profData.avgDifficulty + " / 5";
document.body.appendChild(difficulty);

const rating = document.createElement('h5');
rating.innerText = "Average Rating: " + profData.avgRating + " / 5";
document.body.appendChild(rating);

const takeAgain = document.createElement('h5');
takeAgain.innerText = "Would Take Again: " + Math.round(profData.wouldTakeAgainPercent) + "%";
document.body.appendChild(takeAgain);