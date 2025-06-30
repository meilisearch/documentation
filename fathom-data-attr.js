const spaValue = "auto";

function addDataAttr() {
  const el = document.getElementById("fathom-script");
  const dataSpaValue = el.dataset.spa;

  if (dataSpaValue === undefined) {
    el.dataset.spa = spaValue;
  }
}

addDataAttr();