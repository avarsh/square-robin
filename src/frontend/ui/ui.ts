// Setup ui components
import * as $ from "jquery";

export function useLinked() {
  // Arrow functions don't set 'this' correctly! Use function() {...}
  $(".linked").off('click').on('click', function() {
    $(this).parent().children(".linked").removeClass("selected");
    $(this).addClass("selected");
  });
}

export function useTickbox(userFunc?: (elem: HTMLElement) => void) {
  $(".tickbox").off('click').on('click', function() {
    $(this).toggleClass("selected");
    if (userFunc) {
      userFunc(this);
    }
  });
}

export function useRevealArrow(userFunc?: (elem: HTMLElement) => void) {
  $(".reveal-arrow").off("click").on("click", function() {
    $(this).toggleClass("selected");
    if (userFunc) {
      userFunc(this);
    }
  });
}