import { Component, EventEmitter, Input, Output } from '@angular/core';

// コンポーネント外部に送出するイベントの引数
export interface ClickButtonset {
  button: string;
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

  // ボタンが押されたときに発火するイベント
  @Output() clickButtonset: EventEmitter<ClickButtonset> = new EventEmitter();

  // コンポーネント内部で使用するボタンの状態管理オブジェクト
  public buttonsetState: any = {};

  // ボタンがクリックされたときに呼び出されるイベントハンドラ
  public onClickButton(event: UIEvent, button: string): void {
    // ボタンの状態管理オブジェクトを取得
    let buttonState: ButtonState | undefined = this.buttonsetState[button];

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
        time: buttonState.startTime
      });
    } else {
      // 状態管理オブジェクトがある場合
      // ボタンの状態を反転
      buttonState.started = !buttonState.started;
      this.clickButtonset.emit({
        button: buttonState.name,
        time: Date.now()
      });
    }
    // 状態管理オブジェクトに登録する
    this.buttonsetState[button] = buttonState;
  }
}

// 状態管理オブジェクトのインターフェイス
interface ButtonState {
  name: string;
  started: boolean;
  startTime: number;
}
