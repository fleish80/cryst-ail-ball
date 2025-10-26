import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ChartJsChartComponent } from '../components/chartjs-chart/chartjs-chart.component';
import type { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chartjs-line-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartJsChartComponent],
  template: `
    @defer {
      <div style="width: 100%; height: 360px;">
        <app-chartjs-chart [config]="config()"></app-chartjs-chart>
      </div>
    } @placeholder {
      <div>Loading Chart.js line chart…</div>
    }
  `,
})
export class ChartJsLineDemoComponent {
  private readonly labels = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
  private readonly values = Array.from({ length: 12 }, (_, i) => Math.round(50 + 25 * Math.sin((i / 12) * Math.PI * 2)));

  readonly config = computed<ChartConfiguration>(() => ({
    type: 'line',
    data: {
      labels: this.labels,
      datasets: [
        {
          label: 'Value',
          data: this.values,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.25)',
          pointRadius: 4,
          tension: 0.2,
        },
      ],
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Month' } },
        y: { title: { display: true, text: 'Value' } },
      },
    },
  }));
}



