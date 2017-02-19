import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { IMyOptions, IMyDateRangeModel } from 'mydaterangepicker';

@Component({
  selector: 'dashboard-side-filter',
  templateUrl: './dashboard-side-filter.component.html',
  styleUrls: ['./dashboard-side-filter.component.css']
})
export class DashboardSideFilterComponent implements OnInit {

  private dateRangeOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    showClearDateRangeBtn: false,
    showClearBtn: false,
    acceptBtnTxt: 'Submit',
    minYear: 2016,
    maxYear: new Date().getFullYear(),
    editableDateRangeField: false,
    width: '100%'
  };

  @Input() selected;
  @Input() errorText;

  @Output() searchButtonClicked = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  searchUser() {
    this.searchButtonClicked.emit();
  }
}
