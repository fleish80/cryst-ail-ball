import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { ChartJsChartComponent } from '../components/chartjs-chart/chartjs-chart.component';
import type { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-render-chartjs-from-json',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChartJsChartComponent],
  template: `
    <section style="width: 100%; height: 420px;">
      @if (loading()) {
        <div>Loading Chart.js chart…</div>
      } @else if (error()) {
        <pre style="white-space: pre-wrap; color: #b00020;">{{ error() }}</pre>
      } @else if (config()) {
        <app-chartjs-chart [config]="config()"></app-chartjs-chart>
      } @else {
        <div>No config to render.</div>
      }
    </section>
  `,
})
export class RenderChartJsFromJsonPageComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly config = signal<ChartConfiguration | null>(null);

  constructor() {
    effect(() => {
      const qp = this.route.snapshot.queryParamMap;
      const src = qp.get('src');

      if (!src) {
        this.loading.set(false);
        this.error.set('Missing query parameter: src');
        this.config.set(null);
        return;
      }

      this.loading.set(true);
      this.error.set(null);
      this.config.set(null);

      this.http.get(src, { responseType: 'json' }).subscribe({
        next: (body: unknown) => {
          try {
            const cfg = coerceChartJsConfig(body);
            this.config.set(cfg);
          } catch (e) {
            this.error.set((e as Error).message);
          } finally {
            this.loading.set(false);
          }
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(typeof err?.message === 'string' ? err.message : 'Failed to fetch JSON');
        },
      });
    });
  }
}

function coerceChartJsConfig(input: unknown): ChartConfiguration {
  if (isChartJsConfig(input)) return input;

  // Envelope style: { engine: 'chartjs', config: ChartConfiguration }
  if (typeof input === 'object' && input !== null && 'engine' in (input as Record<string, unknown>)) {
    const env = input as { engine?: unknown; config?: unknown };
    const eng = String(env.engine ?? '').toLowerCase();
    if ((eng === 'chartjs' || eng === 'chart.js') && isChartJsConfig(env.config)) {
      return env.config as ChartConfiguration;
    }
  }

  throw new Error('Provided JSON is not a valid Chart.js configuration');
}

function isChartJsConfig(obj: unknown): obj is ChartConfiguration {
  if (typeof obj !== 'object' || obj === null) return false;
  const anyObj = obj as Record<string, unknown>;
  const hasType = typeof anyObj['type'] === 'string';
  const data = anyObj['data'] as { datasets?: unknown } | undefined;
  const hasDatasetsArray = !!data && Array.isArray(data.datasets);
  return hasType && hasDatasetsArray;
}


