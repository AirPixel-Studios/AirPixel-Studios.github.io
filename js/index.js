//Function called on page load
$(document).ready(function () {
  var lang = Cookies.get("lang");

  if (lang === undefined) {
    //Get language of browser
    var usrlang = navigator.language || navigator.userLanguage;
    if (usrlang === "de-DE" || usrlang === "de") {
      Cookies.set("lang", "DE");
    } else {
      Cookies.set("lang", "EN");
    }
  }
  
  switchLang(Cookies.get("lang"));


  //Language switch event
  $("#switch-lang").click(function (event) {
    event.preventDefault();
    switchLang(event.target.innerText);
  });

  //Change the language of the selected elements on the page
  //Note: Each language has its own if case. If we add the Korean language in the future, we can easily extend this function.
  function switchLang(lang) {
    if (lang === "DE") {
      Cookies.set("lang", "DE");
      $('[lang="en"]').hide();
      $('[lang="de"]').show();

      $("#lang-de-btn").addClass("focus");
      $("#lang-en-btn").removeClass("focus");
    } else if (lang === "EN") {
      Cookies.set("lang", "EN");
      $('[lang="de"]').hide();
      $('[lang="en"]').show();

      $("#lang-en-btn").addClass("focus");
      $("#lang-de-btn").removeClass("focus");
    }
  }
});
