import { Component, Input, OnInit } from '@angular/core';

declare const google: any;

interface TreeDataTable {
  columns: Array<TreeDataColumn>;
  rows: Array<TreeDataRow>;
}

export interface TreeDataColumn {
  type: string;
  label: string;
}

export interface TreeDataRow {
  label: string;
  num: number;
}

@Component({
  selector: 'app-kokuban-chart',
  templateUrl: './kokuban-chart.component.html',
  styleUrls: ['./kokuban-chart.component.css']
})
export class KokubanChartComponent implements OnInit {

  private treeDataTable: TreeDataTable = {
    columns: new Array<TreeDataColumn>(),
    rows: new Array<TreeDataRow>()
  };

  @Input() set columns(cols: Array<TreeDataColumn>) {
    this.treeDataTable.columns = cols;
  }

  @Input() set rows(rows: Array<TreeDataRow>) {
    this.treeDataTable.rows = rows;
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

  drawChart() {
    let color = 0;
    const dataArray: Array<any> = [
      ['kind', '授業', 'time', 'color']
    ];
    dataArray.push([
      'Global',
      null,
      0,
      color++
    ]);
    for (const row of this.treeDataTable.rows) {
      dataArray.push([
        row.label,
        'Global',
        row.num,
        color++
      ]);
    }
    console.log(dataArray);

    const dataTable = new google.visualization.arrayToDataTable(dataArray);

    const tree = new google.visualization.TreeMap(document.getElementById('chart-aria'));

    tree.draw(dataTable, {
      minColor: '#f00',
      midColor: '#ddd',
      maxColor: '#00f',
      headerHeight: 15,
      fontColor: 'black',
      showScale: true
    });
  }
}
