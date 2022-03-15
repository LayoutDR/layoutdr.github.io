/**
 * Viewing or editing this code before or during the human study
 * is not allowed. Thanks.
 */

var failures = undefined;
var currentWebpageIndex = 0;
var currentFailureIndex = 0;
var currentImageIndex = undefined;
var widerRepair = true;
var narrowerRepair = true;
var minViewportRepairs = true;
var maxViewportRepairs = false;
var nextSectionRestriction = false;

var mainFile = "subjects";
var maxSections = 20;
var shuffle = false;
var gotoTopButton = undefined;
var durationImage = undefined;
var duration = undefined;
var scrollBarWidth = undefined;
var submitted = undefined;
var submitting = undefined;
var surveyCode = undefined;
var scrollData = undefined;
var startScreen = true;
var submitAttempt = 0;
var startDate = undefined;
var SUID = undefined;
var IP = undefined;
var UA = undefined;
var workerIDElement = undefined;
var workerID = undefined;
var agreement = false;
var tabF = undefined;
var tabA = undefined;
var tabB = undefined;
var radioF = undefined;
var radioA = undefined;
var radioB = undefined;
var ratingQuestion = undefined;
var completedElement = undefined;
var mainFrame = undefined;
var progressElement = undefined;
var contentFrame = undefined;
var ratingOptions = undefined;
var tabsFrame = undefined;
var navigation = undefined;
var popupPrompt = undefined;
var promptElement = undefined;
var promptTitleBar = undefined;
var promptHeading = undefined;
var promptNote = undefined;
var surveyCode = undefined;
var promptButtons = undefined;
var promptResponse = undefined;
var popupConsent = undefined;
var warning = undefined;
var popupInstructions = undefined;
var instructionsBody = undefined;
var snapshotF = undefined;
var snapshotA = undefined;
var snapshotB = undefined;
var preloadImage = undefined;
var bodyInitialSize = undefined;
var loadingElement = undefined;
var totalLoadingTime = 0;
var loadingTimer = new Date;
var submitButton = undefined;
var viewportSatisfied = undefined;
var topPageFrame = undefined;
var bottomPageFrame = undefined;
var description = undefined;

window.onload = function () {
  workerIDElement = document.getElementById("workerid");
  scrollJSON = JSON.parse(scrollJSON);
  //descriptionJSON = JSON.parse(descriptionJSON);
  failures = getInputDataFromCSV("Definite", true);
  for (let failure of failures) {
    failure.imageVisits = [0, 0, 0];
    failure.imageTime = [0, 0, 0];
    failure.imageRating = "unrated";
    failure.imageLoaded = [false, false, false];
    failure.ratingHistory = [];
    failure.viewportSatisfied = undefined;
    failure.bodySize = undefined;
  }
  contentFrame = document.getElementById("contentFrame");
  progressElement = document.getElementById("progress");
  acceptButton = document.getElementById("accept");
  rejectButton = document.getElementById("reject");
  gotoTopButton = document.getElementById("topButton");
  expandedImage = document.getElementById("expandedImg");
  expandedImageText = document.getElementById("expandedImgText");
  expanded = document.getElementById("expanded");
  expandedInstructions = document.getElementById("expandedInstructions");
  menu = document.getElementById("menu");



  popupPrompt = document.getElementById("popupPrompt");
  promptTitleBar = document.getElementById("promptTitleBar");
  promptElement = document.getElementById("prompt");
  promptHeading = document.getElementById("promptHeading");
  promptNote = document.getElementById("promptNote");
  surveyCode = document.getElementById("surveyCode");
  promptButtons = document.getElementById("promptButtons");
  topPageFrame = document.getElementById("topPageFrame");
  bottomPageFrame = document.getElementById("bottomPageFrame");
  popupInstructions = document.getElementById("popupInstructions");
  warning = document.getElementById("warning");
  popupConsent = document.getElementById("popupConsent");
  tabF = document.getElementById("tabF");
  tabA = document.getElementById("tabA");
  tabB = document.getElementById("tabB");
  snapshotF = document.getElementById("snapshotF");
  snapshotA = document.getElementById("snapshotA");
  snapshotB = document.getElementById("snapshotB");
  ratingQuestion = document.getElementById("ratingQuestion");
  completedElement = document.getElementById("completed");
  mainFrame = document.getElementById("mainFrame");
  ratingOptions = document.getElementById("ratingOptions");
  tabsFrame = document.getElementById("tabsFrame");
  navigation = document.getElementById("navigation");
  instructionsBody = document.getElementById("instructionsBody");
  preloadImage = document.createElement("img");
  submitButton = document.getElementById("submit");
  radioF = document.getElementById("radioF");
  radioA = document.getElementById("radioA");
  radioB = document.getElementById("radioB");
  description = document.getElementById("description");

  submitButton.disabled = true

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    let charCode = evt.keyCode || evt.which;
    let charStr = String.fromCharCode(charCode);
    if (charCode === 68)//d key
      next();
    if (charCode === 65)//a key
      previous();
    // if (charCode === 38) {
    //   let s = contentFrame.scrollTop;
    //   if (s > 0) contentFrame.scrollTop = s - 1;
    // }
    // if (charCode === 40) {
    //   let s = contentFrame.scrollTop;
    //   contentFrame.scrollTop = s + 1;
    // }
    // if (charCode === 83) {//s
    //   console.log(setScroll());
    // }
  };
  scrollBarWidth = getScrollbarWidth();
  IP = getFromServer("ip.php", setIP);
  UA = getFromServer("ua.php", setUA);
  popupPrompt.style.display = 'none';
  loadingElement = document.getElementById("loading");
  tabClick();
  preloadImages();
  viewportSatisfied = checkViewport();
  bodyInitialSize = document.body.getBoundingClientRect();
};

