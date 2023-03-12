import { Injectable } from '@angular/core';


/**
 * 記録の発生イベント
 * 記録の開始 -- 'START'
 * 記録の終了 -- 'END'
 */
export type Event = 'START' | 'END';

/**
 * レコード
 * ボタンが押されるごとに発生する
 */
export interface Record {
  kind: string; // 記録の種別
  event: Event; // 記録の発生イベント
  time: number; // 記録発生時刻
}

/**
 * 記録種別ごとの合計時間
 */
interface Total {
  time: number; // 合計時間
  lastTime: number; // 直前の記録発生時刻
}

@Injectable({
  providedIn: 'root'
})
export class RecorderService {

  constructor() { }

  private records = new Array<Record>();
  private total = new Map<string, Total>();

  /**
   * イベントを記録する
   * @param {Record} data - 記録
   */
  public record(data: Record): void {
    // 記録を追加
    this.records.push(data);

    // イベント種別に対応する現在の合計時間を取得する
    let total = this.total.get(data.kind);
    if (!total) {
      // 合計時間の記録がない場合、空の合計時間を作成する
      total = {
        time: 0,
        lastTime: 0
      };
    }

    // イベントに応じて合計時間を計算する
    switch (data.event) {
      case 'START':
        total.lastTime = data.time;
        break;

      case 'END':
        const time = data.time - total.lastTime;
        total.time = total.time + time;
        total.lastTime = NaN;
        break;

      default:
        throw new Error('未定義のイベント');
    }

    // 合計時間を更新
    this.total.set(data.kind, total);
  }

  /**
   * 指定した種別の現在の合計時間を返す
   * @param {string} kind - 種別
   * @returns {number} 合計時間
   */
  public getTotal(kind: string): number {
    if (!this.total.has(kind)) {
      console.error(`${kind} は登録されていません`);
    }
    return this.total.get(kind)?.time || 0;
  }

  /**
   * すべての種別の現在の合計時間を返す
   * @returns {Map<string, {time:number}} 全種別の合計時間
   */
  public getAllTotal(): Map<string, { time: number }> {
    const all = new Map<string, { time: number }>();
    for (const [kind, total] of this.total) {
      all.set(kind, { time: total.time });
    }
    return all;
  }

  /**
   * csvフォーマットで書き出す
   * @returns {URL|undefined} csvデータのURL
   */
  public export2csv(): URL | undefined {
    if (this.records.length === 0) {
      return;
    }

    // カンマ区切りのCSVに変換する
    const csv = json2csv(this.records, ',');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    return new URL(window.URL.createObjectURL(blob));
  }
}

/**
 * オブジェクトをcsvフォーマットされた文字列に変換する
 * @param {Array<Record>} json - jsonに変換可能なオブジェクト
 * @param delimiter - 区切り文字
 * @returns {string} csvフォーマットされた文字列
 */
function json2csv(json: Array<Record>, delimiter: ',' | '\t'): string {
  const header = Object.keys(json[0]).join(delimiter) + '\n';
  const body = json.map((d: any) => {
    return Object.keys(d).map((key: string) => {
      return d[key];
    }).join(delimiter);
  }).join('\n');
  return header + body;
}