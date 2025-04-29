const cookieyesSrc = "https://cdn-cookieyes.com/client_data/0ec5a8e516eccaa724a461f6/script.js";
const bannerId = "cookieyes";

function createBanner() {
  const el = document.createElement("script");
  el.src = cookieyesSrc;
  el.id = bannerId;
  el.type = "text/javascript";

  document.head.appendChild(el);
}

createBanner();