function preloadImages() {
  let failure = failures[currentFailureIndex];

  if (currentFailureIndex + 1 < failures.length) {
    let nextFailure = failures[currentFailureIndex + 1];
    let imageName = failures[currentFailureIndex + 1].images[0];
    let imagePath = "/hs/" + mainFile + "/" + nextFailure.name + "-index-html/" + "run-" + nextFailure.run +
      "/" + "human-study/screenshots/" + imageName + ".png";
    preloadImage.src = imagePath;
  }
}
function saveDescriptions() {
  let descriptions = []
  for (let f of failures)
    descriptions.push({ name: f.name, ID: f.ID, description: f.description });
  copy(JSON.stringify(descriptions))
  return JSON.stringify(descriptions);
}

function checkViewport() {
  let check = window.matchMedia("(min-width: 1400px) and (min-height: 780px)");
  return check.matches;
}
function startTime() {
  stopTime();
  durationImage = {
    currentFailureIndex: currentFailureIndex,
    currentImageIndex: currentImageIndex,
    date: new Date(),
  };
}
function stopTime() {
  if (durationImage !== undefined) {
    failures[durationImage.currentFailureIndex].imageTime[
      durationImage.currentImageIndex
    ] += (new Date() - durationImage.date);
    durationImage = undefined;
  }
}

function startLoadingTimer() {
  stopTime();
  loadingTimer = new Date();
}
function stopLoadingTimer() {
  if (loadingTimer !== undefined) {
    totalLoadingTime += (new Date - loadingTimer);
  }
}

