import { Component, OnInit } from '@angular/core';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ClickButtonset } from './components/buttonset/buttonset.component';
import { RecorderService } from './services/recorder.service';

export const SEARCHPARAM_KEY_BUTTON = 'b';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private recorder: RecorderService
  ) { }

  ngOnInit(): void {
    window.addEventListener('beforeunload', this.onBeforeunload);

    const url = new URL(document.location.href);
    if (url.searchParams.has(SEARCHPARAM_KEY_BUTTON)) {
      const buttons = url.searchParams.getAll(SEARCHPARAM_KEY_BUTTON);
      this.buttonset = buttons;
      this.selectedIndex = 1;
    }
  }

  title = '（仮）みえるくん';
  textValue: string = '';
  selectedIndex: number = 0;
  isButtonEditable: boolean = true;

  treeData = new Map<string, number>();

  // app-buttonset コンポーネントへの入力
  // ボタンの文字列の配列
  public buttonset: string[] = [
    '一斉学習',
    '個別学習',
    '協働学習'
  ];

  onSelectionChange(event: StepperSelectionEvent): void {
    const total = this.recorder.getAllTotal();
    this.treeData = total;
  }

  /**
   * ボタンがクリックされたときに呼び出されるイベントハンドラ 
   * @param {ClickButtonset} event - クリックされたボタンの情報
   */
  public onClickButtonset(event: ClickButtonset): void {
    console.debug(event);
    this.recorder.record({
      kind: event.button,
      event: event.event,
      time: event.time
    });

    this.isButtonEditable = false;
  }

  /**
   * リロードを抑制する
   * @see {@link https://developer.mozilla.org/ja/docs/Web/API/Window/beforeunload_event}
   * @param event - Window: beforeunload イベンドインターフェイス
   * @returns {string} 一部のブラウザが確認ダイアログで表示する文字列
   */
  private onBeforeunload(event: BeforeUnloadEvent): string {
    // this.updateMetadata(this.current.pack, this.current.deck, this.current.discard);
    const confirmationMessage = '';
    // Cancel the event as stated by the standard.
    event.preventDefault();
    // Chrome requires returnValue to be set.
    // Gecko + IE
    (event || window.event).returnValue = confirmationMessage;
    // Safari, Chrome, and other WebKit-derived browsers
    return confirmationMessage;
  }
}
