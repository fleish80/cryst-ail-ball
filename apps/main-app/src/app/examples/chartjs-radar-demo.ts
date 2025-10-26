import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ChartJsChartComponent } from '../components/chartjs-chart/chartjs-chart.component';
import type { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chartjs-radar-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartJsChartComponent],
  template: `
    @defer {
      <div style="width: 100%; height: 360px;">
        <app-chartjs-chart [config]="config()"></app-chartjs-chart>
      </div>
    } @placeholder {
      <div>Loading Chart.js radar chart…</div>
    }
  `,
})
export class ChartJsRadarDemoComponent {
  private readonly labels = ['Strength', 'Speed', 'Endurance', 'Skill', 'Luck'];
  private readonly seriesA = [65, 59, 90, 81, 56];
  private readonly seriesB = [28, 48, 40, 19, 96];

  readonly config = computed<ChartConfiguration>(() => ({
    type: 'radar',
    data: {
      labels: this.labels,
      datasets: [
        {
          label: 'Player A',
          data: this.seriesA,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
        },
        {
          label: 'Player B',
          data: this.seriesB,
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          borderColor: 'rgb(255, 159, 64)',
          pointBackgroundColor: 'rgb(255, 159, 64)',
        },
      ],
    },
    options: {
      scales: {
        r: { beginAtZero: true },
      },
    },
  }));
}



