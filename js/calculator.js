$(document).ready(function () {
  "use strict";

  // =====================================================
  //      PRELOADER
  // =====================================================
  $(window).on("load", function () {
    "use strict";
    $('[data-loader="circle-side"]').fadeOut(); // will first fade out the loading animation
    $("#preloader").delay(350).fadeOut("slow"); // will fade out the white DIV that covers the website.
    var $hero = $(".hero-home .content");
    var $hero_v = $("#hero_video .content ");
    $hero.find("h3, p, form").addClass("fadeInUp animated");
    $hero.find(".btn-1").addClass("fadeIn animated");
    $hero_v.find(".h3, p, form").addClass("fadeInUp animated");
    $(window).scroll();
  });

  // =====================================================
  //      STICKY SIDEBAR SETUP
  // =====================================================
  $("#mainContent, #sidebar").theiaStickySidebar({
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
        singleOption1Title + ':' +
        '<span class="price">' +
        subSum1.toFixed(2) +
        "</span>" +
        "€"
    );
    $("#option2SingleSum").html(
      '<span><i class="fa fa-arrow-circle-right"></i></span> ' +
        singleOption2Title + ':' +
        '<span class="price">' +
        subSum2.toFixed(2) +
        "</span>" +
        "€"
    );
    $("#option3SingleSum").html(
      '<span"><i class="fa fa-arrow-circle-right"></i></span> ' +
        singleOption3Title + ':' +
        '<span class="price">' +
        subSum3.toFixed(2) +
        "</span>" +
        "€"
    );

    $("#totalTitle").val("Summe:");
    $("#total").val(total.toFixed(2));

    formatItemPrice();
    formatTotalPrice();
  }

  // Variables for calculation
  var singleOption1Title = "Basis";
  var actualQty1 = 1;
  var subSum1 = 100;

  var singleOption2Title = "Anfahrt";
  var singleOption2Price = 0;
  var actualQty2 = 100;
  var subSum2 = singleOption2Price * 1 * (actualQty2 * 1);

  var singleOption3Title = "Flüge (inkl. Spotter)";
  var singleOption3Price = 0;
  var actualQty3 = 1;
  var subSum3 = singleOption3Price * 1 * (actualQty3 * 1);

  //Videostabilisierung Checkbox
  var extraOption1IsChecked = false;
  var extraOption1Title = "Videostabilisierung";
  var extraOption1Price = 0;

  //Bereitstellung Material Checkbox
  var extraOption2IsChecked = false;
  var extraOption2Title = "Bereitstellung des Materials";
  var extraOption2Price = 50;

  var total = subSum1 + subSum2 + subSum3;

  // Function to manage the calculations and update summary
  function updateSummary() {
    // Get the current data from option1Single elements
    //actualQty1 = $("#option1SingleQty").val();

    // Update order summary with option1Single details

    subSum1 = 100;
    $("#option1SingleSum").html(
      '<span><i class="fa fa-arrow-circle-right"></i></span> ' +
        singleOption1Title + ':' +
        '<span class="price">' +
        subSum1.toFixed(2) +
        "</span>" +
        "€"
    );
    formatItemPrice();

    // Get the current data from option2Single elements
    actualQty2 = $("#option1SingleQty").val();

    // Update order summary with option2Single details
    if (actualQty2 != 0) {
      subSum2 = ((actualQty2 - 100)/50) * 20
      $("#option2SingleSum").html(
        '<span><i class="fa fa-arrow-circle-right"></i></span> ' +
          singleOption2Title +
          " x " +
          actualQty2 + 'km:' +
          '<span class="price">' +
          subSum2.toFixed(2) +
          "</span>" + '€'
      );
      formatItemPrice();
    }

    // Get the current data from option3Single elements
    actualQty3 = $("#option2SingleQty").val();

    // Update order summary with option3Single details
    if (actualQty3 != 0) {

		if (actualQty3 === 1) {
			subSum3 = 0;
		} else if (actualQty3 > 1 && actualQty3 <= 2) {
			subSum3 = 50 * actualQty3;
		} else if (actualQty3 > 2 && actualQty3 <= 5) {
			subSum3 = 40 * actualQty3;
		} else if (actualQty3 > 5 && actualQty3 <= 20) {
			subSum3 = 35 * actualQty3
		}

		console.log(actualQty3)
		console.log(subSum3)

      $("#option3SingleSum").html(
        '<span"><i class="fa fa-arrow-circle-right"></i></span> ' +
          singleOption3Title +
          " x " +
          actualQty3 +
          '<span class="price">' +
          subSum3.toFixed(2) +
          "</span>" + '€'
      );
      formatItemPrice();
    }

    // Get the current data from extraOption1
    extraOption1IsChecked = $("#extraOption1").is(":checked");
    // extraOption1Title = $("#extraOption1Title").text();
    extraOption1Price = $("#extraOption1").val();

    if (extraOption1IsChecked) {
      extraOption1Price = extraOption1Price * 1;
      $("#extraOption1Sum").html(
        '<span id="extraOption1SumReset"><i class="fa fa-arrow-circle-right"></i></span> ' +
          extraOption1Title +
          '<span class="price">' +
          extraOption1Price.toFixed(2) +
          "</span>" +
          "€"
      );
      formatItemPrice();
    } else {
      // If option is not checked

      extraOption1Price = 0;
      clearSummaryLine("extraOption1Sum");
    }

    // Get the current data from extraOption2
    extraOption2IsChecked = $("#extraOption2").is(":checked");
    //extraOption2Title = $("#extraOption2Title").text();
    extraOption2Price = $("#extraOption2").val();

    if (extraOption2IsChecked) {
      extraOption2Price = extraOption2Price * 1;
      $("#extraOption2Sum").html(
        '<span id="extraOption2SumReset"><i class="fa fa-arrow-circle-right"></i></span> ' +
          extraOption2Title +
          '<span class="price">' +
          extraOption2Price.toFixed(2) +
          "</span>" +
          "€"
      );
      formatItemPrice();
    } else {
      // If option is not checked

      extraOption2Price = 0;
      clearSummaryLine("extraOption2Sum");
    }

    // Update total in order summary
    total = subSum1 + subSum2 + subSum3 + extraOption1Price + extraOption2Price;
    $("#total").val(total.toFixed(2));
    formatTotalPrice();
  }

  // Function to clear line in order summary
  function clearSummaryLine(summaryLineName) {
    if (summaryLineName == "extraOption1Sum") {
      $("#extraOption1Sum").html("");
    } else if (summaryLineName == "extraOption2Sum") {
      $("#extraOption2Sum").html("");
    }
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
    max = 1000;

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
});
