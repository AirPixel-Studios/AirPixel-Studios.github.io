// function called on page load
$(document).ready(function () {
	"use strict";

	let lang, singleOption1Title, singleOption2Title, singleOption3Title, extraOption1Title, extraOption1PriceText, extraOption2Title, total;
	updateLangTexts();

	// variables for calculation
	// fixed: basis
	let subSum1 = 100;

	// range slider: journey
	let singleOption2Price = 0;
	let actualQty2 = 100;
	let subSum2 = singleOption2Price * 1 * (actualQty2 * 1);

	// range slider: flights
	let singleOption3Price = 50;
	let actualQty3 = 1;
	let subSum3 = singleOption3Price * 1 * (actualQty3 * 1);

	// fixed (free): videostabilization
	let extraOption1Price = 0;

	// fixed: provision
	let extraOption2Price = 50;

	// =====================================================
	//      RANGE SLIDERS
	// =====================================================
	initRangeSlider("#option1SingleRangeSlider", "#option1SingleQty", 100, 1500, 50);
	initRangeSlider("#option2SingleRangeSlider", "#option2SingleQty", 1, 20, 1);

	// fill input values of estimator after returning to calculator page
	let estimateData = JSON.parse(localStorage.getItem('estimateData'));
	if (estimateData != null) {
		$("#option1SingleQty").val(estimateData.journey.value.km);
		$("#option2SingleQty").val(estimateData.flights.value.count);
	}

	// language switch event
	$("#switch-lang").click(function (event) {
		updateLangTexts();
		renderFixedPrices();
		renderVariablePrices();
	});

	function updateLangTexts() {
		lang = Cookies.get("lang");
		singleOption1Title = $(`#${lang}_title_basis`).text();
		singleOption2Title = $(`#${lang}_title_journey`).text();
		singleOption3Title = $(`#${lang}_title_flights`).text();
		extraOption1Title = $(`#${lang}_title_videostabilization`).text();
		extraOption1PriceText = $(`#${lang}_title_price`).text();
		extraOption2Title = $(`#${lang}_title_provision`).text();
	}

	// =====================================================
	//      FORM INPUT VALIDATION
	// =====================================================

	// Quantity inputs
	$(".qty-input").on("keypress", function (event) {
		if (event.which != 8 && isNaN(String.fromCharCode(event.which))) {
			event.preventDefault();
		}
	});

	// =====================================================
	//      STICKY SIDEBAR SETUP
	// =====================================================
	$("#orderContainer, #sidebar").theiaStickySidebar({
		additionalMarginTop: 90,
	});

	// =====================================================
	//      CALCULATOR ELEMENTS
	// =====================================================

	renderFixedPrices();
	renderVariablePrices();

	function initRangeSlider(idRange, idInput, iMin, iMax, iStep) {
		var $range = $(idRange),
			$input = $(idInput),
			instance,
			min = iMin,
			max = iMax;

		$range.ionRangeSlider({
			skin: "round",
			type: "single",
			min: min,
			max: max,
			from: min,
			step: iStep,
			hide_min_max: true,
			onStart: function (data) {
				$input.prop("value", data.from);
			},
			onChange: function (data) {
				$input.prop("value", data.from);
				renderVariablePrices();
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

			renderVariablePrices();
		});
	}

	// Function to format item prices usign priceFormat plugin
	function formatItemPrice() {
		$(".price").priceFormat({
			prefix: "	",
			centsSeparator: ".",
			thousandsSeparator: ",",
		});
	}

	// Function to manage the fixed prices and initially set them in the overview box
	function renderFixedPrices() {
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

		$("#extraOption3Sum").html(
			'<span><i class="fa fa-arrow-circle-right"></i></span> ' +
			extraOption1Title +
			": " +
			extraOption1PriceText
		);
	}

	// Function to manage the variable price selections and update them in the overview box
	function renderVariablePrices() {
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
		}

		// Update total in order summary
		total = subSum1 + subSum2 + subSum3 + extraOption1Price + extraOption2Price;

		if (lang === "de") {
			$("#totalTitle").val("Summe:");
		} else {
			$("#totalTitle").val("Total:");
		}
		$("#total").val(total.toFixed(2) + "€");

		formatItemPrice();
		setEstimateData();
	}

	function setEstimateData() {
		var estimateData = {
			basis: {
				lang: {
					de: $('#de_title_basis').text(),
					en: $('#en_title_basis').text(),
				},
				value: subSum1,
			},
			provision: {
				lang: {
					de: $('#de_title_provision').text(),
					en: $('#en_title_provision').text(),
				},
				value: extraOption2Price,
			},
			journey: {
				lang: {
					de: $('#de_title_journey').text(),
					en: $('#en_title_journey').text(),
				},
				value: {
					km: actualQty2,
					price: subSum2,
				},
			},
			flights: {
				lang: {
					// tooltip generated \n & \t chars
					de: $('#de_title_flights').text().replace(/\t/g, '').replace(/\n/g, ''),
					en: $('#en_title_flights').text().replace(/\t/g, '').replace(/\n/g, ''),
				},
				value: {
					count: actualQty3,
					price: subSum3,
				},
			},
			videostabilization: {
				lang: {
					de: $('#de_title_videostabilization').text(),
					en: $('#en_title_videostabilization').text(),
				},
				value: {
					de: $('#de_title_price').text(),
					en: $('#en_title_price').text(),
				},
			},
			totalSum: {
				lang: {
					de: 'Summe',
					en: 'Total',
				},
				value: total,
			},
		};

		localStorage.setItem("estimateData", JSON.stringify(estimateData));
	}
});
