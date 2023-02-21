import { Component, HostListener, Input, OnInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-kokuban-chart',
  templateUrl: './kokuban-chart.component.html',
  styleUrls: ['./kokuban-chart.component.css']
})
export class KokubanChartComponent implements OnInit {

  private treeDataTable = new Map<string, number>();

  @Input() set data(data: Map<string, number>) {
    if (data) {
      this.treeDataTable = data;
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
    if (this.treeDataTable.size > 0) {
      let color = Math.random();
      const dataArray: Array<any> = [
        ['Kind', 'Parent', 'Time', 'Color'],
        ['root', null, NaN, NaN]
      ];
      for (const [label, value] of this.treeDataTable) {
        dataArray.push([label, 'root', value, color++]);
      }
      const dataTable = new google.visualization.arrayToDataTable(dataArray);
      const tree = new google.visualization.TreeMap(document.getElementById('chart-aria'));

      tree.draw(dataTable, {
        enableHighlight: true,
        maxDepth: 1,
        maxPostDepth: 1,
        minHighlightColor: '#8c6bb1',
        midHighlightColor: '#9ebcda',
        maxHighlightColor: '#edf8fb',
        minColor: '#009688',
        midColor: '#f7f7f7',
        maxColor: '#ee8100',
        headerHeight: 0,
        showScale: false,
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
      });
    }
  }

  // window.resize イベントでグラフを再描画する
  @HostListener('window:resize', ['$event'])
  onWindowResize(event: UIEvent) {
    this.drawChart();
  }
}
