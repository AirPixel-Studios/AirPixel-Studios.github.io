//Function called on page load
$(document).ready(function () {
  "use strict";

  //Language switch event
  $("#switch-lang").click(function (event) {
    updateSummary();
  });

  //Get current language
  let lang = Cookies.get("lang");

  // Variables for calculation
  //var singleOption1Title = "Basis";
  var singleOption1Title = $(`#${lang}_title_basis`).text();
  var subSum1 = 100;

  var singleOption2Title = $(`#${lang}_title_journey`).text();
  var singleOption2Price = 0;
  var actualQty2 = 100;
  var subSum2 = singleOption2Price * 1 * (actualQty2 * 1);

  var singleOption3Title = $(`#${lang}_title_flights`).text();
  var singleOption3Price = 50;
  var actualQty3 = 1;
  var subSum3 = singleOption3Price * 1 * (actualQty3 * 1);

  //Videostabilisierung Checkbox
  var extraOption1Title = $(`#${lang}_title_videostabilization`).text();
  var extraOption1Price = 0;
  var extraOption1PriceText = $(`#${lang}_title_price`).text();

  //Bereitstellung Material Checkbox
  var extraOption2Title = $(`#${lang}_title_provisioning`).text();
  var extraOption2Price = 50;

  var total =
    subSum1 + subSum2 + subSum3 + extraOption1Price + extraOption2Price;

  // =====================================================
  //      STICKY SIDEBAR SETUP
  // =====================================================
  $("#orderContainer, #sidebar").theiaStickySidebar({
    additionalMarginTop: 90,
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

  // Function to set total title and price initially
  function setTotalOnStart() {
    $("#option1SingleSum").html(
      '<span><i class="fa fa-arrow-circle-right"></i></span> ' +
        singleOption1Title +
        ":" +
        '<span class="price">' +
        subSum1.toFixed(2) +
        "</span>" +
        "€"
    );
    $("#extraOption2Sum").html(
      '<span><i class="fa fa-arrow-circle-right"></i></span> ' +
        extraOption2Title +
        ": " +
        '<span class="price">' +
        extraOption2Price.toFixed(2) +
        "</span>" +
        "€"
    );
    $("#option2SingleSum").html(
      '<span><i class="fa fa-arrow-circle-right"></i></span> ' +
        singleOption2Title +
        ` x ${subSum1}km` +
        ":" +
        '<span class="price">' +
        subSum2.toFixed(2) +
        "</span>" +
        "€"
    );
    $("#option3SingleSum").html(
      '<span"><i class="fa fa-arrow-circle-right"></i></span> ' +
        singleOption3Title +
        " x 1:" +
        '<span class="price">' +
        subSum3.toFixed(2) +
        "</span>" +
        "€"
    );

    $("#extraOption3Sum").html(
      '<span><i class="fa fa-arrow-circle-right"></i></span> ' +
        extraOption1Title +
        ": " +
        extraOption1PriceText
    );

    if (lang === "de") {
      $("#totalTitle").val("Summe:");
    } else {
      $("#totalTitle").val("Total:");
    }
    $("#total").val(total.toFixed(2));

    formatItemPrice();
    formatTotalPrice();
  }

  // Function to manage the calculations and update summary
  function updateSummary() {

    lang = Cookies.get("lang");

    var singleOption1Title = $(`#${lang}_title_basis`).text();
    var singleOption2Title = $(`#${lang}_title_journey`).text();
    var singleOption3Title = $(`#${lang}_title_flights`).text();
    var extraOption1Title = $(`#${lang}_title_videostabilization`).text();
    var extraOption1PriceText = $(`#${lang}_title_price`).text();
    var extraOption2Title = $(`#${lang}_title_provisioning`).text();

    subSum1 = 100;
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

    extraOption2Price = 50;
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

    actualQty2 = $("#option1SingleQty").val();
    if (actualQty2 != 0) {
      subSum2 = ((actualQty2 - 100) / 50) * 20;
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
    }

    actualQty3 = $("#option2SingleQty").val();
    if (actualQty3 != 0) {
      if (actualQty3 <= 1) {
        subSum3 = singleOption3Price;
      } else if (actualQty3 > 1 && actualQty3 <= 2) {
        subSum3 = 50 * actualQty3;
      } else if (actualQty3 > 2 && actualQty3 <= 5) {
        subSum3 = 40 * actualQty3;
      } else if (actualQty3 > 5 && actualQty3 <= 20) {
        subSum3 = 35 * actualQty3;
      }

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
    }

    extraOption1Price = 0;
    $("#extraOption3Sum").html(
      '<span id="extraOption2SumReset"><i class="fa fa-arrow-circle-right"></i></span> ' +
        extraOption1Title +
        ": " +
        extraOption1PriceText
    );
    formatItemPrice();

    // Update total in order summary
    total = subSum1 + subSum2 + subSum3 + extraOption1Price + extraOption2Price;

    if (lang === "de") {
      $("#totalTitle").val("Summe:");
    } else {
      $("#totalTitle").val("Total:");
    }
    $("#total").val(total.toFixed(2));
    formatTotalPrice();
  }

  // Set total title and price initially
  setTotalOnStart();

  // When extraOption1 is checked
  $("#extraOption1").on("click", function () {
    updateSummary();
  });

  // When extraOption2 is checked
  $("#extraOption2").on("click", function () {
    updateSummary();
  });

  // =====================================================
  //      RANGE SLIDER 1
  // =====================================================
  var $range = $("#option1SingleRangeSlider"),
    $input = $("#option1SingleQty"),
    instance,
    min = 100,
    max = 1500;

  $range.ionRangeSlider({
    skin: "round",
    type: "single",
    min: min,
    max: max,
    from: 100,
    step: 50,
    hide_min_max: true,
    onStart: function (data) {
      $input.prop("value", data.from);
    },
    onChange: function (data) {
      $input.prop("value", data.from);
      updateSummary();
    },
  });

  instance = $range.data("ionRangeSlider");

  $input.on("input", function () {
    var val = $(this).prop("value");

    // Validate
    if (val < min) {
      val = min;
      $input.val(min);
    } else if (val > max) {
      val = max;
      $input.val(max);
    }

    instance.update({
      from: val,
    });

    updateSummary();
  });

  // =====================================================
  //      RANGE SLIDER 2
  // =====================================================
  var $range2 = $("#option2SingleRangeSlider"),
    $input2 = $("#option2SingleQty"),
    instance2,
    min2 = 1,
    max2 = 20;

  $range2.ionRangeSlider({
    skin: "round",
    type: "single",
    min: min2,
    max: max2,
    from: 1,
    step: 1,
    hide_min_max: true,
    onStart: function (data) {
      $input2.prop("value", data.from);
    },
    onChange: function (data) {
      $input2.prop("value", data.from);
      updateSummary();
    },
  });

  instance2 = $range2.data("ionRangeSlider");

  $input2.on("input", function () {
    var val2 = $(this).prop("value");

    // Validate
    if (val2 < min2) {
      val2 = min2;
      $input2.val(min2);
    } else if (val2 > max2) {
      val2 = max2;
      $input2.val(max2);
    }

    instance2.update({
      from: val2,
    });

    updateSummary();
  });

  // =====================================================
  //      FORM INPUT VALIDATION
  // =====================================================

  // Quantity inputs
  $(".qty-input").on("keypress", function (event) {
    if (event.which != 8 && isNaN(String.fromCharCode(event.which))) {
      event.preventDefault();
    }
  });

  // Store pricing object
  $("#submitWithCalc").on("click", function (event) {
    var priceObj = {
      Basis: subSum1,
      Provisioning: extraOption2Price,
      Journey: {
        km: actualQty2,
        price: subSum2,
      },
      Flights: {
        count: actualQty3,
        price: subSum3,
      },
      Videostabilization: 0,
      TotalSum: total,
    };

    localStorage.setItem("pricingObj", JSON.stringify(priceObj));
  });
});
