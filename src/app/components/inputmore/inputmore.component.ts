import { Component, Input } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';

export interface Name {
  name: string;
}

@Component({
  selector: 'app-inputmore',
  templateUrl: './inputmore.component.html',
  styleUrls: ['./inputmore.component.css']
})
export class InputmoreComponent {
  @Input() label!: string;
  @Input() placeholder!: string;

  constructor() { }

  readonly addOnBlur: boolean = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  names = new Array<Name>();

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.names.push({ name: value });
    }
    event.chipInput!.clear();
  }

  remove(name: Name): void {
    const index = this.names.indexOf(name);
    if (index !== -1) {
      this.names.splice(index, 1);
    }
  }

  edit(name: Name, event: MatChipEditedEvent): void {
    const value = event.value.trim();
    if (!value) {
      this.remove(name);
    } else {
      const index = this.names.indexOf(name);
      if (index !== -1) {
        this.names[index].name = value;
      }
    }
  }
}
