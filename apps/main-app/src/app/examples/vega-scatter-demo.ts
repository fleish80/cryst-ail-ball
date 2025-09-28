import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { VegaChartComponent } from '../components/vega-chart/vega-chart.component';
import type { TopLevelSpec } from 'vega-lite';

@Component({
  selector: 'app-vega-scatter-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VegaChartComponent],
  template: `
    @defer {
      <app-vega-chart [spec]="spec()"></app-vega-chart>
    } @placeholder {
      <div>Loading scatter chart…</div>
    }
  `,
})
export class ScatterChartDemoComponent {
  private readonly values = [
    { x: 5.1, y: 3.5, c: 'A' },
    { x: 4.9, y: 3.0, c: 'A' },
    { x: 4.7, y: 3.2, c: 'A' },
    { x: 7.0, y: 3.2, c: 'B' },
    { x: 6.4, y: 3.2, c: 'B' },
    { x: 6.9, y: 3.1, c: 'B' },
    { x: 6.3, y: 3.3, c: 'C' },
    { x: 5.8, y: 2.7, c: 'C' },
    { x: 7.1, y: 3.0, c: 'C' },
    { x: 6.3, y: 2.9, c: 'C' },
  ];

  readonly spec = computed<TopLevelSpec>(() => ({
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    description: 'Scatter plot with categories',
    data: { values: this.values },
    mark: { type: 'point', filled: true, tooltip: true },
    encoding: {
      x: { field: 'x', type: 'quantitative', axis: { title: 'X' } },
      y: { field: 'y', type: 'quantitative', axis: { title: 'Y' } },
      color: { field: 'c', type: 'nominal', legend: { title: 'Group' } },
    },
    width: 640,
    height: 320,
  }));
}


