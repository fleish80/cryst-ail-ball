import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { VegaChartComponent } from '../components/vega-chart/vega-chart.component';
import { ChartJsChartComponent } from '../components/chartjs-chart/chartjs-chart.component';
import type { TopLevelSpec } from 'vega-lite';
import type { ChartConfiguration } from 'chart.js';

type EngineKind = 'vega' | 'chartjs';

interface EnvelopeVega {
  engine: 'vega' | 'vega-lite';
  spec: TopLevelSpec;
}

interface EnvelopeChartJs {
  engine: 'chartjs';
  config: ChartConfiguration;
}

type Envelope = EnvelopeVega | EnvelopeChartJs;

@Component({
  selector: 'app-render-from-json',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [VegaChartComponent, ChartJsChartComponent],
  template: `
    <section style="width: 100%; height: 420px;">
      @if (loading()) {
        <div>Loading chart…</div>
      } @else if (error()) {
        <pre style="white-space: pre-wrap; color: #b00020;">{{ error() }}</pre>
      } @else if (engine() === 'vega') {
        <app-vega-chart [spec]="vegaSpec()"></app-vega-chart>
      } @else if (engine() === 'chartjs') {
        <app-chartjs-chart [config]="chartJsConfig()"></app-chartjs-chart>
      } @else {
        <div>Unsupported or invalid chart spec.</div>
      }
    </section>
  `,
})
export class RenderFromJsonPageComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly engine = signal<EngineKind | null>(null);
  readonly vegaSpec = signal<TopLevelSpec | null>(null);
  readonly chartJsConfig = signal<ChartConfiguration | null>(null);

  constructor() {
    effect(() => {
      // Re-run when query params change
      const qp = this.route.snapshot.queryParamMap;
      const src = qp.get('src');
      const forcedEngine = normalizeEngine(qp.get('engine'));

      if (!src) {
        this.loading.set(false);
        this.error.set('Missing query parameter: src');
        this.engine.set(null);
        this.vegaSpec.set(null);
        this.chartJsConfig.set(null);
        return;
      }

      this.loading.set(true);
      this.error.set(null);
      this.engine.set(null);
      this.vegaSpec.set(null);
      this.chartJsConfig.set(null);

      this.http.get(src, { responseType: 'json' }).subscribe({
        next: (body: unknown) => {
          try {
            const parsed = coerceEnvelope(body);

            if (forcedEngine) {
              if (forcedEngine === 'vega' && parsed.kind === 'vega') {
                this.engine.set('vega');
                this.vegaSpec.set(parsed.spec);
              } else if (forcedEngine === 'chartjs' && parsed.kind === 'chartjs') {
                this.engine.set('chartjs');
                this.chartJsConfig.set(parsed.config);
              } else {
                throw new Error(`Engine mismatch: expected ${forcedEngine}`);
              }
            } else {
              if (parsed.kind === 'vega') {
                this.engine.set('vega');
                this.vegaSpec.set(parsed.spec);
              } else if (parsed.kind === 'chartjs') {
                this.engine.set('chartjs');
                this.chartJsConfig.set(parsed.config);
              } else {
                throw new Error('Unrecognized spec format');
              }
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

function normalizeEngine(value: string | null): EngineKind | null {
  const v = (value ?? '').toLowerCase();
  if (v === 'vega' || v === 'vega-lite' || v === 'vegalite') return 'vega';
  if (v === 'chartjs' || v === 'chart.js') return 'chartjs';
  return null;
}

function isVegaLiteSpec(obj: unknown): obj is TopLevelSpec {
  if (typeof obj !== 'object' || obj === null) return false;
  const anyObj = obj as Record<string, unknown>;
  const hasSchema = typeof anyObj['$schema'] === 'string' && /vega/i.test(String(anyObj['$schema']));
  const hasMarkEncoding = 'mark' in anyObj && 'encoding' in anyObj;
  return hasSchema || hasMarkEncoding;
}

function isChartJsConfig(obj: unknown): obj is ChartConfiguration {
  if (typeof obj !== 'object' || obj === null) return false;
  const anyObj = obj as Record<string, unknown>;
  const hasType = typeof anyObj['type'] === 'string';
  const data = anyObj['data'] as { datasets?: unknown } | undefined;
  const hasDatasetsArray = !!data && Array.isArray(data.datasets);
  return hasType && hasDatasetsArray;
}

function coerceEnvelope(input: unknown):
  | { kind: 'vega'; spec: TopLevelSpec }
  | { kind: 'chartjs'; config: ChartConfiguration } {
  // Envelope shape
  if (typeof input === 'object' && input !== null && 'engine' in (input as Record<string, unknown>)) {
    const env = input as Envelope;
    const eng = normalizeEngine((env as Envelope).engine as unknown as string);
    if (eng === 'vega' && (env as EnvelopeVega).spec && isVegaLiteSpec((env as EnvelopeVega).spec)) {
      return { kind: 'vega', spec: (env as EnvelopeVega).spec };
    }
    if (eng === 'chartjs' && (env as EnvelopeChartJs).config && isChartJsConfig((env as EnvelopeChartJs).config)) {
      return { kind: 'chartjs', config: (env as EnvelopeChartJs).config };
    }
  }

  // Raw spec: Vega-Lite or Chart.js
  if (isVegaLiteSpec(input)) {
    return { kind: 'vega', spec: input };
  }
  if (isChartJsConfig(input)) {
    return { kind: 'chartjs', config: input };
  }

  throw new Error('Unsupported JSON format for chart rendering');
}


