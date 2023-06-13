//Function called on page load
$(document).ready(function () {
  "use strict";

  //Render pricing if user has been on pricing page before
  let priceObj = JSON.parse(localStorage.getItem('priceObj'));
  if (priceObj != null) {
    updateSummary(priceObj);
    $(".contact-form").parent().addClass("col-md-8");
    $("#sidebar").show();
  } else {
    $(".contact-form").parent().removeClass("col-md-8");
  }

  $.getScript("../assets/vendor/jquery-validation/dist/localization/messages_" + Cookies.get("lang") + ".js");

  //Language switch event
  $("#switch-lang").click(function (event) {
    $.getScript("../assets/vendor/jquery-validation/dist/localization/messages_" + Cookies.get("lang") + ".js");

    if (priceObj != null) {
      updateSummary(priceObj);
    }
  });

  //Send estimate checkbox change event
  $("#de-cf-price-cb, #en-cf-price-cb").change(function () {
    $("#de-cf-price-cb, #en-cf-price-cb").prop("checked", this.checked);
    localStorage.setItem("sendEstimate", this.checked);
  });
  //Overwrite default checked attribute to false
  if (localStorage.getItem('sendEstimate') === 'false') {
    $("#de-cf-price-cb, #en-cf-price-cb").prop("checked", false);
  }
});

// =====================================================
//      CALCULATOR ELEMENTS
// =====================================================

// Function to format item prices usign priceFormat plugin
function formatItemPrice() {
  $(".price").priceFormat({
    prefix: "	",
    centsSeparator: ".",
    thousandsSeparator: ",",
  });
}

// Function to format total price usign priceFormat plugin
function formatTotalPrice() {
  $("#total").priceFormat({
    prefix: "	",
    centsSeparator: ".",
    thousandsSeparator: ",",
  });
}

// Function to manage the calculations and update summary
function updateSummary(priceObj) {
  lang = Cookies.get("lang");

  var singleOption1Title = priceObj.basis.lang[lang];
  var singleOption2Title = priceObj.journey.lang[lang];
  var singleOption3Title = priceObj.flights.lang[lang];
  var extraOption1Title = priceObj.videostabilization.lang[lang];
  var extraOption1PriceText = priceObj.totalSum.lang[lang];
  var extraOption2Title = priceObj.provision.lang[lang];

  var subSum1 = priceObj.basis.value;
  $("#option1SingleSum").html(
    '<span><i class="fa fa-arrow-circle-right"></i></span> ' +
    singleOption1Title +
    ":" +
    '<span class="price">' +
    subSum1.toFixed(2) +
    "</span>" +
    "€"
  );
  formatItemPrice();

  var extraOption2Price = priceObj.provision.value;
  $("#extraOption2Sum").html(
    '<span><i class="fa fa-arrow-circle-right"></i></span> ' +
    extraOption2Title +
    ": " +
    '<span class="price">' +
    extraOption2Price.toFixed(2) +
    "</span>" +
    "€"
  );
  formatItemPrice();

  var actualQty2 = priceObj.journey.value.km;
  var subSum2 = priceObj.journey.value.price;
  $("#option2SingleSum").html(
    '<span><i class="fa fa-arrow-circle-right"></i></span> ' +
    singleOption2Title +
    " x " +
    actualQty2 +
    "km:" +
    '<span class="price">' +
    subSum2.toFixed(2) +
    "</span>" +
    "€"
  );
  formatItemPrice();

  var actualQty3 = priceObj.flights.value.count;
  var subSum3 = priceObj.flights.value.price;
  $("#option3SingleSum").html(
    '<span"><i class="fa fa-arrow-circle-right"></i></span> ' +
    singleOption3Title +
    " x " +
    actualQty3 +
    ":" +
    '<span class="price">' +
    subSum3.toFixed(2) +
    "</span>" +
    "€"
  );
  formatItemPrice();

  var extraOption1Price = priceObj.videostabilization.value;
  $("#extraOption3Sum").html(
    '<span id="extraOption2SumReset"><i class="fa fa-arrow-circle-right"></i></span> ' +
    extraOption1Title +
    ": " +
    extraOption1PriceText
  );
  formatItemPrice();

  var total = priceObj.totalSum.value;
  if (lang === "de") {
    $("#totalTitle").val("Summe:");
  } else {
    $("#totalTitle").val("Total:");
  }
  $("#total").val(total.toFixed(2));
  formatTotalPrice();
}