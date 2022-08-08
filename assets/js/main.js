function toggleMenu() {
  var nav = document.getElementById("site-header-nav");
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


jQuery(document).ready(function($) {
  let siteHeader = document.getElementsByClassName('site-header')[0];
  let searchBox = document.getElementById('search_box');
  let searchIcon = document.getElementById('search-icon');
  let nav = document.getElementById('site-header-nav');
  document.addEventListener('click', function(e) {
    if (!siteHeader.contains(e.target)) {
      searchBox.classList.add('mobile-search-hidden');
      searchIcon.style.right = searchBox.classList.contains('mobile-search-hidden') ? '0px' : '5px';
    }
    if (!siteHeader.contains(e.target)) {
      nav.style.maxHeight = '0px';
    }
  })
});