function getInputDataFromCSV(
  classification = undefined,
  narrowerRepairOnly = false
) {
  let failures = [];
  const rows = csv.split("\n");
  for (let row of rows) {
    if (row.trim() === "") continue;
    const columns = row.split(",");
    if (narrowerRepairOnly) if (columns[8] === "Not Applicable") continue;
    if (classification === undefined || columns[6] === classification) {
      if (minViewportRepairs) {
        addFailure(columns, failures, "min");
      }
      if (maxViewportRepairs) {
        addFailure(columns, failures, "max");
      }
    }
  }
  if (shuffle === true)
    shuffleArray(failures);
  while (failures.length > maxSections) {
    let i = getRandomInt(0, failures.length);
    failures.splice(i, 1);
  }

  csv = document.getElementById("delete");
  csv.remove();
  csv = undefined;
  return failures;
}
function addFailure(columns, failures, minOrMax = "min") {
  let failure = {
    name: columns[0],
    ID: Number(columns[1]),
    run: 1,
    type: columns[2],
    rangeMin: Number(columns[3]),
    rangeMax: Number(columns[4]),
    images: [],
    viewport: Number(columns[3]),
    scroll: [0, 0, 0],
  };
  if (minOrMax === "max") {
    failure.viewport = failure.rangeMax;
  }
  let imageF = failure.ID + "-" + failure.viewport + "-F";
  let imageW = failure.ID + "-" + failure.viewport + "-W";
  let imageN = failure.ID + "-" + failure.viewport + "-N";
  failure.images.push(imageF);
  if (widerRepair)
    failure.images.push(imageW);
  if (narrowerRepair && columns[8] !== "Not Applicable")
    failure.images.push(imageN);
  setFailureScroll(failure);
  setFailureDescription(failure);
  if (shuffle === true)
    shuffleLastTwoElements(failure.images, failure.scroll)
  //shuffleArray(failure.images, failure.scroll);
  failures.push(failure);

  return failure.rangeMin !== failure.rangeMax;
}
function setFailureScroll(failure) {
  for (let obj of scrollJSON) {
    if (failure.name === obj.name) {
      for (let i = 0; i < failure.images.length; i++) {
        if (failure.images[i] === obj.image) {
          if (obj.scroll !== 0)
            failure.scroll[i] = obj.scroll;
          else
            failure.scroll[i] = 0;
        }
      }
    }
  }
}
function setFailureDescription(failure) {
  for (let obj of descriptionJSON) {
    if (failure.name === obj.name && failure.ID === obj.ID) {

      failure.description = obj.description;
      break;
    }
  }
}
function setFailureScrollJSON(failure) {
  for (let data of jsons) {
    if (data.name === failure.name + "-index-html") {
      for (let f of data.failures) {
        if (f.ID === failure.ID) {
          for (let i = 0; i < failure.images.length; i++) {
            imageName = failure.images[i];
            for (let x = 0; x < f.anonymizedImageNames.length; x++) {
              if (imageName === f.anonymizedImageNames[x]) {
                failure.scroll[i] = f.rectangles[x][0].y;
                if (f.rectangles[x][0].height < 700)
                  failure.scroll[i] += f.rectangles[x][0].height;
                break;
              }
            }
          }
          return;
        }
      }
    }
  }
}
function isVScrollbarVisible(element) {
  return element.scrollHeight > element.clientHeight;
}
function isHScrollbarVisible(element) {
  return element.scrollWidth > element.clientWidth;
}
/**
 * Takes and array and randomly shuffles the elements using Fisher-Yates (aka Knuth).
 * https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 * @param {Array} array The array to shuffle.
 * @param {Array} array The secondary array to shuffle simultaneously.
 * @returns The shuffled array.
 */
function shuffleArray(array, array2) {
  let index = array.length,
    randomIndex;
  while (0 !== index) {
    randomIndex = Math.floor(Math.random() * index);
    index--;
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    if (array2 !== undefined) {
      [array2[index], array2[randomIndex]] = [array2[randomIndex], array2[index]];
    }
  }
  return array;
}
function shuffleLastTwoElements(array, array2) {
  let n = getRandomIntInclusive(1, 2);
  if (n === 2) {
    [array[1], array[2]] = [array[2], array[1]];
    if (array2 !== undefined) {
      [array2[1], array2[2]] = [array2[2], array2[1]];
    }
  }
}
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
//stackoverflow - https://stackoverflow.com/questions/8079187/how-to-calculate-the-width-of-the-scroll-bar
function getScrollbarWidth() {
  let div,
    width = getScrollbarWidth.width;
  if (width === undefined) {
    div = document.createElement("div");
    div.innerHTML =
      '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
    div = div.firstChild;
    document.body.appendChild(div);
    width = getScrollbarWidth.width = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
  }
  if (width === undefined || width === null) width = 0;
  return width;
}

