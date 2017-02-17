import { Component, OnInit } from '@angular/core';

import { GraphOption } from "../classes/graph-option";
import { Datapoint } from "../classes/datapoint";
import { GraphEventService } from "../services/graph-event.service";
import { DatabankService } from "../services/databank.service";

import * as _ from 'lodash';

@Component({
  selector: 'dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.css']
})
export class DashboardPageComponent implements OnInit {

  private today = new Date();

  private emotions = [
    { index: 0, map: 'excitement', name: 'Engagement' },
    { index: 1, map: 'boredom', name: 'Boredom' },
    { index: 2, map: 'angriness', name: 'Frustration' },
    { index: 3, map: 'stress', name: 'Confusion' }
  ];

  private sensors = [
    { index: 0, map: 'rrInterval', name: 'RR interval' },
    { index: 1, map: 'gsr', name: 'Skin conductance' },
    { index: 2, map: 'accelerometer', name: 'Accelerometer' }
  ];

  private selected = { 
    emotion: this.emotions[0].index, 
    sensor: this.sensors[0].index, 
    username: '',
    dateRange: {
      beginDate: { year: this.today.getFullYear(), month: this.today.getMonth(), day: this.today.getDate() - 1 },
      endDate: { year: this.today.getFullYear(), month: this.today.getMonth(), day: this.today.getDate() }
    }
  };
  private lastSelected = { emotion: null, sensor: null, userId: '' };

  constructor(private graphEventService: GraphEventService, private databankService: DatabankService) { }

  private getGraphDate() {
    let beginDate = this.selected.dateRange.beginDate;
    let endDate = this.selected.dateRange.endDate;

    return {
      start: new Date(beginDate.year, beginDate.month, beginDate.day, 0, 0, 0, 0).getTime(),
      end: new Date(endDate.year, endDate.month, endDate.day, 23, 59, 59, 999).getTime(),
    }
  }

  private prepareGraphSeries(data: Datapoint[], options: GraphOption[], key: string, seriesType: string, yAxis: number, color: string): void {
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
      color: color
    });

    this.lastSelected[key] = this.selected[key];
  }

  private reloadEmotionGraph(): void {
    if (this.lastSelected.userId.length > 0) {
      this.graphEventService.load(true);
      this.databankService.retrieveEmotionValues(this.lastSelected.userId, this.emotions[this.selected.emotion].map, this.getGraphDate().start, this.getGraphDate().end)
        .then(sensordata => {
          this.prepareGraphSeries(sensordata, this.emotions, 'emotion', 'scatter', 1, '#90ed7d');
          this.graphEventService.load(false);
        }
      );
    } else {
      console.log("userId is empty");
    }
  }

  private reloadSensorGraph(): void {
    if (this.lastSelected.userId.length > 0) {
      this.graphEventService.load(true);
      this.databankService.retrieveSensorValues(this.lastSelected.userId, this.sensors[this.selected.sensor].map, this.getGraphDate().start, this.getGraphDate().end)
        .then(sensordata => {
          this.prepareGraphSeries(sensordata, this.sensors, 'sensor', 'line', 0, '#db843d');
          this.graphEventService.load(false);
        }
      );
    } else {
      console.log("userId is empty");
    }
  }

  private searchData(): void {
    this.graphEventService.load(true);

    this.databankService.retrieveGraphUser(this.selected.username)
      .then(graphUser => {
        this.lastSelected.userId = graphUser.userId;

        let start = this.getGraphDate().start;
        let end = this.getGraphDate().end;
        let sensorFilter = this.sensors[this.selected.sensor].map;
        let emotionFilter = this.emotions[this.selected.emotion].map;

        this.databankService.retrieveSensorValues(graphUser.userId, sensorFilter, start, end)
          .then(sensorData => {
            this.databankService.retrieveEmotionValues(graphUser.userId, emotionFilter, start, end)
              .then(emotionData => {
                this.prepareGraphSeries(sensorData, this.sensors, 'sensor', 'line', 0, '#db843d');
                this.prepareGraphSeries(emotionData, this.emotions, 'emotion', 'scatter', 1, '#90ed7d');
                this.graphEventService.load(false);
              }
            );
          }
        );
      })
      .catch(error => console.log(error));
  }

  ngOnInit() { }
}
