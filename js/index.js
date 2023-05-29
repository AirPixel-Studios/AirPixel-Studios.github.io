//Function called on page load
document.addEventListener('DOMContentLoaded', function() {
  setInitialLangCookie();
});

//Set first cookie when the user is on the page for the first time
function setInitialLangCookie() {
  let cookie = Cookies.get("lang");

  if (cookie === undefined) {
    Cookies.set("lang", "EN", { secure: true, sameSite: "strict" });
    switchLang(Cookies.get("lang"));
  } else {
    switchLang(Cookies.get("lang"));
  }
}

//Language switch event
$("#switch-lang").click(function (event) {
  event.preventDefault();
  switchLang(event.target.innerText);
});

//Change the language of the selected elements on the page
//Note: Each language has its own if case. If we add the Korean language in the future, we can easily extend this function.
function switchLang(lang) {
  if (lang === "DE") {
    Cookies.set("lang", "DE", { secure: true, sameSite: "strict" });
    $('[lang="en"]').hide();
    $('[lang="de"]').show();

    $("#lang-de-btn").addClass("focus");
    $("#lang-en-btn").removeClass("focus");
  } else if (lang === "EN") {
    Cookies.set("lang", "EN", { secure: true, sameSite: "strict" });
    $('[lang="de"]').hide();
    $('[lang="en"]').show();

    $("#lang-en-btn").addClass("focus");
    $("#lang-de-btn").removeClass("focus");
  }
}