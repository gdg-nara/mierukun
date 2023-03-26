import { Component } from '@angular/core';
import { ClickButtonset } from './components/buttonset/buttonset.component';
import { RecorderService } from './services/recorder.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private recorder: RecorderService
  ) { }

  title = 'mierukun';
  textValue: string = '';

  treeData = new Map<string, number>();

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
   * @param {ClickButtonset } event - クリックされたボタンの情報
   */
  public onClickButtonset(event: ClickButtonset): void {
    console.debug(event);
    this.recorder.record({
      kind: event.button,
      event: event.event,
      time: event.time
    });

    const total = this.recorder.getTotal(event.button);
    this.treeData.set(event.button, total);
  }
}
