// Setup ui components
import * as $ from "jquery";

export function useLinked() {
  // Arrow functions don't set 'this' correctly! Use function() {...}
  $(".linked").click(function() {
    $(this).parent().children(".linked").removeClass("selected");
    $(this).addClass("selected");
  });
}