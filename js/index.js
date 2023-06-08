//Function called on page load
$(document).ready(function () {
  "use strict";

  $(".portfolio-slick").slick({
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    dots: true, 
  });

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
