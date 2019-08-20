//CONSTANTS

var PERIODS_PER_DAY = 10;
var slotList = ["Early Bird", "1st Period", "2nd Period", "3rd Period", "4th Period", "5th Period", "6th Period", "7th Period", "8th Period", "9th Period"];
var DELAY = 15;

var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
var sheetStart = 1;
var currentDay;
var dayOfWeek;

// GLOBAL VARIABLES

var currentlyShowing, currentPeriod, timeLeft;


//QUICK SELECT

function sel(query) {
  return document.querySelector(query);
}

//DATE AND TIME
//functions
function numSuffix(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

function toBool(str) {
  if (str == "TRUE") {
    return true;
  } else if (str == "FALSE") {
    return false;
  } else {
    return "Error";
  }
}

function twoDigit(i) {
  if (i.toString().length === 1) {
    return ('0' + i);
  } else {
    return i;
  }
}


//BEGIN BIG OLE' FUNCTION
function reload() {

  var mocktime = getParameterByName("mock_time");
  var date;
  if (mocktime) {
    date = new Date(mocktime * 1000);
  } else {
    date = new Date();
  }
  //Fill left column
  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  dayOfWeek = days[date.getDay()];
  currentDay = weekdays.indexOf(dayOfWeek) + 1; //For sheet selection
  var month = months[date.getMonth()];
  var day = date.getDate();
  var year = date.getFullYear();
  var hour = (date.getHours() > 12) ? date.getHours() - 12 : date.getHours();
  if (hour == 0) {
    hour = 12;
  }
  var period = (date.getHours() < 12) ? "AM" : "PM";
  var minute = date.getMinutes();
  var fullDate = dayOfWeek + ', ' + month + ' ' + numSuffix(day);
  var fullTime = hour + ':' + twoDigit(minute) + " " + period;

  sel('#date').innerHTML = fullDate;
  sel('#time').innerHTML = fullTime;
  get();
}
reload();
//ETHSBELL

function ajax(theUrl, callback, nextFunc) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      if (nextFunc) {
        callback(xmlHttp.responseText, nextFunc);
      } else {
        callback(xmlHttp.responseText);
      }
  };
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function get() {


  var mocktime = getParameterByName("mock_time");

  if (mocktime == null) {
    mocktime = "";
  } else {
    mocktime = "?mock_time=" + mocktime;
  }


  var bellUrl = "https://api.ethsbell.xyz/data" + mocktime;

  ajax(bellUrl, function(data) {
    data = JSON.parse(data);
    var d;
    currentPeriod = data.theSlot;
    timeLeft = data.timeLeftInPeriod;

    if (currentPeriod == null) {
      sel('#timeleft').innerHTML = '';
    } else {
      sel('#timeleft').innerHTML = currentPeriod + ' ends in ' + timeLeft + ' minutes.';
    }
  });
}
var interval = setInterval(reload, DELAY * 1000);


function appendFrame() {
  var iframe = document.createElement('iframe');
  iframe.src = "https://docs.google.com/presentation/d/e/2PACX-1vSCj5Rsfp3Gdfy019a1eC3LY1wkdb1EFyEsjJs617i2BJibS-tM42IqSIWNTFZSfyXmnuIf1Dz3z3je/embed?start=true&loop=true&delayms=10000&rm=minimal";
  iframe.height = window.innerHeight;
  iframe.width = window.innerWidth;
  sel('#main').innerHTML = '';
  sel('#main').appendChild(iframe);
}

appendFrame();
window.addEventListener('resize', appendFrame);
window.addEventListener('click', appendFrame);
