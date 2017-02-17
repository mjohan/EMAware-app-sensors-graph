import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'dashboard-side-filter',
  templateUrl: './dashboard-side-filter.component.html',
  styleUrls: ['./dashboard-side-filter.component.css']
})
export class DashboardSideFilterComponent implements OnInit {

  @Input() selected;

  @Output() searchButtonClicked = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  searchUser() {
    this.searchButtonClicked.emit();
  }
}
