//Function called on page load
$(document).ready(function () {
	"use strict";

	new Splide(".splide", {
		perPage: 3,
		rewind: true,
		mediaQuery: "max",
		breakpoints: {
			1700: {
				perPage: 3,
			},
			1500: {
				perPage: 2,
			},
			767: {
				perPage: 1,
			},
		},
	}).mount();

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

	//Set sendEstimate to true on initial load
	if (localStorage.getItem('sendEstimate') == null) {
		localStorage.setItem("sendEstimate", true);
	}

	//Send estimate checkbox change event
	$("#de-cf-price-cb, #en-cf-price-cb").change(function () {
		$("#de-cf-price-cb, #en-cf-price-cb").prop("checked", this.checked);
		localStorage.setItem("sendEstimate", this.checked);
	});
	//Overwrite default checked attribute to false
	if (localStorage.getItem('sendEstimate') === 'false') {
		$("#de-cf-price-cb, #en-cf-price-cb").prop("checked", false);
	}

	let contactFormData = JSON.parse(localStorage.getItem('contactForm'));
	if (contactFormData != null) {
		fillSavedContactFormData(contactFormData);
	}

	$("form :input").change(function () {
		saveContactFormData();
	});
});

function saveContactFormData() {
	let lang = Cookies.get("lang");
	let otherLang = ((lang === "de") ? "en" : "de");
	const formInputs = ["name", "email", "subject", "message"];
	let contactFormData = {};

	for (let i = 0; i < formInputs.length; i++) {
		let inputValue = $("#" + lang + "-cf-" + formInputs[i]).val();
		contactFormData[formInputs[i]] = inputValue;

		// set value in other language form
		$("#" + otherLang + "-cf-" + formInputs[i]).val(inputValue);
	}

	localStorage.setItem("contactForm", JSON.stringify(contactFormData));
}

// Function to fill input values of contact form after returning to index page
function fillSavedContactFormData(contactFormData) {
	let lang = Cookies.get("lang");
	let otherLang = ((lang === "de") ? "en" : "de");
	const formInputs = ["name", "email", "subject", "message"];

	for (let i = 0; i < formInputs.length; i++) {
		$("#" + lang + "-cf-" + formInputs[i]).val(contactFormData[formInputs[i]]);
		$("#" + otherLang + "-cf-" + formInputs[i]).val(contactFormData[formInputs[i]]);
	}
}

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

	let singleOption1Title = priceObj.basis.lang[lang];
	let subSum1 = priceObj.basis.value;
	$("#option1SingleSum").html(
		'<span><i class="fa fa-arrow-circle-right"></i></span> ' +
		singleOption1Title +
		":" +
		'<span class="price">' +
		subSum1.toFixed(2) +
		"</span>" +
		"€"
	);

	let extraOption2Title = priceObj.provision.lang[lang];
	let extraOption2Price = priceObj.provision.value;
	$("#extraOption2Sum").html(
		'<span><i class="fa fa-arrow-circle-right"></i></span> ' +
		extraOption2Title +
		": " +
		'<span class="price">' +
		extraOption2Price.toFixed(2) +
		"</span>" +
		"€"
	);

	let singleOption2Title = priceObj.journey.lang[lang];
	let actualQty2 = priceObj.journey.value.km;
	let subSum2 = priceObj.journey.value.price;
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

	let singleOption3Title = priceObj.flights.lang[lang];
	let actualQty3 = priceObj.flights.value.count;
	let subSum3 = priceObj.flights.value.price;
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

	let extraOption1Title = priceObj.videostabilization.lang[lang];
	let extraOption1PriceText = priceObj.videostabilization.value[lang];
	$("#extraOption3Sum").html(
		'<span id="extraOption2SumReset"><i class="fa fa-arrow-circle-right"></i></span> ' +
		extraOption1Title +
		": " +
		extraOption1PriceText
	);

	let totalTitle = priceObj.totalSum.lang[lang];
	let totalPrice = priceObj.totalSum.value;
	$("#totalTitle").val(totalTitle + ":");
	$("#total").val(totalPrice.toFixed(2));

	formatItemPrice();
	formatTotalPrice();
}
