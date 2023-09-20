/*import { createApi } from "./unsplash-js";

import nodeFetch from './node-fetch';

const unsplashAPI = createApi({
    accessKey: 'knJ-dWwE3NuTuXTLmPlhlv9AsQytlb57-js_WfDBs_Y',
    fetch: nodeFetch,
});*/

// PEXESO
//DONE create grid responsive layout of box items, 8 items in a row
//DONE make each item flip on click with a picture on the back side
//DONE each item needs to be generated through JS (or find some template engine??)
//DONE each item has unique ID or name or number (data- attribute)
//DONE there are pairs of items with the same ID
//DONE if on click they match, they get "matched" class permanently
//DONE get data attribute and by ID change the array of items(pexItems), wasChecked: true

// Solution to generating the same IDs:
//DONE generate array and duplicate it and then combine into two arrays
//DONE generated array of pexItems store in the beginning into the localStorage
// then, always take values and change state in localStorage

//DONE create new data (createPexData())
//DONE put it into array, twice as pairs
//DONE shuffle the array
//DONE set it into localStorage
// after any change in "data" also update localstorage (storePexData())

//Pseudo code for pexeso, 3 important methods:
//DONE 1. When item is clicked, change isVisited(first visit) and isActive properties in an object (ONLY FOR ONE ITEM)
//DONE 2. When they match, add isMatched for both (FOR MULTIPLE ITEMS)
  //3. When they DONT MATCH, change isActive for both (FOR MULTIPLE ITEMS)

// LATER ======
// Counter of pairs
// Counter of moves
// Turns? (against computer)
// Points?

// helper function
let generateRandomID = () => {
    return Math.random().toString(16).slice(2);
};

