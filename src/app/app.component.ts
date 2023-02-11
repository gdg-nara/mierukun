import { Component } from '@angular/core';
import { ClickButtonset } from './components/buttonset/buttonset.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mierukun';

  // app-buttonset コンポーネントへの入力
  // ボタンの文字列の配列
  public buttonset: string[] = [
    '先生が話す',
    '子どもが話す',
  ];

  /**
   * ボタンがクリックされたときに呼び出されるイベントハンドラ 
   * @param event: ClickButtonset クリックされたボタンの情報
   */
  public onClickButtonset(event: ClickButtonset): void {
    console.debug(event);
  }
}
