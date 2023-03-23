import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Inject, Injectable, LOCALE_ID, NgZone } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

declare const google: any;

@Component({
  selector: 'app-kokuban-chart',
  templateUrl: './kokuban-chart.component.html',
  styleUrls: ['./kokuban-chart.component.css']
})
export class KokubanChartComponent implements OnInit {
  constructor(
    private scriptLoader: ScriptLoaderService
  ) { }

  @ViewChild('chart_aria') chartAria!: ElementRef;

  private readonly chartaria = 'chart-aria';
  private dataTable = new Map<string, number>();
  private treeDataTable: any;
  private treeMap: any;
  private treeMapOptions = {
    enableHighlight: true,
    maxDepth: 1,
    maxPostDepth: 1,
    // minHighlightColor: '#8c6bb1',
    // midHighlightColor: '#9ebcda',
    // maxHighlightColor: '#edf8fb',
    hintOpacity: 0.1,
    maxColor: '#ee8100',
    minColor: '#009688',
    midColor: '#f7f7f7',
    headerHeight: 0,
    showScale: false,
    showTooltips: true,
    // height: 500,
    useWeightedAverageForAggregation: true,
    // Use click to highlight and double-click to drill down.
    eventsConfig: {
      highlight: ['click'],
      unhighlight: ['mouseout'],
      rollup: ['contextmenu'],
      drilldown: ['dblclick'],
    },
    generateTooltip: (row: any, size: any, value: any) => {
      return '';
    }
  };

  @Input() set data(data: Map<string, number>) {
    if (data) {
      this.dataTable = data;
    }
  }

  ngOnInit(): void {
    this.scriptLoader.loadChartPackages('treemap').subscribe(() => {
      this.drawChart();
    });
  }

  /**
   * onClickDownloadPNG
   */
  public async onClickDownloadPNG(event: UIEvent): Promise<void> {
    const a = document.createElement('a');
    a.href = await this.getPNGuri() || '';
    a.download = Date.now() + '.png';
    a.click();
  }

  private async getPNGuri(): Promise<string | null> {
    const svg = (this.chartAria.nativeElement as HTMLDivElement).querySelector('svg');
    if (svg) {
      return (await this.svg2png(svg)).href;
    }
    return null;
  }

  private drawChart(): void {
    if (this.dataTable.size > 0) {
      let color = Math.random();
      const dataArray: Array<any> = [
        ['Kind', 'Parent', 'Time', 'Color'],
        ['root', null, NaN, NaN]
      ];
      for (const [label, value] of this.dataTable) {
        dataArray.push([label, 'root', value, color++]);
      }
      this.treeDataTable = new google.visualization.arrayToDataTable(dataArray);
      this.treeMap = new google.visualization.TreeMap(document.getElementById(this.chartaria));

      this.treeMap.draw(this.treeDataTable, this.treeMapOptions);
    }
  }

  private svg2png(svg: SVGSVGElement): Promise<URL> {
    const data = new XMLSerializer().serializeToString(svg);
    const width = svg.width.baseVal.value;
    const height = svg.height.baseVal.value;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    return new Promise((resolve, reject) => {
      const image = new Image(width, height);
      image.onload = () => {
        context?.drawImage(image, 0, 0, width, height);
        resolve(new URL(canvas.toDataURL()));
      };
      image.onerror = (e) => {
        reject(e);
      };
      image.src = 'data:image/svg+xml;charset=utf-8;base64,' + utf8_to_b64(data);
    });
  }

  // window.resize イベントでグラフを再描画する
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: UIEvent): void {
    this.treeMap.draw(this.treeDataTable, this.treeMapOptions);
  }
}

function utf8_to_b64(str: string): string {
  return window.btoa(window.unescape(window.encodeURIComponent(str)));
}

function b64_to_utf8(str: string): string {
  return window.decodeURIComponent(window.escape(window.atob(str)));
}

/**
 * Google Charts Loader
 * @see {@link https://github.com/FERNman/angular-google-charts/blob/5743d00bd27607893b300bbd1ba61e7801abfe05/libs/angular-google-charts/src/lib/services/script-loader.service.ts}
 */
@Injectable({
  providedIn: 'root'
})
export class ScriptLoaderService {
  private readonly scriptSource = 'https://www.gstatic.com/charts/loader.js';
  private readonly scriptLoadSubject = new Subject<void>();

  constructor(
    private zone: NgZone,
    @Inject(LOCALE_ID) private localeId: string,
  ) { }

  /**
   * Checks whether `google.charts` is available.
   *
   * If not, it can be loaded by calling `loadChartPackages`.
   *
   * @returns `true` if `google.charts` is available, `false` otherwise.
   */
  public isGoogleChartsAvailable(): boolean {
    if (typeof google === 'undefined' || typeof google.charts === 'undefined') {
      return false;
    }

    return true;
  }

  /**
   * Loads the Google Chart script and the provided chart packages.
   * Can be called multiple times to load more packages.
   *
   * When called without any arguments, this will just load the default package
   * containing the namespaces `google.charts` and `google.visualization` without any charts.
   *
   * @param packages The packages to load.
   * @returns A stream emitting as soon as the chart packages are loaded.
   */
  public loadChartPackages(...packages: string[]): Observable<null> {
    return this.loadGoogleCharts().pipe(
      switchMap(() => {
        return new Observable<null>(observer => {
          const config = {
            packages,
            language: this.localeId,
          };

          google.charts.load('current', config);
          google.charts.setOnLoadCallback(() => {
            this.zone.run(() => {
              observer.next();
              observer.complete();
            });
          });
        });
      })
    );
  }

  /**
   * Loads the Google Charts script. After the script is loaded, `google.charts` is defined.
   *
   * @returns A stream emitting as soon as loading has completed.
   * If the google charts script is already loaded, the stream emits immediately.
   */
  private loadGoogleCharts(): Observable<void> {
    if (this.isGoogleChartsAvailable()) {
      return of(undefined);
    } else if (!this.isLoadingGoogleCharts()) {
      const script = this.createGoogleChartsScript();
      script.onload = () => {
        this.zone.run(() => {
          this.scriptLoadSubject.next();
          this.scriptLoadSubject.complete();
        });
      };

      script.onerror = () => {
        this.zone.run(() => {
          console.error('Failed to load the google charts script!');
          this.scriptLoadSubject.error(new Error('Failed to load the google charts script!'));
        });
      };
    }

    return this.scriptLoadSubject.asObservable();
  }

  private isLoadingGoogleCharts() {
    return this.getGoogleChartsScript() != null;
  }

  private getGoogleChartsScript(): HTMLScriptElement | undefined {
    const pageScripts = Array.from(document.getElementsByTagName('script'));
    return pageScripts.find(script => script.src === this.scriptSource);
  }

  private createGoogleChartsScript(): HTMLScriptElement {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.scriptSource;
    script.async = true;
    document.getElementsByTagName('head')[0].appendChild(script);
    return script;
  }
}
