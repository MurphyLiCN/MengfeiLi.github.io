/* ==========================================================================
   Dependency-free priority navigation
   ========================================================================== */

(function () {
  "use strict";

  function initializeGreedyNavigation() {
    var nav = document.getElementById("site-nav");
    if (!nav) return;

    var button = nav.querySelector(".greedy-nav__toggle");
    var visible = nav.querySelector(".visible-links");
    var hidden = nav.querySelector(".hidden-links");
    if (!button || !visible || !hidden) return;

    var breakpoints = [];
    var usesChineseLabels =
      (document.documentElement.getAttribute("lang") || "")
        .toLowerCase()
        .indexOf("zh") === 0;

    function setDropdown(open) {
      var hasItems = hidden.children.length > 0;
      var expanded = Boolean(open && hasItems);
      hidden.hidden = !expanded;
      hidden.classList.toggle("hidden", !expanded);
      button.classList.toggle("close", expanded);
      button.setAttribute("aria-expanded", String(expanded));
    }

    function availableWidth() {
      return nav.clientWidth - (button.hidden ? 0 : button.offsetWidth + 30);
    }

    function updateNavigation() {
      while (
        visible.scrollWidth > availableWidth() &&
        visible.querySelector("li:not(.persist)")
      ) {
        breakpoints.push(visible.scrollWidth);
        var candidates = visible.querySelectorAll("li:not(.persist)");
        hidden.insertBefore(candidates[candidates.length - 1], hidden.firstChild);
        button.hidden = false;
      }

      while (
        breakpoints.length &&
        availableWidth() > breakpoints[breakpoints.length - 1]
      ) {
        var tail = visible.querySelector(".persist.tail");
        visible.insertBefore(hidden.firstElementChild, tail || null);
        breakpoints.pop();
      }

      button.hidden = hidden.children.length === 0;
      button.setAttribute(
        "aria-label",
        (usesChineseLabels ? "更多导航链接" : "More navigation links") +
          (hidden.children.length ? " (" + hidden.children.length + ")" : "")
      );
      if (button.hidden) setDropdown(false);

      var masthead = document.querySelector(".masthead");
      if (masthead) {
        document.body.style.paddingTop = masthead.offsetHeight + "px";
      }
    }

    button.addEventListener("click", function () {
      setDropdown(button.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setDropdown(false);
        button.focus();
      }
    });
    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) setDropdown(false);
    });
    window.addEventListener("resize", updateNavigation, { passive: true });
    if (screen.orientation && screen.orientation.addEventListener) {
      screen.orientation.addEventListener("change", updateNavigation);
    }

    updateNavigation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeGreedyNavigation);
  } else {
    initializeGreedyNavigation();
  }
})();
