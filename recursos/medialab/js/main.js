function closeStickyAd() {
  const ad = document.querySelector(".sticky-ad");
  if (ad) ad.style.display = "none";
}

function skipVideoAd() {
  const overlay = document.querySelector(".video-ad-overlay");
  if (overlay) overlay.style.display = "none";
}

/*
  Aquí podrás insertar más adelante Google Publisher Tag.

  Ejemplo de estructura GAM/GPT:

  <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>

  window.googletag = window.googletag || { cmd: [] };

  googletag.cmd.push(function() {
    googletag
      .defineSlot("/1234567/medialab/home_top", [728, 90], "div-gpt-home-top")
      .addService(googletag.pubads());

    googletag.enableServices();
  });

  Después sustituyes cada .ad-slot demo por un div tipo:
  <div id="div-gpt-home-top"></div>
*/
