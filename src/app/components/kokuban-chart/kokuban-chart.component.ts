import { Component, Input, OnInit } from '@angular/core';

declare const google: any;

@Component({
  selector: 'app-kokuban-chart',
  templateUrl: './kokuban-chart.component.html',
  styleUrls: ['./kokuban-chart.component.css']
})
export class KokubanChartComponent implements OnInit {

  ngOnInit(): void {
    try {
      google.charts.load('current', {
        packages: ['treemap'],
        language: 'ja'
      });
      google.charts.setOnLoadCallback(drawChart);
    } catch (error) {
      throw new Error('https://www.gstatic.com/charts/loader.js が読み込まれていません');
    }
  }
}

function drawChart() {
  let color = 0;
  let data = google.visualization.arrayToDataTable([
    ['Location', 'Parent', 'Market trade volume (size)', 'Market increase/decrease (color)'],
    ['Global', null, 0, color++],
    ['America', 'Global', 0, color++],
    ['Europe', 'Global', 0, color++],
    ['Asia', 'Global', 0, color++],
    ['Australia', 'Global', 0, color++],
    ['Africa', 'Global', 0, color++],
    ['Brazil', 'Global', 11, color++],
    ['USA', 'Global', 52, color++],
    ['Mexico', 'Global', 24, color++],
    ['Canada', 'Global', 16, color++],
    ['France', 'Global', 42, color++],
    ['Germany', 'Global', 31, color++],
    ['Sweden', 'Global', 22, color++],
    ['Italy', 'Global', 17, color++],
    ['UK', 'Global', 21, color++],
    ['China', 'Global', 36, color++],
    ['Japan', 'Global', 20, color++],
    ['India', 'Global', 40, color++],
    ['Laos', 'Global', 4, color++],
    ['Mongolia', 'Global', 1, color++],
    ['Israel', 'Global', 12, color++],
    ['Iran', 'Global', 18, color++],
    ['Pakistan', 'Global', 11, color++],
    ['Egypt', 'Global', 21, color++],
    ['S. Africa', 'Global', 30, color++],
    ['Sudan', 'Global', 12, color++],
    ['Congo', 'Global', 10, color++],
    ['Zaire', 'Global', 8, color++]
  ]);

  const tree = new google.visualization.TreeMap(document.getElementById('chart-aria'));

  tree.draw(data, {
    minColor: '#f00',
    midColor: '#ddd',
    maxColor: '#00f',
    headerHeight: 15,
    fontColor: 'black',
    showScale: true
  });
}
