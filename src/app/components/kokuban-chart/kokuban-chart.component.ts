import { Component, HostListener, Input, OnInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-kokuban-chart',
  templateUrl: './kokuban-chart.component.html',
  styleUrls: ['./kokuban-chart.component.css']
})
export class KokubanChartComponent implements OnInit {
  private readonly chartaria = 'chart-aria';
  private dataTable!: Map<string, number>;
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
    try {
      google.charts.load('current', {
        packages: ['treemap'],
        language: 'ja'
      });
      google.charts.setOnLoadCallback(() => this.drawChart());
    } catch (error) {
      throw new Error('https://www.gstatic.com/charts/loader.js が読み込まれていません');
    }
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

  // window.resize イベントでグラフを再描画する
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: UIEvent): void {
    this.treeMap.draw(this.treeDataTable, this.treeMapOptions);
  }
}
