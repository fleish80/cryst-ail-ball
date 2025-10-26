import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ChartJsChartComponent } from '../components/chartjs-chart/chartjs-chart.component';
import type { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chartjs-bar-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartJsChartComponent],
  template: `
    @defer {
      <div style="width: 100%; height: 360px;">
        <app-chartjs-chart [config]="config()"></app-chartjs-chart>
      </div>
    } @placeholder {
      <div>Loading Chart.js bar chart…</div>
    }
  `,
})
export class ChartJsBarDemoComponent {
  private readonly labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  private readonly values = [28, 55, 43, 91, 81, 53, 19, 87];

  readonly config = computed<ChartConfiguration>(() => ({
    type: 'bar',
    data: {
      labels: this.labels,
      datasets: [
        {
          label: 'Amount',
          data: this.values,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        x: { title: { display: true, text: 'Category' } },
        y: { beginAtZero: true, title: { display: true, text: 'Amount' } },
      },
    },
  }));
}



