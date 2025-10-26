import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { VegaChartComponent } from '../components/vega-chart/vega-chart.component';
import type { TopLevelSpec } from 'vega-lite';

@Component({
  selector: 'app-vega-pie-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VegaChartComponent],
  template: `
    @defer {
      <app-vega-chart [spec]="spec()"></app-vega-chart>
    } @placeholder {
      <div>Loading pie chart…</div>
    }
  `,
})
export class VegaPieDemoComponent {
  private readonly values = [
    { category: 'Red', value: 12 },
    { category: 'Blue', value: 19 },
    { category: 'Yellow', value: 3 },
    { category: 'Green', value: 5 },
    { category: 'Purple', value: 2 },
  ];

  readonly spec = computed<TopLevelSpec>(() => ({
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    description: 'Simple pie chart',
    data: { values: this.values },
    mark: { type: 'arc', tooltip: true, stroke: '#fff' },
    encoding: {
      theta: { field: 'value', type: 'quantitative' },
      color: { field: 'category', type: 'nominal', legend: { title: 'Category' } },
      tooltip: [
        { field: 'category', type: 'nominal' },
        { field: 'value', type: 'quantitative' },
      ],
    },
    width: 400,
    height: 400,
    view: { stroke: null },
  }));
}


