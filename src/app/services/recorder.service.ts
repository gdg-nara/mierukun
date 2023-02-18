import { Injectable } from '@angular/core';

// export interface Record {
//   kind: string;
//   event: string;
//   time: number;
// }

@Injectable({
  providedIn: 'root'
})
export class RecorderService {

  constructor() { }

  private records = new Array<any>();

  /**
   * record
   */
  public record(data: any): void {
    this.records.push(data);
  }

  /**
   * export2csv
   */
  public export2csv(): any {
    const csv = json2csv(this.records, ',');
    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });
    return window.URL.createObjectURL(blob);
  }
}

function json2csv(json: Array<any>, delimiter: ',' | '\t') {
  const header = Object.keys(json[0]).join(delimiter) + '\n';
  const body = json.map((d: any) => {
    return Object.keys(d).map((key: string) => {
      return d[key];
    }).join(delimiter);
  }).join('\n');
  return header + body;
}