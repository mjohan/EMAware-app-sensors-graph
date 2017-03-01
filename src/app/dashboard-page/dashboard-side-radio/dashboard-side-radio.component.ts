import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dashboard-side-radio',
  templateUrl: './dashboard-side-radio.component.html',
  styleUrls: ['./dashboard-side-radio.component.css']
})
export class DashboardSideRadioComponent implements OnInit {
  private selectedItem = 0;

  @Input() options;
  @Input() selected;
  @Input() key;
  @Input() title;

  @Output() selectedItemChanged = new EventEmitter();
  @Output() selectedItemOptionChanged = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  optionRadioChanged() {
    if (this.options[this.selected[this.key]].selectItems.length > 0) this.selectedItem = 0;
    this.selectedItemChanged.emit();
  }

  onSelectChange(index) {
    let selectedFilter = this.options[this.selected[this.key]].selectItems[index].value;
    this.selectedItemOptionChanged.emit(selectedFilter);
  }

}
