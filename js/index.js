//Function called on page load
$(document).ready(function () {
  "use strict";

  videojs('page-background-video', {
    autoplay: true,
    controls: false,
    loop: true,
    muted: true,
    fluid: true,
    preload: 'auto',
    poster: 'assets/videos/Background.mp4',
    sources: [
        { src: 'assets/videos/Background.mp4', type: 'video/mp4' }
    ]
});

  $.getScript("../assets/vendor/jquery-validation/dist/localization/messages_" + Cookies.get("lang") + ".js");

  //Language switch event
  $("#switch-lang").click(function (event) {
    $.getScript("../assets/vendor/jquery-validation/dist/localization/messages_" + Cookies.get("lang") + ".js");
  });
});