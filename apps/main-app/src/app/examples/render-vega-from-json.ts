import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { VegaChartComponent } from '../components/vega-chart/vega-chart.component';
import type { TopLevelSpec } from 'vega-lite';

@Component({
  selector: 'app-render-vega-from-json',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VegaChartComponent],
  template: `
    <section style="width: 100%; height: 420px;">
      @if (loading()) {
        <div>Loading Vega-Lite chart…</div>
      } @else if (error()) {
        <pre style="white-space: pre-wrap; color: #b00020;">{{ error() }}</pre>
      } @else if (spec()) {
        <app-vega-chart [spec]="spec()"></app-vega-chart>
      } @else {
        <div>No spec to render.</div>
      }
    </section>
  `,
})
export class RenderVegaFromJsonPageComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly spec = signal<TopLevelSpec | null>(null);

  constructor() {
    effect(() => {
      const qp = this.route.snapshot.queryParamMap;
      const src = qp.get('src');

      if (!src) {
        this.loading.set(false);
        this.error.set('Missing query parameter: src');
        this.spec.set(null);
        return;
      }

      this.loading.set(true);
      this.error.set(null);
      this.spec.set(null);

      this.http.get(src, { responseType: 'json' }).subscribe({
        next: (body: unknown) => {
          try {
            if (isVegaLiteSpec(body)) {
              this.spec.set(body);
            } else {
              throw new Error('Provided JSON is not a valid Vega-Lite spec');
            }
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

function isVegaLiteSpec(obj: unknown): obj is TopLevelSpec {
  if (typeof obj !== 'object' || obj === null) return false;
  const anyObj = obj as Record<string, unknown>;
  const hasSchema = typeof anyObj['$schema'] === 'string' && /vega/i.test(String(anyObj['$schema']));
  const hasMark = 'mark' in anyObj;
  const hasEncoding = 'encoding' in anyObj;
  return hasSchema || (hasMark && hasEncoding);
}


