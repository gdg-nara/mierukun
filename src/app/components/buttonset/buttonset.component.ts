import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { Event } from '../../services/recorder.service';


/** コンポーネント外部に送出するイベントの引数 */
export interface ClickButtonset {
  // ボタンの名前
  button: string;
  // イベント種別
  event: Event;
  // イベント発生時間 Date.now() の返値
  time: number;
}

@Component({
  selector: 'app-buttonset',
  templateUrl: './buttonset.component.html',
  styleUrls: ['./buttonset.component.css']
})
export class ButtonsetComponent implements OnDestroy {
  // コンポーネント外部から設定されるボタン名のリスト
  // コンポーネント内部で使用するためにMapに登録する
  @Input() set buttonset(buttonset: Array<string>) {
    for (const button of buttonset) {
      this.buttonsetState.set(button, {
        name: button,
        started: false
      });
    }
  }

  // ボタンを複数同時に有効化できるか
  @Input() multiple!: boolean;

  // ボタンが押されたときに発火するイベント
  @Output() clickButtonset = new EventEmitter<ClickButtonset>();

  // コンポーネント内部で使用するボタンの状態管理オブジェクト
  public buttonsetState = new Map<string, ButtonState>();


  ngOnDestroy(): void {
    const now = Date.now();
    for (const [name, state] of this.buttonsetState) {
      if (state.started) {
        state.started = false;

        this.clickButtonset.emit({
          button: name,
          event: 'END',
          time: now
        });
      }
    }
  }

  /**
   * ボタンの名前を配列で返す
   * @returns {Array<string>} ボタンの名前リスト
   */
  public get buttonNames(): Array<string> {
    return Array.from(this.buttonsetState.keys());
  }

  /**
   * ボタンがクリックされたときに呼び出されるイベントハンドラ
   * @param {UIEvent} event - DOMのイベントオブジェクト
   * @param {string} button - クリックされたボタンの名前 
   */
  public onClickButton(event: UIEvent, button: string): void {
    // 現在時刻
    const now = Date.now();

    // 同時に複数のボタンを有効化できない設定の場合、有効化されたボタンを終了する
    if (!this.multiple) {
      for (const [name, state] of this.buttonsetState) {
        // クリックされたボタン以外で開始しているボタンを終了
        if (button !== name && state.started) {
          state.started = false;

          this.clickButtonset.emit({
            button: name,
            event: 'END',
            time: now
          });
        }
      }
    }

    // ボタンの状態管理オブジェクトを取得
    let buttonState: ButtonState | undefined = this.buttonsetState.get(button);

    if (!buttonState) {
      throw new Error('未登録のボタンがクリックされた');
    } else {
      // 状態管理オブジェクトがある場合
      // ボタンの状態を反転
      buttonState.started = !buttonState.started;

      this.clickButtonset.emit({
        button: buttonState.name,
        event: buttonState.started ? 'START' : 'END',
        time: now
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
}