function setCurrentImageIndex(element) {
  let idFragments = element.id.split("-");
  currentImageIndex = Number(idFragments[idFragments.length - 1]);
}
function getIDFromElement(element) {
  let idFragments = element.id.split("-");
  return Number(idFragments[idFragments.length - 1]);
}
function rate(selectElement) {
  let rating = selectElement.value;
  let failure = failures[currentFailureIndex];
  ratingOptions.style.color = '';
  failure.imageRating = rating;
  failure.ratingHistory.push(rating);
  failure.viewportSatisfied = checkViewport();
  failure.bodySize = document.body.getBoundingClientRect();

  updateCompleted();
}

function areLayoutsRated() {
  let failure = failures[currentFailureIndex];
  let ratings = failure.imageRating;
  return !ratings === "unrated";
}


function next() {
  let failure = failures[currentFailureIndex];

  if (nextSectionRestriction && failure.imageRating === "unrated") {
    ratingOptions.style.color = "red";
  } else {
    if (currentFailureIndex + 1 < failures.length) {
      ratingOptions.style.color = ""
      //next failure
      currentFailureIndex++;
      setSnapshot();
      tabClick();
      preloadImages();
    }
  }
}
function previous() {
  if (currentFailureIndex - 1 >= 0) {
    ratingOptions.style.color = ""
    //next failure
    currentFailureIndex--;
    setSnapshot();
    tabClick();
    preloadImages();
  }
}

function help() {
  popupInstructions.style.display = "initial";
  instructionsBody.scrollTop = 0;
  instructionsBody.scrollLeft = 0;
  stopTime();
}

function createColumn(width) {
  let colElement = document.createElement("div");
  colElement.classList.add("column");
  colElement.classList.add("center");
  colElement.style = "flex-direction: column;";
  //colElement.style.width = width + "%";
  return colElement;
}


//Goto top button from w3school.com
window.onscroll = function () {
  scrollFunction();
};
function scrollFunction() {
  if (gotoTopButton !== undefined && document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    gotoTopButton.style.visibility = "visible";
  } else if (gotoTopButton !== undefined) {
    gotoTopButton.style.visibility = "hidden";
  }
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
function completed() {
  let count = 0;
  for (let f of failures) {
    if (f.imageRating !== "unrated")
      count++;
  }
  return count;
}
function setIP(ip) {
  IP = ip;
}
function setUA(ua) {
  UA = ua;
}
function getFromServer(scriptName, callback) {
  let request = undefined;
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else {
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        callback(request.responseText.trim());
      } else {
        callback("failed");
      }
    }
  };
  request.open("GET", scriptName, true); // true for asynchronous
  request.send(null);
}
function promptUser(statement, note = "", extraNote = "", submitButtons = true, callback, title = "Prompt") {
  popupPrompt.style.display = '';
  promptElement = document.getElementById("prompt");
  promptTitleBar.innerHTML = title;
  promptHeading.innerHTML = statement;
  promptNote.innerHTML = note;
  surveyCode.innerHTML = extraNote;
  promptButtons = document.getElementById("promptButtons");
  if (submitButtons) {
    promptButtons.style.display = "";
    promptResponse = callback;
  } else {
    promptButtons.style.display = "none";
  }

}
function send(data) {
  promptUser("Submitting... (" + submitAttempt + ")", "Please wait", "", false);
  let request = undefined;
  data = JSON.stringify(data);
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else {
    request = new ActiveXObject("Microsoft.XMLHTTP");
  }
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      if (request.status === 200) {
        if (request.responseText.trim().toLowerCase() === "success") {
          topPageFrame.style.display = 'none';
          bottomPageFrame.style.display = 'none';
          promptUser("Submitted", "Thanks for participating, your survey code: ", SUID, false, undefined);
        } else {
          promptUser("Failed", "Failed to save data on server, try again please. (" + submitAttempt + ")", "", true, sendData);
        }
        console.log(request.responseText);
      } else {
        promptUser("Failed", "Failed to send data to server, try again please. (" + submitAttempt + ")", "", true, sendData);
      }
    }
  };

  request.open("POST", "submit.php", true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(data);
}
function submit() {
  stopTime();
  promptUser("Submit ?", Math.ceil((completed() / failures.length) * 100) + "% COMPLETED", "", true, sendData);
}
function sendData(response) {
  if (response) {
    let endDate = new Date();
    let data = {
      startDate: startDate,
      endDate: endDate,
      duration: (endDate - startDate),
      agreement: agreement,
      workerID: workerID,
      SUID: SUID,
      viewportSatisfied: viewportSatisfied,
      ip: IP,
      ua: UA,
      submitAttempt: submitAttempt++,
      bodyInitialSize: bodyInitialSize,
      totalLoadingTime: totalLoadingTime,
      failures: failures,
    };
    send(data);
  } else {
    startTime();
    popupPrompt.style.display = "none";
  }
}

