//Function called on page load
$(document).ready(function () {
	"use strict";

	new Splide("#splide-portfolio", {
		perPage: 3,
		rewind: true,
		mediaQuery: "max",
		breakpoints: {
			1700: {
				perPage: 2,
			},
			960: {
				perPage: 1,
			},
		},
	}).mount();

	new Splide("#splide-mission", {
		type: "loop",
		perPage: 3,
		focus: "center",
		rewind: true,
		breakpoints: {
			1700: {
				perPage: 2,
			},
			960: {
				perPage: 1,
			},
		},
		autoScroll: {
			speed: 1,
		},
	}).mount(window.splide.Extensions);

	//Render pricing if user has been on pricing page before
	let estimateData = JSON.parse(localStorage.getItem("estimateData"));
	if (estimateData != null) {
		renderVariablePrices(estimateData);
		$(".contact-form").parent().addClass("col-md-8");
		$("#sidebar").show();
	} else {
		$(".contact-form").parent().removeClass("col-md-8");
	}

	$.getScript(
		"../assets/vendor/jquery-validation/dist/localization/messages_" +
		Cookies.get("lang") +
		".js"
	);

	//Language switch event
	$("#switch-lang").click(function (event) {
		$.getScript(
			"../assets/vendor/jquery-validation/dist/localization/messages_" +
			Cookies.get("lang") +
			".js"
		);

		if (estimateData != null) {
			renderVariablePrices(estimateData);
		}
	});

	//Set sendEstimate to true on initial load
	if (localStorage.getItem("sendEstimate") == null) {
		localStorage.setItem("sendEstimate", true);
	}

	//Send estimate checkbox change event
	$("#de-cf-price-cb, #en-cf-price-cb").change(function () {
		$("#de-cf-price-cb, #en-cf-price-cb").prop("checked", this.checked);
		localStorage.setItem("sendEstimate", this.checked);
	});
	//Overwrite default checked attribute to false
	if (localStorage.getItem("sendEstimate") === "false") {
		$("#de-cf-price-cb, #en-cf-price-cb").prop("checked", false);
	}

	let contactFormData = JSON.parse(localStorage.getItem("contactForm"));
	if (contactFormData != null) {
		fillSavedContactFormData(contactFormData);
	}

	$("form :input").change(function () {
		saveContactFormData();
	});
});

// Function to save data from contact form to auto-fill form once user navigates back to form
function saveContactFormData() {
	let lang = Cookies.get("lang");
	let otherLang = lang === "de" ? "en" : "de";
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
	let otherLang = lang === "de" ? "en" : "de";
	const formInputs = ["name", "email", "subject", "message"];

	for (let i = 0; i < formInputs.length; i++) {
		$("#" + lang + "-cf-" + formInputs[i]).val(contactFormData[formInputs[i]]);
		$("#" + otherLang + "-cf-" + formInputs[i]).val(
			contactFormData[formInputs[i]]
		);
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

// Function to manage the calculations and update summary
function renderVariablePrices(estimateData) {
	lang = Cookies.get("lang");

	let singleOption1Title = estimateData.basis.lang[lang];
	let subSum1 = estimateData.basis.value;
	$("#option1SingleSum").html(
		'<span><i class="fa fa-arrow-circle-right"></i></span> ' +
		singleOption1Title +
		": " +
		'<span class="price">' +
		subSum1.toFixed(2) +
		"</span>" +
		" €"
	);

	let extraOption2Title = estimateData.provision.lang[lang];
	let extraOption2Price = estimateData.provision.value;
	$("#extraOption2Sum").html(
		'<span><i class="fa fa-arrow-circle-right"></i></span> ' +
		extraOption2Title +
		": " +
		'<span class="price">' +
		extraOption2Price.toFixed(2) +
		"</span>" +
		" €"
	);

	let singleOption2Title = estimateData.journey.lang[lang];
	let actualQty2 = estimateData.journey.value.km;
	let subSum2 = estimateData.journey.value.price;
	$("#option2SingleSum").html(
		'<span><i class="fa fa-arrow-circle-right"></i></span> ' +
		singleOption2Title +
		" x " +
		actualQty2 +
		"km: " +
		'<span class="price">' +
		subSum2.toFixed(2) +
		"</span>" +
		" €"
	);

	let singleOption3Title = estimateData.flights.lang[lang];
	let actualQty3 = estimateData.flights.value.count;
	let subSum3 = estimateData.flights.value.price;
	$("#option3SingleSum").html(
		'<span"><i class="fa fa-arrow-circle-right"></i></span> ' +
		singleOption3Title +
		" x " +
		actualQty3 +
		": " +
		'<span class="price">' +
		subSum3.toFixed(2) +
		"</span>" +
		" €"
	);

	let extraOption1Title = estimateData.videoStabilization.lang[lang];
	let extraOption1PriceText = estimateData.videoStabilization.value[lang];
	$("#extraOption3Sum").html(
		'<span id="extraOption2SumReset"><i class="fa fa-arrow-circle-right"></i></span> ' +
		extraOption1Title +
		": " +
		extraOption1PriceText
	);

	let totalTitle = estimateData.totalSum.lang[lang];
	let totalPrice = estimateData.totalSum.value;
	$("#totalTitle").val(totalTitle + ":");
	$("#total").val(totalPrice.toFixed(2) + " €");

	formatItemPrice();
}
