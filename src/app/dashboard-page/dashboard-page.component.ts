import { Component, OnInit } from '@angular/core';

import { GraphOption } from "../classes/graph-option";
import { Datapoint } from "../classes/datapoint";
import { FilterOption } from '../classes/filter-option'
import { GraphEventService } from "../services/graph-event.service";
import { DatabankService } from "../services/databank.service";
import { RescuetimeService } from "../services/rescuetime.service";

import * as _ from 'lodash';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  private today = new Date();
  private error = { message: '' };

  private emotions = [
    { index: 0, map: { type: 'emotion', value: 'excitement' }, name: 'Engagement', selectItems: [] },
    { index: 1, map: { type: 'emotion', value: 'boredom' }, name: 'Boredom', selectItems: [] },
    { index: 2, map: { type: 'emotion', value: 'angriness' }, name: 'Frustration', selectItems: [] },
    { index: 3, map: { type: 'emotion', value: 'stress' }, name: 'Confusion', selectItems: [] }
  ];

  private sensors = [
    { index: 0, map: { type: 'sensor', value: 'rrInterval' }, name: 'RR interval', selectItems: [] },
    { index: 1, map: { type: 'sensor', value: 'gsr' }, name: 'Skin conductance', selectItems: [] },
    { index: 2, map: { type: 'sensor', value: 'accelerometer' }, name: 'Accelerometer', selectItems: [] }
  ];

  private rtOptions = [
    { index: 0, map: RescuetimeService.FILTER.TASK, name: 'Activities number', selectItems: [] },
    { index: 1, map: RescuetimeService.FILTER.PRODUCTIVITY, name: 'Productivity level', selectItems: [] },
    { index: 2, map: RescuetimeService.FILTER.EMAIL, name: 'Specific activity', selectItems: [
      { name: "Email duration", value: RescuetimeService.FILTER.EMAIL },
      { name: "Online chat duration", value: RescuetimeService.FILTER.CHAT }] 
    },
    { index: 3, map: RescuetimeService.FILTER.SOCMED, name: 'Specific category', selectItems: [
      { name: "Social networking", value: RescuetimeService.FILTER.SOCMED },
      { name: "Communication & scheduling", value: RescuetimeService.FILTER.COMMSCHED },
      { name: "News & Opinion", value: RescuetimeService.FILTER.NEWS },
      { name: "Business", value: RescuetimeService.FILTER.BUSINESS },
      { name: "Entertainment", value: RescuetimeService.FILTER.ENTERTAINMENT },
      { name: "Design & Composition", value: RescuetimeService.FILTER.DESIGN },
      { name: "Reference & Learning", value: RescuetimeService.FILTER.REFERENCE },
      { name: "Software Development", value: RescuetimeService.FILTER.DEVELOPMENT },
      { name: "Shopping", value: RescuetimeService.FILTER.SHOPPING },
      { name: "Utilities", value: RescuetimeService.FILTER.UTILITIES },
      { name: "Miscellaneous", value: RescuetimeService.FILTER.MISC },
      { name: "Uncategorized", value: RescuetimeService.FILTER.ETC }]
    }
  ];

  private selected = { 
    emotion: this.emotions[0].index, 
    sensor: this.sensors[0].index,
    rtOption: this.rtOptions[0].index,
    username: '',
    dateRange: {
      beginDate: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() - 1 },
      endDate: { year: this.today.getFullYear(), month: this.today.getMonth() + 1, day: this.today.getDate() }
    }
  };
  private lastSelected = { emotion: null, sensor: null, rtOption: null, userId: '', rtKey: '' };

  constructor(
    private graphEventService: GraphEventService,
    private databankService: DatabankService,
    private rescuetimeService: RescuetimeService) { }

  private getGraphDate() {
    let beginDate = this.selected.dateRange.beginDate;
    let endDate = this.selected.dateRange.endDate;

    return {
      start: new Date(beginDate.year, beginDate.month - 1, beginDate.day, 0, 0, 0, 0).getTime(),
      end: new Date(endDate.year, endDate.month - 1, endDate.day, 23, 59, 59, 999).getTime(),
    }
  }

  private rtDate() {
    let beginDate = this.selected.dateRange.beginDate;
    let endDate = this.selected.dateRange.endDate;

    return {
      start: beginDate.year + '-' + beginDate.month + '-' + beginDate.day,
      end: endDate.year + '-' + endDate.month + '-' + endDate.day
    }
  }

  private prepareGraphSeries(data: Datapoint[], options: GraphOption[], key: string, seriesType: string, yAxis: number, color: string, step: boolean): void {
    if (this.lastSelected[key] != null) {
      this.graphEventService.remove(options[this.lastSelected[key]].name);
    }

    this.graphEventService.add({
      name: options[this.selected[key]].name,
      type: seriesType,
      marker: { symbol: 'circle' },
      data: _.map(data, function(e: Datapoint) {
        return [ e.timestamp, e.value ];
      }),
      yAxis: yAxis,
      color: color,
      step: step
    });

    this.lastSelected[key] = this.selected[key];
  }

  private reloadEmotionGraph(): void {
    if (this.lastSelected.userId.length > 0) {
      this.graphEventService.load(true);
      this.databankService.retrieveEmotionValues(this.lastSelected.userId, this.emotions[this.selected.emotion].map.value, this.getGraphDate().start, this.getGraphDate().end)
        .then(sensordata => {
          this.prepareGraphSeries(sensordata, this.emotions, 'emotion', 'scatter', 2, '#db843d', false);
          this.graphEventService.load(false);
        }
      );
    } else {
      this.error.message = "Please search username first"
    }
  }

  private reloadRTGraph(option: FilterOption): void {
    let filter = (option)? option : this.rtOptions[this.selected.rtOption].map;

    if (this.lastSelected.rtKey.length > 0) {
      this.graphEventService.load(true);
      this.rescuetimeService.retrieveRescueTimeValues(this.lastSelected.rtKey, filter, this.rtDate().start, this.rtDate().end)
        .then(rtData => {
          this.prepareGraphSeries(rtData, this.rtOptions, 'rtOption', 'line', 1, '#ac5f20', true);
          this.graphEventService.load(false);
        }
      );
    } else {
      this.error.message = "Please search username first"
    }
  }

  private reloadSensorGraph(): void {
    if (this.lastSelected.userId.length > 0) {
      this.graphEventService.load(true);
      this.databankService.retrieveSensorValues(this.lastSelected.userId, this.sensors[this.selected.sensor].map.value, this.getGraphDate().start, this.getGraphDate().end)
        .then(sensordata => {
          this.prepareGraphSeries(sensordata, this.sensors, 'sensor', 'line', 0, '#db843d', false);
          this.graphEventService.load(false);
        }
      );
    } else {
      this.error.message = "Please search username first"
    }
  }

  private searchData(): void {
    this.graphEventService.load(true);

    this.databankService.retrieveGraphUser(this.selected.username)
      .then(graphUser => {
        this.error.message = '';
        this.lastSelected.userId = graphUser.userId;
        this.lastSelected.rtKey = graphUser.rtKey;

        let start = this.getGraphDate().start;
        let end = this.getGraphDate().end;
        let sensorFilter = this.sensors[this.selected.sensor].map.value;
        let emotionFilter = this.emotions[this.selected.emotion].map.value;
        let rtFilter = this.rtOptions[this.selected.rtOption].map;

        this.databankService.retrieveSensorValues(graphUser.userId, sensorFilter, start, end)
          .then(sensorData => {
            this.databankService.retrieveEmotionValues(graphUser.userId, emotionFilter, start, end)
              .then(emotionData => {
                this.rescuetimeService.retrieveRescueTimeValues(graphUser.rtKey, rtFilter, this.rtDate().start, this.rtDate().end)
                  .then(rtData => {
                    this.prepareGraphSeries(sensorData, this.sensors, 'sensor', 'line', 0, '#814718', false);
                    this.prepareGraphSeries(rtData, this.rtOptions, 'rtOption', 'line', 1, '#ac5f20', true);
                    this.prepareGraphSeries(emotionData, this.emotions, 'emotion', 'scatter', 2, '#db843d', false);
                    this.graphEventService.load(false);

                    this.error.message = (sensorData.length > 0 || emotionData.length > 0 || rtData.length > 0) ? '' : 'No data found in this time period';
                  }).catch(() => this.error.message = 'Problem occurred when fetching data from RescueTime');
              });
          });
      }).catch(error => { this.error.message = error.message; this.graphEventService.load(false); } );
  }

  ngOnInit() { }
}
