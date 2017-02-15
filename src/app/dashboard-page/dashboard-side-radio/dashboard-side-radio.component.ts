import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dashboard-side-radio',
  templateUrl: './dashboard-side-radio.component.html',
  styleUrls: ['./dashboard-side-radio.component.css']
})
export class DashboardSideRadioComponent implements OnInit {

  @Input() options;
  @Input() selected;
  @Input() key;
  @Input() title;

  @Output() selectedItemChanged = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  optionRadioChanged() {
    this.selectedItemChanged.emit();
  }

}
