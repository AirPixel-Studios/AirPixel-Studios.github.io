//Function called on page load
$(document).ready(function () {
  "use strict";

  if (Cookies.get("lang") === undefined) {
    //Get language of browser
    var usrlang = navigator.language || navigator.userLanguage;
    if (usrlang === "de-DE" || usrlang === "de") {
      Cookies.set("lang", "de");
    } else {
      Cookies.set("lang", "en");
    }
  }
  switchLang(Cookies.get("lang"));

  //Language switch event
  $("#switch-lang").click(function (event) {
    event.preventDefault();

    if (event.target.innerText.toLowerCase() === "de") {
      Cookies.set("lang", "de");
    } else if (event.target.innerText.toLowerCase() === "en") {
      Cookies.set("lang", "en");
    }

    switchLang(Cookies.get("lang"));
  });

  //Change the language of the selected elements on the page
  //Note: Each language has its own if case. If we add the Korean language in the future, we can easily extend this function.
  function switchLang(lang) {
    if (lang === "de") {
      $('[lang="en"]').hide();
      $('[lang="de"]').show();

      $("#lang-de-btn").addClass("focus");
      $("#lang-en-btn").removeClass("focus");
    } else if (lang === "en") {
      $('[lang="de"]').hide();
      $('[lang="en"]').show();

      $("#lang-en-btn").addClass("focus");
      $("#lang-de-btn").removeClass("focus");
    }
  }
});