function setScroll() {
  let f = failures[currentFailureIndex];
  let obj = {
    name: f.name,
    image: f.images[currentImageIndex],
    scroll: contentFrame.scrollTop,
  };
  f.scroll[currentImageIndex] = obj.scroll;
  if (scrollData === undefined) {
    scrollData = [];
    scrollData.push(obj);
    return "First " + obj.image + " (" + obj.scroll + ")";
  } else {
    for (let o of scrollData) {
      if (o.name === obj.name && o.image === obj.image) {
        o.scroll = obj.scroll;
        return "Updated " + obj.image + " (" + obj.scroll + ")";
      }
    }
    scrollData.push(obj);
    return "New " + obj.image + " (" + obj.scroll + ")";
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function agree() {
  let wID = workerIDElement.value.trim();
  if (wID === "") {
    warning.style.display = 'block';
  } else {
    popupConsent.style.display = 'none';
    popupInstructions.style.display = 'initial';
    workerID = wID;
    agreement = true;
    startDate = new Date();
    duration = startDate;
    SUID = startDate.getFullYear() + "-" +
      (startDate.getMonth() + 1) + "-" +
      startDate.getDate() + "-" +
      startDate.getHours() + "-" +
      startDate.getMinutes() + "-" +
      startDate.getSeconds() + "-" +
      startDate.getMilliseconds() + "-" +
      getRandomInt(1, 1001) + "-" +
      getRandomInt(1, 1001) + "-" +
      getRandomInt(1, 1001);
  }
}

/**
 * get how much white space to print..
 * @param {String} string what to print.
 * @param {number} minSpace space reserved for string.
 * @returns strings of white space
 */
function getSpace(string, minSpace) {
  let nLength = string.length;
  nLength = minSpace - nLength;
  let nSpace = "";
  for (let i = 0; i < nLength; i++)
    nSpace += " ";
  return nSpace;
}

function printRatings(list = failures, plus = undefined) {
  for (let f of list) {
    for (let i = 0; i < f.images.length; i++) {
      console.log(f.name + getSpace(f.name, 20) + f.images[i] + getSpace(f.images[i], 10) + f.imageRating + getSpace(f.imageRating, 10) + (plus !== undefined ? f[plus].toString() : ""));
    }
  }
}
function tabClick(target = 'F', userClick = false) {
  tabF.classList.remove("tabActive");
  tabA.classList.remove("tabActive");
  tabB.classList.remove("tabActive");

  let offset = 0;
  if (scrollBarWidth !== null && scrollBarWidth !== undefined && scrollBarWidth > 0)
    offset = scrollBarWidth;
  mainFrame.style.width = (failures[currentFailureIndex].viewport + offset) + "px";
  mainFrame.style.maxWidth = (failures[currentFailureIndex].viewport + offset) + "px";
  updateURL(target);
  updateCompleted();
  updateProgress();

  if (target === 'F') {
    snapshotF.onload = null;
    snapshotA.onload = null;
    snapshotB.onload = null;
    snapshotF.style.display = '';
    snapshotA.style.display = 'none';
    snapshotB.style.display = 'none';
    tabF.classList.add("tabActive");
    currentImageIndex = 0;
    setImageScroll(snapshotF);
  } else if (target === 'A') {
    snapshotF.onload = null;
    snapshotA.onload = null;
    snapshotB.onload = null;
    snapshotF.style.display = 'none';
    snapshotA.style.display = '';
    snapshotB.style.display = 'none';
    tabA.classList.add("tabActive");
    currentImageIndex = 1;
    setImageScroll(snapshotA);
  } else if (target === 'B') {
    snapshotF.onload = null;
    snapshotA.onload = null;
    snapshotB.onload = null;
    snapshotF.style.display = 'none';
    snapshotA.style.display = 'none';
    snapshotB.style.display = '';

    tabB.classList.add("tabActive");
    currentImageIndex = 2;
    setImageScroll(snapshotB);
  }
  updateRating();
  if (userClick)
    updateImageVisit()
}
function updateRating() {
  radioF.checked = false;
  radioA.checked = false;
  radioB.checked = false;
  let currentRating = failures[currentFailureIndex].imageRating;
  if (currentRating === 'F')
    radioF.checked = true;
  if (currentRating === 'A')
    radioA.checked = true;
  if (currentRating === 'B')
    radioB.checked = true;
}
function updateImageVisit() {
  failures[currentFailureIndex].imageVisits[currentImageIndex]++;
}
function setSnapshot() {
  snapshotF.onload = null;
  snapshotA.onload = null;
  snapshotB.onload = null;

  snapshotF.src = '';
  snapshotA.src = '';
  snapshotB.src = '';

  let failure = failures[currentFailureIndex];
  let imagePathF = "/hs/" + mainFile + "/" + failure.name + "-index-html/" + "run-" + failure.run +
    "/" + "human-study/screenshots/" + failure.images[0] + ".png";
  snapshotF.src = imagePathF;

  let imagePathA = "/hs/" + mainFile + "/" + failure.name + "-index-html/" + "run-" + failure.run +
    "/" + "human-study/screenshots/" + failure.images[1] + ".png";
  snapshotA.src = imagePathA;

  let imagePathB = "/hs/" + mainFile + "/" + failure.name + "-index-html/" + "run-" + failure.run +
    "/" + "human-study/screenshots/" + failure.images[2] + ".png";
  snapshotB.src = imagePathB;
}
function setImageScroll(imageElement) {
  loadingElement.style.display = 'initial';
  startLoadingTimer();

  let failure = failures[currentFailureIndex];
  let imagePath = "/hs/" + mainFile + "/" + failure.name + "-index-html/" + "run-" + failure.run +
    "/" + "human-study/screenshots/" + failure.images[currentImageIndex] + ".png";

  imageElement.onload = function () {
    failures[currentFailureIndex].imageLoaded[currentImageIndex] = true;
    contentFrame.scrollTop = failures[currentFailureIndex].scroll[currentImageIndex];
    contentFrame.scrollLeft = 0;
    loadingElement.style.display = 'none';
    stopLoadingTimer();
    startTime();
  };
  imageElement.src = imagePath;
}

function updateCompleted() {
  completedElement.innerHTML = Math.floor(((completed() / failures.length) * 100)) + "%";
  if (completed() === failures.length)
    submitButton.disabled = false;
  else
    submitButton.disabled = true;
}
function updateProgress() {
  progressElement.innerHTML = (currentFailureIndex + 1) + "/" + failures.length;
  description.innerHTML = failures[currentFailureIndex].description;
}
function updateURL(target) {
  ratingQuestion.innerHTML = (currentFailureIndex + 1) + ") " + "Which webpage do you prefer? ";
}

function closeHelp() {
  popupInstructions.style.display = 'none';
  startTime();
}