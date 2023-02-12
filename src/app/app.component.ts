import { Component } from '@angular/core';
import { ClickButtonset } from './components/buttonset/buttonset.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mierukun';
  textValue: string ='';

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
  }

  // Meet への誘導リンク
  openPage() {
    console.log(this.textValue);
    window.open(this.textValue, '_blank');
    // https://meet.google.com/tic-rwto-npo
  }

}
