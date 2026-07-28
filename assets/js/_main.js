/* ==========================================================================
   Lightweight site interactions
   ========================================================================== */

(function () {
  "use strict";

  var root = document.documentElement;
  var colorScheme = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

  function usesChineseLabels() {
    return (root.getAttribute("lang") || "").toLowerCase().indexOf("zh") === 0;
  }

  function readTheme() {
    try {
      var stored = window.localStorage.getItem("theme");
      return stored === "dark" || stored === "light" ? stored : null;
    } catch (_error) {
      return null;
    }
  }

  function writeTheme(theme) {
    try {
      window.localStorage.setItem("theme", theme);
    } catch (_error) {
      // The theme still changes for the current page when storage is unavailable.
    }
  }

  function preferredTheme() {
    return colorScheme && colorScheme.matches ? "dark" : "light";
  }

  function updateThemeControl(theme) {
    var button = document.getElementById("theme-toggle-button");
    var icon = document.getElementById("theme-icon");
    if (!button || !icon) return;

    var isDark = theme === "dark";
    var label = isDark ? "Switch to light theme" : "Switch to dark theme";
    if (usesChineseLabels()) {
      label = isDark ? "切换到浅色主题" : "切换到深色主题";
    }
    button.setAttribute("aria-pressed", String(isDark));
    button.setAttribute("aria-label", label);
    icon.textContent = isDark ? "☾" : "☀";
  }

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    updateThemeControl(theme);
  }

  function initializeTheme() {
    applyTheme(readTheme() || preferredTheme());

    var button = document.getElementById("theme-toggle-button");
    if (button) {
      button.addEventListener("click", function () {
        var nextTheme =
          root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        writeTheme(nextTheme);
        applyTheme(nextTheme);
      });
    }

    if (colorScheme) {
      var followSystemTheme = function () {
        if (!readTheme()) applyTheme(preferredTheme());
      };
      if (colorScheme.addEventListener) {
        colorScheme.addEventListener("change", followSystemTheme);
      } else if (colorScheme.addListener) {
        colorScheme.addListener(followSystemTheme);
      }
    }
  }

  function initializeAuthorLinks() {
    var wrapper = document.querySelector(".author__urls-wrapper");
    if (!wrapper) return;

    var button = wrapper.querySelector("button");
    var links = wrapper.querySelector(".author__urls");
    if (!button || !links) return;

    var desktop = window.matchMedia("(min-width: 925px)");
    var setOpen = function (open) {
      wrapper.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
      links.hidden = !open && !desktop.matches;
    };
    var synchronize = function () {
      setOpen(desktop.matches);
    };

    button.addEventListener("click", function () {
      setOpen(button.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("click", function (event) {
      if (!desktop.matches && !wrapper.contains(event.target)) setOpen(false);
    });
    wrapper.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
        button.focus();
      }
    });
    if (desktop.addEventListener) {
      desktop.addEventListener("change", synchronize);
    } else if (desktop.addListener) {
      desktop.addListener(synchronize);
    }
    synchronize();
  }

  function initialize() {
    initializeTheme();
    initializeAuthorLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
