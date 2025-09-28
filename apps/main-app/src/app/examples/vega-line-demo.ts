import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { VegaChartComponent } from '../components/vega-chart/vega-chart.component';
import type { TopLevelSpec } from 'vega-lite';

@Component({
  selector: 'app-vega-line-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VegaChartComponent],
  template: `
    @defer {
      <app-vega-chart [spec]="spec()"></app-vega-chart>
    } @placeholder {
      <div>Loading line chart…</div>
    }
  `,
})
export class LineChartDemoComponent {
  private readonly values = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    value: Math.round(50 + 25 * Math.sin((i / 12) * Math.PI * 2)),
  }));

  readonly spec = computed<TopLevelSpec>(() => ({
    $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
    description: 'Simple line chart',
    data: { values: this.values },
    mark: { type: 'line', point: true },
    encoding: {
      x: { field: 'month', type: 'quantitative', axis: { title: 'Month' } },
      y: { field: 'value', type: 'quantitative', axis: { title: 'Value' } },
      tooltip: [
        { field: 'month', type: 'quantitative' },
        { field: 'value', type: 'quantitative' },
      ],
    },
    width: 640,
    height: 320,
  }));
}


