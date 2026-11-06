/**
 * Barking Bear — Training page sub-navigation
 * Collapsible "Jump to a section" menu on narrow screens; closes after a link is chosen.
 */
(function () {
  "use strict";

  var subnav = document.getElementById("training-subnav");
  var toggle = document.getElementById("trainingSubnavToggle");
  if (!subnav || !toggle) return;

  function setOpen(open) {
    subnav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setOpen(!subnav.classList.contains("open"));
  });

  subnav.addEventListener("click", function (event) {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setOpen(false);
  });
})();
