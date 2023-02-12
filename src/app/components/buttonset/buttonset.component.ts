import { Component, EventEmitter, Input, Output } from '@angular/core';

/** イベント種別 */
export type ButtonEvent = 'START' | 'END';

/** コンポーネント外部に送出するイベントの引数 */
export interface ClickButtonset {
  // ボタンの名前
  button: string;
  // イベント種別
  event: ButtonEvent;
  // イベント発生時間 Date.now() の返値
  time: number;
}

@Component({
  selector: 'app-buttonset',
  templateUrl: './buttonset.component.html',
  styleUrls: ['./buttonset.component.css']
})
export class ButtonsetComponent {

  // ボタンに表示する文字列の配列
  // ボタンの識別にも使用する
  @Input() buttonset!: Array<string>;

  // ボタンを複数同時に有効化できるか
  @Input() multiple!: boolean;

  // ボタンが押されたときに発火するイベント
  @Output() clickButtonset = new EventEmitter<ClickButtonset>();

  // コンポーネント内部で使用するボタンの状態管理オブジェクト
  public buttonsetState = new Map<string, ButtonState>();

  /**
   * ボタンがクリックされたときに呼び出されるイベントハンドラ
   * @param {UIEvent} event - DOMのイベントオブジェクト
   * @param {string} button - クリックされたボタンの名前 
   */
  public onClickButton(event: UIEvent, button: string): void {
    // 同時に複数のボタンを有効化できない設定の場合、有効化されたボタンを終了する
    if (!this.multiple) {
      for (const [name, state] of this.buttonsetState) {
        // クリックされたボタン以外で開始しているボタンを終了
        if (button !== name && state.started) {
          state.started = false;

          this.clickButtonset.emit({
            button: name,
            event: 'END',
            time: Date.now()
          });
        }
      }
    }

    // ボタンの状態管理オブジェクトを取得
    let buttonState: ButtonState | undefined = this.buttonsetState.get(button);

    if (!buttonState) {
      // 状態管理オブジェクトがない場合
      // 初回のクリックとして扱う
      buttonState = {
        name: button,
        started: true,
        startTime: Date.now()
      };

      this.clickButtonset.emit({
        button: buttonState.name,
        event: 'START',
        time: buttonState.startTime
      });

      // 状態管理オブジェクトに登録する
      this.buttonsetState.set(button, buttonState);
    } else {
      // 状態管理オブジェクトがある場合
      // ボタンの状態を反転
      buttonState.started = !buttonState.started;

      this.clickButtonset.emit({
        button: buttonState.name,
        event: buttonState.started ? 'START' : 'END',
        time: Date.now()
      });
    }
  }
}

/** 状態管理オブジェクトのインターフェイス */
interface ButtonState {
  // ボタンの名前
  name: string;
  // ボタンが有効化しているか
  started: boolean;
  // 有効化した時間 Date.now() の返値
  startTime: number;
}
