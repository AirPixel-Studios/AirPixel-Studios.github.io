//Function called on page load
$(document).ready(function () {
  "use strict";

  $.getScript("../assets/vendor/jquery-validation/dist/localization/messages_" + Cookies.get("lang") + ".js");

  //Language switch event
  $("#switch-lang").click(function (event) {
    $.getScript("../assets/vendor/jquery-validation/dist/localization/messages_" + Cookies.get("lang") + ".js");
  });
});