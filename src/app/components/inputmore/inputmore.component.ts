import { Component, EventEmitter, Input, Output } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-inputmore',
  templateUrl: './inputmore.component.html',
  styleUrls: ['./inputmore.component.css']
})
export class InputmoreComponent {
  // Input に表示するラベル
  @Input() label!: string;

  // Input に表示するプレイスホルダ
  @Input() placeholder!: string;

  // 入力済みの名前
  @Input() names!: Array<string>;

  // 入力値が変化したときに発行するイベント
  // 双方向バインディングに必要
  @Output() namesChange = new EventEmitter<string[]>();

  // Input からフォーカスが外れていてもイベント発行する
  readonly addOnBlur: boolean = true;

  // 入力値を区切るセパレータ
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  /**
   * 入力を処理してチップを追加する
   * すでに存在する値は登録しない
   * @param {MatChipInputEvent} event - イベントオブジェクト
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      if (!this.names.includes(value)) {
        this.names.push(value);
        this.namesChange.emit(Array.from(this.names));
      } else {
        console.info(`${value} はすでに登録されています。`);
      }
    }
    event.chipInput!.clear();
  }

  /**
   * チップを削除する 
   * @param {string} name - チップの名前
   */
  remove(name: string): void {
    const index = this.names.indexOf(name);
    if (index !== -1) {
      this.names.splice(index, 1);
      this.namesChange.emit(Array.from(this.names));
    }
  }

  /**
   * チップの値が編集されたときに呼び出されるイベントハンドラ
   * 編集後の値が重複している場合、編集結果を破棄する
   * @param name - チップの名前
   * @param {MatChipEditedEvent} event - イベントオブジェクト
   */
  edit(name: string, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.remove(name);
    } else {
      const index = this.names.indexOf(name);
      if (index !== -1) {
        if (!this.names.includes(value)) {
          this.names[index] = value;
          this.namesChange.emit(Array.from(this.names));
        } else {
          console.info(`${value} はすでに登録されています。`);
        }
      }
    }
  }

  /**
   * チップをドラッグアンドドロップしたときに呼び出されるイベントハンドラ
   * ドラッグアンドドロップ後の状態に並び替える
   * @param {CdkDragDrop<string[]>} event - イベントハンドラ
   */
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.names, event.previousIndex, event.currentIndex);
    this.namesChange.emit(Array.from(this.names));
  }
}