// helper function
let shuffle = (array) => {
    let m = array.length, t, i;

    while (m) {
        i = Math.floor(Math.random() * m--);

        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

let generateLayoutForm = document.querySelector('#generate-layout-form');
let generateLayoutSelect = generateLayoutForm.elements['number-of-items'];
let generateLayoutBtn = generateLayoutForm.elements['generate-btn'];

let pexTiles = document.querySelector('.js-pex-tiles');
let currentPair = [];
let allPairs = [];

// TODO add more images (unsplash)
let pexDataImages = ['https://i.imgur.com/st32XSh.jpg', 'https://i.imgur.com/VRY3466.jpg', 'https://i.imgur.com/ka3FK2E.jpg', 'https://i.imgur.com/st32XSh.jpg', 'https://i.imgur.com/VRY3466.jpg', 'https://i.imgur.com/ka3FK2E.jpg', 'https://i.imgur.com/st32XSh.jpg', 'https://i.imgur.com/VRY3466.jpg', 'https://i.imgur.com/ka3FK2E.jpg'];
let pexData = [];

class pexItem {
    constructor(pairValue, id, imageUrl, isActive = false, isVisited = false, isMatched = false) {
        this.pairValue = pairValue;
        this.id = id;
        this.imageUrl = imageUrl;
        this.isActive = isActive;
        this.isVisited = isVisited;
        this.isMatched = isMatched;
    }
}

class Pexeso {
    constructor() {
    }

    createPexData(numberOfBoxes) {
        pexeso.resetAll();

        for (let i = 0; i < numberOfBoxes; i++) {
            let newPexDataItem = new pexItem(generateRandomID(), i, pexDataImages[i]);
            allPairs.push(newPexDataItem.pairValue);
            pexData.push(newPexDataItem);

            // push identical data again, but with different IDs, to make pairs
            let duplicatedNewPexItem = Object.assign({}, newPexDataItem);
            duplicatedNewPexItem.id += 1000;
            pexData.push(duplicatedNewPexItem);
        }

        let shuffleArray = shuffle(pexData);
        pexData = shuffleArray;

        localStorage.setItem("pexData", JSON.stringify(pexData));
    }

    createPexBoxes() {
        let pexBoxes;
        pexBoxes = pexData.map((item) => {
            return `<li class="pex-box js-pex-box" data-clicked="false" data-id="${item.id}" data-pair-value="${item.pairValue}">
                <div class="pex-box-face front-face">
                  <span>PEX</span>
                </div>
                <div class="pex-box-face back-face">
                  <img src="${item.imageUrl}" />
                </div>
              </li>
            `;
        }).join("");

        pexTiles.replaceChildren();
        pexTiles.insertAdjacentHTML("afterbegin", pexBoxes);
    }

    createAll() {
        pexeso.createPexData(generateLayoutSelect.value / 2); // divide by 2, we push object into array twice
        pexeso.createPexBoxes();

        let pexBoxesSelector = document.querySelectorAll('.js-pex-box');
        for (let box of pexBoxesSelector) {
            box.addEventListener("click", function () {
                pexeso.pairBoxes(box);
            });
        }
    }

    resetAll() {
        pexData = [];
        currentPair = [];
        allPairs = [];
        generateLayoutBtn.dataset.clicked = 'false';
        localStorage.removeItem("pexData");
        pexTiles.replaceChildren();
    }

    updateVisitedItem(id, currentItem) {
        let currentItemIndex = pexData.findIndex(item => item.id === Number(id));

        currentItem.classList.add("visited");
        pexData[currentItemIndex].isVisited = true;
        localStorage.setItem("pexData", JSON.stringify(pexData));
    }

    updateMatchedItem(pairValue, matched = true) {
        let currentItemIndexes = pexData.map((elem, index) => (elem.pairValue === pairValue ? index : '')).filter(String);

        if (matched) {
            currentPair.forEach((item) => {
                item.selector.classList.add("matched");
                item.selector.classList.remove("active");
            });

            let pairIndex = allPairs.indexOf(pairValue);
            allPairs.splice(pairIndex, 1);

            if(!allPairs.length) {
                setTimeout(() => {
                    alert('Congratulations, you WON!');
                    pexeso.resetAll();
                }, 650);
            }
        } else {
            currentPair.forEach((item) => {
                setTimeout(() => {
                    item.selector.classList.remove("active", "matched");
                    item.selector.setAttribute('data-clicked', 'false');
                }, 1000);
            });
        }

        for (let index in currentItemIndexes) {
            pexData[index].isMatched = matched;
        }

        localStorage.setItem("pexData", JSON.stringify(pexData));
    }

    pairBoxes(item) {
        if (item.dataset.clicked === 'false') {
            item.classList.add("active");
            item.setAttribute('data-clicked', 'true');
            pexeso.updateVisitedItem(item.dataset.id, item);

            if ((currentPair.length < 2)) {
                currentPair.push({selector: item, pairValue: item.dataset.pairValue});

                let currentPairFull = currentPair.length === 2;
                if (!currentPairFull) {
                    return;
                }

                let isPair = currentPair[0].pairValue === currentPair[1].pairValue;
                if (isPair) {
                    pexeso.updateMatchedItem(item.dataset.pairValue);
                    currentPair = [];
                } else if (!isPair && currentPairFull) {
                    pexeso.updateMatchedItem(item.dataset.pairValue, false);
                    currentPair = [];
                }
            }
        }
    }
}

let pexeso = new Pexeso();

generateLayoutBtn.addEventListener('click', function (event) {
    event.preventDefault();

    if(event.currentTarget.dataset.clicked === 'true') {
        localStorage.removeItem("pexData");

        if(confirm('Are you sure you want to START new game?')) {
            pexeso.createAll();
        }

        return;
    }

    pexeso.createAll();

    event.currentTarget.dataset.clicked = 'true';
});

generateLayoutForm.addEventListener('submit', function (event) {
    event.preventDefault();
});

// generate DATA in JS
// set them into Localstorage
// get them from Localstorage, store in variable
// every time you make any CHANGE on this variable, store it back into Localstorage
// Localstorage gets cleared only after the game is OVER or new game is CREATED
