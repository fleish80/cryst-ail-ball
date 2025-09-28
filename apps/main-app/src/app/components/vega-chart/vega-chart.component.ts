import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, viewChild } from '@angular/core';
import embed, { VisualizationSpec, EmbedOptions, Result as EmbedResult } from 'vega-embed';

@Component({
  selector: 'app-vega-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #container class="vega-container" style="width: 100%; height: 100%;"></div>
  `,
})
export class VegaChartComponent {
  private host = inject(ElementRef<HTMLElement>);

  spec = input<VisualizationSpec | null>(null);
  options = input<EmbedOptions | null>(null);

  container = viewChild.required<ElementRef<HTMLDivElement>>('container');

  private current?: EmbedResult;

  constructor() {
    effect(async () => {
      const spec = this.spec();
      const options = this.options();

      const containerRef = this.container();
      const containerEl = containerRef?.nativeElement;

      if (!containerEl) {
        return;
      }

      // Clear previous rendering if spec changes
      if (this.current) {
        try {
          this.current.view.finalize();
        } catch {
          console.error('Error finalizing previous view');
        }
        containerEl.innerHTML = '';
        this.current = undefined;
      }

      if (!spec) {
        return;
      }

      // Default responsive options
      const embedOptions: EmbedOptions = {
        actions: false,
        renderer: 'canvas',
        tooltip: true,
        ...options,
      } as EmbedOptions;

      try {
        this.current = await embed(containerEl, spec, embedOptions);
      } catch (err) {
        // Render a minimal error state inside the container
        containerEl.innerHTML = `<pre style="white-space: pre-wrap; color: #b00020;">${(err as Error).message}</pre>`;
      }
    });
  }
}


