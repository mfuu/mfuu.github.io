function toggleMenu() {
  var nav = document.getElementsByClassName("site-header-nav")[0];
  var navHeight = nav.scrollHeight;
  if (!nav.style.maxHeight || nav.style.maxHeight == "0px") {
    nav.style.maxHeight = `${navHeight}px`;
  } else {
    nav.style.maxHeight = '0px';
  }
}

jQuery(function() {
  // 回到顶部
  function toTop () {
    var $toTop = $(".gotop");

    $(window).on("scroll", function () {
      if ($(window).scrollTop() >= $(window).height()) {
        $toTop.css("display", "block").fadeIn();
      } else {
        $toTop.fadeOut();
      }
    });

    $toTop.on("click", function (evt) {
      var $obj = $("body,html");
      $obj.animate({
        scrollTop: 0
      }, 240);

      evt.preventDefault();
    });
  }

  toTop();

  window.toTop = toTop

});
