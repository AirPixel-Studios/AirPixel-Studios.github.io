//Function called on page load
$(document).ready(function () {
  "use strict";

  new Splide(".splide", {
    perPage: 3,
    rewind: true,
    mediaQuery: "min",
    breakpoints: {
      1400: {
        perPage: 3,
      },
      1024: {
        perPage: 2,
      },
      767: {
        perPage: 1,
      },
    },
  }).mount();

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
  });
});
