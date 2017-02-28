import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dashboard-side-radio',
  templateUrl: './dashboard-side-radio.component.html',
  styleUrls: ['./dashboard-side-radio.component.css']
})
export class DashboardSideRadioComponent implements OnInit {
  private selectedItem = "";

  @Input() options;
  @Input() selected;
  @Input() key;
  @Input() title;

  @Output() selectedItemChanged = new EventEmitter();
  @Output() selectedItemOptionChanged = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  optionRadioChanged() {
    if (this.options[this.selected[this.key]].selectItems.length > 0) this.selectedItem = this.options[this.selected[this.key]].selectItems[0].value;
    this.selectedItemChanged.emit();
  }

  onSelectChange(newValue) {
    this.selectedItemOptionChanged.emit(newValue);
  }

}
