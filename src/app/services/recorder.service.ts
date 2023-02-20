import { Injectable } from '@angular/core';


export type Event = 'START' | 'END';

export interface Record {
  kind: string;
  event: Event;
  time: number;
}

interface Total {
  time: number;
  lastTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class RecorderService {

  constructor() { }

  private records = new Array<Record>();
  private total = new Map<string, Total>();

  /**
   * record
   */
  public record(data: Record): void {
    let total = this.total.get(data.kind);
    if (!total) {
      total = {
        time: 0,
        lastTime: 0
      };
    }

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
        throw new Error('未定義のイベントです。');
        break;
    }

    this.total.set(data.kind, total);

    this.records.push(data);
  }

  /**
   * getTotal
   */
  public getTotal(kind: string): number {
    if (!this.total.has(kind)) {
      console.error(`${kind} は登録されていません`);
    }
    return this.total.get(kind)?.time || 0;
  }

  /**
   * export2csv
   */
  public export2csv(): URL | undefined {
    if (this.records.length === 0) {
      return;
    }
    const csv = json2csv(this.records, ',');
    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });
    return new URL(window.URL.createObjectURL(blob));
  }
}

function json2csv(json: Array<Record>, delimiter: ',' | '\t'): string {
  const header = Object.keys(json[0]).join(delimiter) + '\n';
  const body = json.map((d: any) => {
    return Object.keys(d).map((key: string) => {
      return d[key];
    }).join(delimiter);
  }).join('\n');
  return header + body;
}