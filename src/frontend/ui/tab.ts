import * as $ from "jquery";

export function useTab(userFunc?: (elem: HTMLElement) => void) {
  $(".tab").off('click').on('click', function() {
    $(this).parent().children(".tab").removeClass("selected");
    $(this).addClass("selected");
    if (userFunc) {
      userFunc(this);
    }
  });
}