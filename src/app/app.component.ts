import { Component, HostListener, OnInit } from '@angular/core';
import { ClickButtonset } from './components/buttonset/buttonset.component';
import { TreeDataColumn, TreeDataRow } from './components/kokuban-chart/kokuban-chart.component';
import { RecorderService } from './services/recorder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private recorder: RecorderService
  ) { }

  @HostListener('window:blur', ['$event'])
  onBlur(event: FocusEvent) {
    event.preventDefault();
  }

  title = 'mierukun';
  textValue: string = '';

  header!: TreeDataColumn[];
  body!: TreeDataRow[];

  ngOnInit() {
  }

  // app-buttonset コンポーネントへの入力
  // ボタンの文字列の配列
  public buttonset: string[] = [
    '先生の説明',
    '先生←→全体',
    '生徒個別活動',
    '生徒共同作業',
    '生徒ペア (近隣) 活動',
    '生徒グループ活動'
  ];

  /**
   * ボタンがクリックされたときに呼び出されるイベントハンドラ 
   * @param event: ClickButtonset クリックされたボタンの情報
   */
  public onClickButtonset(event: ClickButtonset): void {
    console.debug(event);
    this.recorder.record({
      kind: event.button,
      event: event.event,
      time: event.time
    });

    const total = this.recorder.getTotal(event.button) || 0;
    this.body = [{
      label: event.button,
      num: total
    }];
  }

  // Meet への誘導リンク
  openPage() {
    console.log(this.textValue);
    window.open(this.textValue, '_blank');
    // https://meet.google.com/tic-rwto-npo
  }

  createReport() {
    const url = this.recorder.export2csv();
    if (!url) {
      console.warn('出力すべきデータがありません。');
    } else {
      const link = document.createElement('a');
      link.download = new Date().toTimeString();
      link.href = url.href;
      link.click();
    }
  }
}
