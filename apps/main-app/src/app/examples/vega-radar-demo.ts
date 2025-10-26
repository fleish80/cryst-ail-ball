import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { VegaChartComponent } from '../components/vega-chart/vega-chart.component';
import type { Spec as VegaSpec } from 'vega';

@Component({
  selector: 'app-vega-radar-demo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VegaChartComponent],
  template: `
    @defer {
      <app-vega-chart [spec]="spec()"></app-vega-chart>
    } @placeholder {
      <div>Loading radar chart…</div>
    }
  `,
})
export class VegaRadarDemoComponent {
  private readonly categories = ['Strength', 'Speed', 'Endurance', 'Skill', 'Luck'];
  private readonly a = [65, 59, 90, 81, 56];
  private readonly b = [28, 48, 40, 19, 96];

  readonly spec = computed<VegaSpec>(() => ({
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    description: 'Radar / Spider chart implemented in Vega',
    width: 450,
    height: 450,
    signals: [
      { name: 'radius', update: 'min(width, height) / 2' },
      { name: 'levels', value: 5 },
    ],
    data: [
      {
        name: 'categories',
        values: this.categories.map((c, i) => ({ category: c, index: i })),
      },
      {
        name: 'series',
        values: [
          { id: 'A', values: this.a },
          { id: 'B', values: this.b },
        ],
        transform: [
          { type: 'flatten', fields: ['values'], as: ['value'] },
          {
            type: 'formula',
            as: 'index',
            expr: 'datum.flatten_index',
          },
          {
            type: 'lookup',
            from: 'categories',
            key: 'index',
            fields: ['index'],
            values: ['category'],
            as: ['category'],
          },
          { type: 'formula', as: 'angle', expr: '(datum.index / length(data("categories"))) * 2 * PI' },
          { type: 'formula', as: 'r', expr: '(datum.value / 100) * radius' },
          { type: 'formula', as: 'x', expr: 'radius + datum.r * cos(datum.angle - PI/2)' },
          { type: 'formula', as: 'y', expr: 'radius + datum.r * sin(datum.angle - PI/2)' },
        ],
      },
      {
        name: 'grid',
        transform: [
          { type: 'sequence', start: 1, stop: { signal: 'levels + 1' } },
          { type: 'formula', as: 'r', expr: '(datum.value / levels) * radius' },
        ],
      },
    ],
    scales: [],
    marks: [
      // grid circles
      {
        type: 'group',
        from: { data: 'grid' },
        marks: [
          {
            type: 'arc',
            encode: {
              enter: {
                x: { signal: 'radius' },
                y: { signal: 'radius' },
                startAngle: { value: 0 },
                endAngle: { value: 6.28318 },
                innerRadius: { value: 0 },
                outerRadius: { field: 'r' },
                fill: { value: '#f4f4f4' },
                stroke: { value: '#ddd' },
              },
            },
          },
        ],
      },
      // axes lines
      {
        type: 'group',
        from: { data: 'categories' },
        marks: [
          {
            type: 'line',
            encode: {
              enter: {
                x: { value: 225 },
                y: { value: 225 },
                x2: { signal: 'radius + radius * cos((datum.index/length(data("categories"))) * 2 * PI - PI/2)' },
                y2: { signal: 'radius + radius * sin((datum.index/length(data("categories"))) * 2 * PI - PI/2)' },
                stroke: { value: '#bbb' },
              },
            },
          },
          {
            type: 'text',
            encode: {
              enter: {
                x: { signal: 'radius + (radius + 12) * cos((datum.index/length(data("categories"))) * 2 * PI - PI/2)' },
                y: { signal: 'radius + (radius + 12) * sin((datum.index/length(data("categories"))) * 2 * PI - PI/2)' },
                align: { value: 'center' },
                baseline: { value: 'middle' },
                text: { field: 'category' },
                fill: { value: '#333' },
              },
            },
          },
        ],
      },
      // series areas
      {
        type: 'group',
        from: { facet: { data: 'series', groupby: 'id' } },
        marks: [
          {
            type: 'line',
            from: { data: 'series' },
            encode: {
              enter: {
                x: { field: 'x' },
                y: { field: 'y' },
                stroke: { scale: 'color', field: 'id' },
                strokeWidth: { value: 2 },
              },
              update: {
                interpolate: { value: 'linear-closed' },
              },
            },
          },
          {
            type: 'area',
            from: { data: 'series' },
            encode: {
              enter: {
                x: { field: 'x' },
                y: { field: 'y' },
                fill: { scale: 'color', field: 'id' },
                fillOpacity: { value: 0.15 },
              },
              update: {
                interpolate: { value: 'linear-closed' },
              },
            },
          },
          {
            type: 'symbol',
            from: { data: 'series' },
            encode: {
              enter: {
                x: { field: 'x' },
                y: { field: 'y' },
                size: { value: 30 },
                fill: { scale: 'color', field: 'id' },
              },
            },
          },
        ],
        scales: [
          {
            name: 'color',
            type: 'ordinal',
            domain: ['A', 'B'],
            range: ['#36a2eb', '#ff9f40'],
          },
        ],
      },
    ],
  }));
}


