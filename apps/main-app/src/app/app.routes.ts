import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'vega/bar' },
  {
    path: 'render',
    children: [
      {
        path: 'vega',
        loadComponent: () =>
          import('./examples/render-vega-from-json').then((m) => m.RenderVegaFromJsonPageComponent),
        title: 'Render Vega from JSON',
      },
      {
        path: 'chartjs',
        loadComponent: () =>
          import('./examples/render-chartjs-from-json').then((m) => m.RenderChartJsFromJsonPageComponent),
        title: 'Render Chart.js from JSON',
      },
      { path: '', pathMatch: 'full', redirectTo: 'vega' },
    ],
  },
  {
    path: 'vega',
    children: [
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
      {
        path: 'pie',
        loadComponent: () =>
          import('./examples/vega-pie-demo').then((m) => m.VegaPieDemoComponent),
        title: 'Vega Pie Chart',
      },
      {
        path: 'radar',
        loadComponent: () =>
          import('./examples/vega-radar-demo').then((m) => m.VegaRadarDemoComponent),
        title: 'Vega Radar Chart',
      },
      { path: '', pathMatch: 'full', redirectTo: 'bar' },
    ],
  },
  {
    path: 'chartjs',
    children: [
      {
        path: 'bar',
        loadComponent: () =>
          import('./examples/chartjs-bar-demo').then((m) => m.ChartJsBarDemoComponent),
        title: 'Chart.js Bar Chart',
      },
      {
        path: 'line',
        loadComponent: () =>
          import('./examples/chartjs-line-demo').then((m) => m.ChartJsLineDemoComponent),
        title: 'Chart.js Line Chart',
      },
      {
        path: 'pie',
        loadComponent: () =>
          import('./examples/chartjs-pie-demo').then((m) => m.ChartJsPieDemoComponent),
        title: 'Chart.js Pie Chart',
      },
      {
        path: 'scatter',
        loadComponent: () =>
          import('./examples/chartjs-scatter-demo').then((m) => m.ChartJsScatterDemoComponent),
        title: 'Chart.js Scatter Chart',
      },
      {
        path: 'radar',
        loadComponent: () =>
          import('./examples/chartjs-radar-demo').then((m) => m.ChartJsRadarDemoComponent),
        title: 'Chart.js Radar Chart',
      },
      { path: '', pathMatch: 'full', redirectTo: 'bar' },
    ],
  },
  { path: '**', redirectTo: 'vega/bar' },
];
