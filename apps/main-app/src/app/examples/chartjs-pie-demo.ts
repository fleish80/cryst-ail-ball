import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ChartJsChartComponent } from '../components/chartjs-chart/chartjs-chart.component';
import type { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chartjs-pie-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartJsChartComponent],
  template: `
    @defer {
      <div style="width: 100%; height: 360px;">
        <app-chartjs-chart [config]="config()"></app-chartjs-chart>
      </div>
    } @placeholder {
      <div>Loading Chart.js pie chart…</div>
    }
  `,
})
export class ChartJsPieDemoComponent {
  private readonly labels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple'];
  private readonly values = [12, 19, 3, 5, 2];

  readonly config = computed<ChartConfiguration>(() => ({
    type: 'pie',
    data: {
      labels: this.labels,
      datasets: [
        {
          label: 'Votes',
          data: this.values,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 206, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
          ],
          borderWidth: 1,
        },
      ],
    },
  }));
}



