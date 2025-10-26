import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ChartJsChartComponent } from '../components/chartjs-chart/chartjs-chart.component';
import type { ChartConfiguration } from 'chart.js';

type XY = { x: number; y: number };

@Component({
  selector: 'app-chartjs-scatter-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartJsChartComponent],
  template: `
    @defer {
      <div style="width: 100%; height: 360px;">
        <app-chartjs-chart [config]="config()"></app-chartjs-chart>
      </div>
    } @placeholder {
      <div>Loading Chart.js scatter chart…</div>
    }
  `,
})
export class ChartJsScatterDemoComponent {
  private readonly points: XY[] = Array.from({ length: 40 }, () => ({
    x: Math.random() * 10,
    y: Math.random() * 10,
  }));

  readonly config = computed<ChartConfiguration>(() => ({
    type: 'scatter',
    data: {
      datasets: [
        {
          label: 'Random points',
          data: this.points,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'X' } },
        y: { title: { display: true, text: 'Y' } },
      },
    },
  }));
}



