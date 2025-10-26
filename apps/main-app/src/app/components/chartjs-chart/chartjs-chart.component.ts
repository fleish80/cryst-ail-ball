import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, viewChild } from '@angular/core';
import type { ChartConfiguration } from 'chart.js';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chartjs-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #container class="chartjs-container" style="width: 100%; height: 100%;">
      <canvas #canvas></canvas>
    </div>
  `,
})
export class ChartJsChartComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  config = input<ChartConfiguration | null>(null);

  container = viewChild.required<ElementRef<HTMLDivElement>>('container');
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private chart?: Chart;

  constructor() {
    effect(() => {
      const cfg = this.config();

      const containerRef = this.container();
      const canvasRef = this.canvas();
      const canvasEl = canvasRef?.nativeElement;

      if (!containerRef || !canvasEl) {
        return;
      }

      // Dispose the previous chart instance
      if (this.chart) {
        try {
          this.chart.destroy();
        } catch {
          console.error('Error destroying previous Chart.js instance');
        }
        this.chart = undefined;
      }

      if (!cfg) {
        return;
      }

      const merged: ChartConfiguration = {
        ...cfg,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 350 },
          plugins: { legend: { display: true } },
          ...(cfg?.options ?? {}),
        },
      };

      try {
        this.chart = new Chart(canvasEl, merged);
      } catch (err) {
        const containerEl = containerRef.nativeElement;
        containerEl.innerHTML = `<pre style="white-space: pre-wrap; color: #b00020;">${(err as Error).message}</pre>`;
      }
    });
  }
}



