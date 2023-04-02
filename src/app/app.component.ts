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
    const url = new URL(document.location.href);
    if (url.searchParams.has(SEARCHPARAM_KEY_BUTTON)) {
      const buttons = url.searchParams.getAll(SEARCHPARAM_KEY_BUTTON);
      this.buttonset = buttons;
      this.selectedIndex = 1;
    }
  }

  title = 'mierukun';
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
   * @param {ClickButtonset } event - クリックされたボタンの情報
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
}
