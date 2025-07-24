(function(){
  // disable this temporarily as requested by yannis, the data analytics consultant
  return false;

  let attempts = 0;

  function addDataAttr() {
    const spaValue = "auto";
    const el = document.getElementById("fathom-script");
    attempts += 1;
    
    if (!el && attempts < 10) {
      window.setTimeout(addDataAttr, 100);
      return;
    }

    const dataSpaValue = el.dataset.spa;

    if (dataSpaValue === undefined) {
      el.dataset.spa = spaValue;
    }
  }

  addDataAttr();
})();