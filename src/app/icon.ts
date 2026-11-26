import { Component, input } from '@angular/core';

export type IconName = 'arrow' | 'plus';

/** Apenas ícones funcionais de interface (seta dos botões e "+" das perguntas). */
@Component({
  selector: 'app-icon',
  host: { class: 'inline-block shrink-0', 'aria-hidden': 'true' },
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" [attr.stroke-width]="stroke()" stroke-linecap="round" stroke-linejoin="round">
      @switch (name()) {
        @case ('arrow') { <path d="M5 12h14M13 6l6 6-6 6" /> }
        @case ('plus') { <path d="M12 5v14M5 12h14" /> }
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  readonly stroke = input(1.75);
}
