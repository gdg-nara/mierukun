import { Component } from '@angular/core';
import { ClickButtonset } from './components/buttonset/buttonset.component';
import { RecorderService } from './services/recorder.service';

export const SEARCHPARAM_KEY_BUTTON = 'b';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private recorder: RecorderService
  ) {
    const url = new URL(document.location.href);
    if (url.searchParams.has(SEARCHPARAM_KEY_BUTTON)) {
      const buttons = url.searchParams.getAll(SEARCHPARAM_KEY_BUTTON);
      this.buttonset = buttons;
    }
  }

  title = 'mierukun';
  textValue: string = '';

  treeData = new Map<string, number>();

  // app-buttonset コンポーネントへの入力
  // ボタンの文字列の配列
  public buttonset: string[] = [
    '一斉学習',
    '個別学習',
    '協働学習'
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
