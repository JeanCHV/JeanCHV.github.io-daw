/* 
$("#slider-range").slider({
    range: true, 
    min: 0,
    max: 3500,
    step: 50,
    slide: function( event, ui ) {
      $( "#min-price").html(ui.values[ 0 ]);
      
      console.log(ui.values[0])
      
      suffix = '';
      if (ui.values[ 1 ] == $( "#max-price").data('max') ){
         suffix = ' +';
      }
      $( "#max-price").html(ui.values[ 1 ] + suffix);         
    }
  })

  */

  






  /*

 var formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
});

function formatMoney(v) {
  return formatter.format(v);
}

function deformatMoney(v) {
  return parseFloat(v.replace(/[^0-9-.]/g, ""));
}

function removeDollarSign(v) {
  return v.replace(/(\.|\,|\$)+/g, "");
}

function showMessage(message, classes) {
  var alert = deque.createAlert(message, classes);
  alertRegion.appendChild(alert);
  createAriaLiveContainer(message);
}

function createAriaLiveContainer(message) {
  var liveregion_assertive = document.querySelector("#liveregion_assertive");
  if (!liveregion_assertive) {
    var parentDequeSliderContainer = document.querySelector(
      ".deque-slider-multirange"
    );
    var liveRegionElement = document.createElement("div");
    liveRegionElement.id = "liveregion_assertive";
    liveRegionElement.setAttribute("role", "alert");
    liveRegionElement.setAttribute("aria-live", "assertive");
    liveRegionElement.setAttribute("aria-atomic", "true");
    liveRegionElement.style.height = "0px";
    liveRegionElement.style.overflow = "hidden";
    parentDequeSliderContainer.appendChild(liveRegionElement);
  }
  document.getElementById("liveregion_assertive").innerText = message;
}

var multirangeSlider = document.querySelector(".deque-slider-multirange");

var startThumb = multirangeSlider.querySelector(".minPrice");
var stopThumb = multirangeSlider.querySelector(".maxPrice");

var thumbs = [
  {
    label: startThumb.getAttribute("aria-label"),
    labelFromValue: formatMoney,
    stepSize: startThumb.getAttribute("data-increment"),
    initialValue: startThumb.getAttribute("aria-valuenow"),
    classes: [],
    textParser: deformatMoney,
  },
  {
    label: stopThumb.getAttribute("aria-label"),
    labelFromValue: formatMoney,
    stepSize: stopThumb.getAttribute("data-increment"),
    initialValue: stopThumb.getAttribute("aria-valuenow"),
    classes: [],
    textParser: deformatMoney,
  },
];

var minValue = startThumb.getAttribute("aria-valuemin");
minValue = parseInt(minValue);
var maxValue = startThumb.getAttribute("aria-valuemax");
maxValue = parseInt(maxValue);
var orient = startThumb.getAttribute("aria-orientation");

if (!orient) {
  orient = "horizontal";
}
deque.createMultirange(multirangeSlider, thumbs, minValue, maxValue, orient);

var alertRegion = multirangeSlider.querySelector("#alertRegion");

// var startThumb = multirangeSlider.querySelector(".minPrice");
// var stopThumb = multirangeSlider.querySelector(".maxPrice");

var multirangeLabel = multirangeSlider.querySelector("#label");

var startInput = multirangeSlider.querySelector("input:first-child");
var stopInput = multirangeSlider.querySelector("label:nth-of-type(2) input");

startInput.addEventListener("blur", validateInputs);
startInput.addEventListener("keydown", onEnter);
stopInput.addEventListener("blur", validateInputs);
stopInput.addEventListener("keydown", onEnter);

startInput.addEventListener("keyup", triggerEmptyMessage);
stopInput.addEventListener("keyup", triggerEmptyMessage);

startInput.addEventListener("blur", triggerEmptyMessage);
stopInput.addEventListener("blur", triggerEmptyMessage);


function triggerEmptyMessage(e) {
  alertRegion.innerHTML = "";
  e.currentTarget.value = parseInt(e.currentTarget.value);
  if (isNaN(e.currentTarget.value) || e.currentTarget.value == "") {
    e.currentTarget.value = 0;
    e.currentTarget.classList.add("invalid");
    showMessage("Please enter a valid dollar amount", ["error"]);
    e.currentTarget.setAttribute("aria-invalid", true);
    e.currentTarget.focus();
    return false;
  }
  updateSliderRange();

  validateInputs(e);
  return true;
  // return true;
  // if (e.currentTarget == stopInput) {
  //   if (parseInt(e.currentTarget.value) <= 0) {
  //     e.currentTarget.value = 0;
  //     e.currentTarget.classList.add("invalid");
  //     showMessage("Please enter a valid dollar amount", ["error"]);
  //     e.currentTarget.setAttribute("aria-invalid", true);
  //     e.currentTarget.focus();
  //     return false;
  //   }
  // }

  // if (parseInt(e.currentTarget.value) <= 1 || isNaN(e.currentTarget.value)) {
  //   e.currentTarget.value = 0;
  //   e.target.classList.add("invalid");
  //   showMessage("Please enter a valid dollar amount", ["error"]);
  //   e.target.setAttribute("aria-invalid", true);
  //   e.currentTarget.focus();
  //   return false;
  // } else if (e.currentTarget.value.length != 0) {
  //   e.target.classList.remove("invalid");
  //   e.target.setAttribute("aria-invalid", false);
  //   createAriaLiveContainer("");
  //   updateSliderRange();
  // }
}

startThumb.addEventListener("click", function (e) {
  e.currentTarget.focus();
});

function startThumb_getPoint(e) {
  var x =
    e.touches[0].pageX - startThumb.parentElement.getBoundingClientRect().left;
  var y =
    e.touches[0].pageY - startThumb.parentElement.getBoundingClientRect().top;

  return { x: x, y: y };
}

function stopThumb_getPoint(e) {
  var x =
    e.touches[0].pageX - stopThumb.parentElement.getBoundingClientRect().left;
  var y =
    e.touches[0].pageY - stopThumb.parentElement.getBoundingClientRect().top;

  return { x: x, y: y };
}

startThumb.addEventListener("touchmove", function (e) {
  var _getPoint = startThumb_getPoint(e);
  var x = Math.ceil(_getPoint.x);
  var y = _getPoint.y;
  // console.log(x, y);
  e.currentTarget.focus();
  if (x <= 0) {
    x = 0;
    // startInput.value = parseInt(startInput.value) + parseInt(dataIncrement);
  }
  if (x > parseInt(startThumb.parentElement.style.width)) {
    x = parseInt(startThumb.parentElement.style.width);
    // startInput.value = parseInt(startInput.value) + parseInt(dataIncrement);
  }
  multiThumbCalculation(e.currentTarget, startThumb.parentElement, x, "start");
});

stopThumb.addEventListener("touchmove", function (e) {
  var _getPoint = stopThumb_getPoint(e);
  var x = _getPoint.x;
  var y = _getPoint.y;
  // console.log(x, y);
  e.currentTarget.focus();
  if (x <= 0) {
    x = 0;
  }

  if (x > parseInt(stopThumb.parentElement.style.width)) {
    x = parseInt(stopThumb.parentElement.style.width);
  }
  e.currentTarget.style.left = x + "px";
  multiThumbCalculation(e.currentTarget, stopThumb.parentElement, x, "stop");
});

stopThumb.addEventListener("click", function (e) {
  e.currentTarget.focus();
});

startThumb.addEventListener("keyup", function (e) {
  multiThumbCalculation(
    e.currentTarget,
    startThumb.parentElement,
    parseInt(startThumb.style.left),
    "start"
  );
});

stopThumb.addEventListener("keyup", function (e) {
  multiThumbCalculation(
    e.currentTarget,
    stopThumb.parentElement,
    parseInt(stopThumb.style.left),
    "stop"
  );
});

var minPricelb = document.querySelectorAll(".minPricelb")[0];
var maxPricelb = document.querySelectorAll(".maxPricelb")[0];
var colorOverlay = document.querySelectorAll(".colorOverlay")[0];
var minPriceMovingLb = document.querySelectorAll(".minPriceMovingLb")[0];
var maxPriceMovingLb = document.querySelectorAll(".maxPriceMovingLb")[0];
var betweenText = document.querySelectorAll(
  ".deque-slider-multirange #label"
)[0];



var minSliderValue = 0;
var maxSliderValue = 0;

minSliderValue = startThumb.getAttribute("aria-valuemin");
maxSliderValue = startThumb.getAttribute("aria-valuemax");
startInput.value = minSliderValue;
stopInput.value = maxSliderValue;

function multiThumbCalculation(element, parent_element, x, position) {
  // validateInputs(element);

  // console.log(startThumb.style.left, stopThumb.style.left, position);

  if (position == "start") {
    if (
      parseInt(startThumb.style.left) >=
      parseInt(stopThumb.style.left) - 10
    ) {
      // console.log(">>>>>> 1");
      startThumb.style.left = parseInt(stopThumb.style.left) - 11 + "px";
      return false;
    }
  }

  if (position == "stop") {
    if (
      parseInt(startThumb.style.left) + 10 >=
      parseInt(stopThumb.style.left)
    ) {
      // console.log("<<<<< 2");
      stopThumb.style.left = parseInt(startThumb.style.left) + 11 + "px";
      return false;
    }
  }

  var ariaValueNow = element.getAttribute("aria-valuenow");
  var dataIncrement = element.getAttribute("data-increment");
  var ariaValueText = element.getAttribute("aria-valuetext");
  var ariaValueMax = element.getAttribute("aria-valuemax");
  var ariaValueMin = element.getAttribute("aria-valuemin");

  minPricelb.innerHTML = formatMoney(ariaValueMin);
  maxPricelb.innerHTML = formatMoney(ariaValueMax);


  // console.log(minSliderValue);
  // console.log(maxSliderValue);

  var parent_bar_width = parseInt(parent_element.style.width);
  var ariaValueDifference = parseInt(ariaValueMax) - parseInt(ariaValueMin);
  var pointValue = parseInt(ariaValueDifference / parent_bar_width);
  var thumbValue = ariaValueMin;

  if (x <= 0) {
    x = 0;
  }
  if (x >= parent_bar_width) {
    x = parent_bar_width;
  }

  if (position == "start") {
    if (x >= 0) {
      thumbValue = Math.ceil(
        parseInt(ariaValueMin) + parseFloat(pointValue * x)
      );
      minSliderValue = thumbValue;
      element.style.left = x + "px";
      // console.log("START THUMB : ", thumbValue);
    }
  } else if (position == "stop") {
    if (x <= parent_bar_width) {
      thumbValue = Math.ceil(
        parseInt(ariaValueMin) + parseFloat(pointValue * x)
      );
      maxSliderValue = thumbValue;
      element.style.left = x + "px";
      // console.log("ELEMENT STOP LEFT ", element.style.left);
      // console.log("STOP THUMB : ", thumbValue);
    }
  }

  if (position == "start") {
    var startThumbPosition = parseInt(startThumb.style.left) + 10;
    if (startThumbPosition >= parseInt(stopThumb.style.left)) {
      startThumb.style.left = parseInt(stopThumb.style.left) - 10 + "px";
      return false;
    }
  }

  if (position == "stop") {
    var stopThumbPosition = parseInt(stopThumb.style.left);
    if (stopThumbPosition <= parseInt(startThumb.style.left) + 10) {
      stopThumb.style.left = parseInt(startThumb.style.left) + 10 + "px";
      return false;
    }
  }

  updateOverlay();
  var minFormatValue = formatMoney(
    parseFloat(minSliderValue / 1000).toFixed(2)
  );
  var maxFormatVaue = formatMoney(parseFloat(maxSliderValue / 1000).toFixed(2));

  startThumb.setAttribute("aria-valuenow", minSliderValue);
  stopThumb.setAttribute("aria-valuenow", maxSliderValue);

  startThumb.setAttribute("aria-valuetext", formatMoney(minSliderValue));
  stopThumb.setAttribute("aria-valuetext", formatMoney(maxSliderValue));

  minPriceMovingLb.innerHTML = (minFormatValue + "K").replace(".00", "");
  minPriceMovingLb.setAttribute("aria-label", minSliderValue);
  maxPriceMovingLb.innerHTML = (maxFormatVaue + "K").replace(".00", "");
  maxPriceMovingLb.setAttribute("aria-label", maxSliderValue);

  betweenText.innerHTML =
    "Between " +
    formatMoney(minSliderValue) +
    " and " +
    formatMoney(maxSliderValue);

  if (parseInt(stopThumb.style.left) - parseInt(startThumb.style.left) <= 50) {
    minPriceMovingLb.style.top = "auto";
    minPriceMovingLb.style.bottom = "106%";
  } else {
    minPriceMovingLb.style.bottom = "auto";
    minPriceMovingLb.style.top = "106%";
  }

  return true;
}
multiThumbCalculation(
  startThumb,
  startThumb.parentElement,
  parseInt(startThumb.style.left),
  "start"
);
multiThumbCalculation(
  stopThumb,
  stopThumb.parentElement,
  parseInt(stopThumb.style.left),
  "stop"
);

function updateOverlay() {
  colorOverlay.style.left = startThumb.style.left;
  colorOverlay.style.width =
    parseInt(stopThumb.style.left) - parseInt(startThumb.style.left) + "px";
}

function onEnter(e) {
  if (!triggerEmptyMessage(e)) {
    e.currentTarget.value = 0;
    e.target.classList.add("invalid");
    showMessage("Please enter a valid dollar amount", ["error"]);
    e.target.setAttribute("aria-invalid", true);
    e.currentTarget.focus();
    return false;
  }

  if (e.which === 13) {
    validateInputs(e);
    updateSliderRange();
  }
}

function updateSliderRange() {
  if (startInput.value < stopInput.value || 1) {
    startThumb.setAttribute("aria-valuemin", startInput.value);
    startThumb.setAttribute("aria-valuemax", stopInput.value);
    stopThumb.setAttribute("aria-valuemin", startInput.value);
    stopThumb.setAttribute("aria-valuemax", stopInput.value);

    minSliderValue = startInput.value;
    maxSliderValue = stopInput.value;
    betweenText.innerHTML =
      "Between " +
      formatMoney(startInput.value) +
      " and " +
      formatMoney(stopInput.value);

    multiThumbCalculation(
      startThumb,
      startThumb.parentElement,
      parseInt(startThumb.style.left),
      "start"
    );

    multiThumbCalculation(
      stopThumb,
      stopThumb.parentElement,
      parseInt(stopThumb.style.left),
      "stop"
    );
  }
}

function validateInputs(e) {
  alertRegion.innerHTML = "";
  // console.log(e.currentTarget);
  if (e.currentTarget == stopInput) {
    if (
      parseInt(startInput.value) >= parseInt(stopInput.value) ||
      parseInt(stopInput.value) < 1000
    ) {
      e.currentTarget.classList.add("invalid");
      showMessage(
        "Please enter a valid dollar amount and maximum value must be greater than 1000",
        ["error"]
      );
      e.currentTarget.setAttribute("aria-invalid", true);
      e.currentTarget.focus();
      return false;
    }
  } else if (e.currentTarget == startInput) {
    if (parseInt(e.currentTarget.value) < 0 || isNaN(e.currentTarget.value)) {
      e.currentTarget.value = 0;
      e.currentTarget.classList.add("invalid");
      showMessage("Please enter a valid dollar amount", ["error"]);
      e.currentTarget.setAttribute("aria-invalid", true);
      e.currentTarget.focus();
      return false;
    }
  }

  if (startInput.value == stopInput.value) {
    stopInput.classList.add("invalid");
    showMessage("minimum and maximum values should not be same", ["error"]);
    stopInput.setAttribute("aria-invalid", true);
    stopInput.focus();
    console.log(stopInput);
    return false;
  }

  startInput.classList.remove("invalid");
  startInput.setAttribute("aria-invalid", false);
  stopInput.classList.remove("invalid");
  stopInput.setAttribute("aria-invalid", false);

  // if (!triggerEmptyMessage(e) && e.currentTarget == stopInput) {
  //   console.log("error");
  //   e.currentTarget.value = 0;
  //   e.target.classList.add("invalid");
  //   showMessage("Please enter a valid dollar amount", ["error"]);
  //   e.target.setAttribute("aria-invalid", true);
  //   e.currentTarget.focus();
  //   return false;
  // }

  // if (
  //   (startInput.value <= 0 || stopInput.value <= 1) &&
  //   e.currentTarget == stopInput
  // ) {
  //   e.target.classList.add("invalid");
  //   showMessage("Please enter a valid dollar amount", ["error"]);
  //   e.target.setAttribute("aria-invalid", true);
  //   e.currentTarget.focus();
  //   return false;
  // }

  // if (e.currentTarget == stopInput) {
  //   if (!e.currentTarget.value) {
  //     e.currentTarget.focus();
  //     e.target.classList.add("invalid");
  //     showMessage("Value can not be empty", ["error"]);
  //     e.target.setAttribute("aria-invalid", true);
  //     return false;
  //   } else {
  //     createAriaLiveContainer("");
  //     e.target.classList.remove("invalid");
  //     e.target.removeAttribute("aria-invalid");
  //   }
  // }

  var newVal = deformatMoney(e.target.value);
  var maxVal = startThumb.getAttribute("aria-valuemax");
  var minVal = startThumb.getAttribute("aria-valuemin");
  var maxValNow = stopThumb.getAttribute("aria-valuenow");
  var minValNow = startThumb.getAttribute("aria-valuenow");

  /*if (newVal > maxVal || newVal < minVal) {
    e.target.classList.add("invalid");
    showMessage("Value must be between $150,000 and $450,000", ["error"]);
    e.target.setAttribute("aria-invalid", true);
    e.currentTarget.focus();
  } else 
  */
  // console.log("START INPUT :::: ", startInput.value);
  // console.log("STOP INPUT :::: ", stopInput.value);
  
  
  
  
  
  
  /*

  if (isNaN(removeDollarSign(e.target.value))) {
    e.target.classList.add("invalid");
    showMessage("Please enter a valid dollar amount", ["error"]);
    e.target.setAttribute("aria-invalid", true);
    e.currentTarget.focus();
  } else if (
    parseInt(startInput.value) >= parseInt(stopInput.value) &&
    stopInput.value != ""
  ) {
    e.target.classList.add("invalid");
    showMessage("The minimum value must be less than the maximum value", [
      "error",
    ]);
    e.target.setAttribute("aria-invalid", true);
    e.currentTarget.focus();
  } else {
    e.target.classList.remove("invalid");
    e.target.removeAttribute("aria-invalid");
    updateSliderRange();
  }
}

multirangeSlider.addEventListener("change", setMultirangeSliderLabel);
multirangeSlider.addEventListener("change", validateSlider);

function validateSlider(e) {
  alertRegion.innerHTML = "";
  var maxValNow = stopThumb.getAttribute("aria-valuenow");
  var minValNow = startThumb.getAttribute("aria-valuenow");
  if (minValNow > maxValNow) {
    e.target.classList.add("invalid");
    showMessage("The minimum value must be less than the maximum value", [
      "error",
    ]);
    e.target.setAttribute("aria-invalid", true);
  } else {
    createAriaLiveContainer("");
    e.target.classList.remove("invalid");
    e.target.removeAttribute("aria-invalid");
  }
  e.target.focus();
}

function setMultirangeSliderLabel() {
  var label = "Between " + startThumb.getAttribute("aria-valuetext");
  label += " and " + stopThumb.getAttribute("aria-valuetext");

  multirangeLabel.innerText = label;
  updateOverlay();
}

setMultirangeSliderLabel();
updateSliderRange();


*/






 