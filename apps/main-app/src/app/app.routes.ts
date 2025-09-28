import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'bar' },
  {
    path: 'bar',
    loadComponent: () =>
      import('./examples/vega-bar-demo').then((m) => m.BarChartDemoComponent),
    title: 'Vega Bar Chart',
  },
  {
    path: 'line',
    loadComponent: () =>
      import('./examples/vega-line-demo').then((m) => m.LineChartDemoComponent),
    title: 'Vega Line Chart',
  },
  {
    path: 'scatter',
    loadComponent: () =>
      import('./examples/vega-scatter-demo').then((m) => m.ScatterChartDemoComponent),
    title: 'Vega Scatter Chart',
  },
  { path: '**', redirectTo: 'bar' },
];
