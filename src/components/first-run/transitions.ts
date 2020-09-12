import * as $ from 'jquery';

export function fromNull(): void {
  // In the null state, all divs are hidden
  $('#first-run').show("slow");
}