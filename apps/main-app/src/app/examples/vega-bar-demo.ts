import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { VegaChartComponent } from '../components/vega-chart/vega-chart.component';
import type { TopLevelSpec } from 'vega-lite';

@Component({
  selector: 'app-vega-bar-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VegaChartComponent],
  template: `
    @defer {
      <app-vega-chart [spec]="spec()"></app-vega-chart>
    } @placeholder {
      <div>Loading bar chart…</div>
    }
  `,
})
export class BarChartDemoComponent {
  private readonly values = [
    { category: 'A', amount: 28 },
    { category: 'B', amount: 55 },
    { category: 'C', amount: 43 },
    { category: 'D', amount: 91 },
    { category: 'E', amount: 81 },
    { category: 'F', amount: 53 },
    { category: 'G', amount: 19 },
    { category: 'H', amount: 87 },
  ];

  readonly spec = computed<TopLevelSpec>(() => ({
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    description: 'Simple bar chart',
    data: { values: this.values },
    mark: 'bar',
    encoding: {
      x: { field: 'category', type: 'ordinal', sort: '-y', axis: { title: 'Category' } },
      y: { field: 'amount', type: 'quantitative', axis: { title: 'Amount' } },
      tooltip: [
        { field: 'category', type: 'ordinal' },
        { field: 'amount', type: 'quantitative' },
      ],
    },
    width: 640,
    height: 320,
  }));
}


