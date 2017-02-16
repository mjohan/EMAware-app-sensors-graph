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

  private static GRAPHS_NUMBER = 2;

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

  private selected = { emotion: this.emotions[0].index, sensor: this.sensors[0].index, username: '' };
  private lastSelected = { emotion: null, sensor: null };
  private numGraphsLoaded = 0;

  constructor(private graphEventService: GraphEventService, private databankService: DatabankService) { }

  private prepareGraphSeries(data: Datapoint[], options: GraphOption[], key: string, seriesType: string, yAxis: number): void {
    if (this.lastSelected[key] != null) {
      this.graphEventService.remove(options[this.lastSelected[key]].name);
      this.numGraphsLoaded--;
    }

    this.graphEventService.add({
      name: options[this.selected[key]].name,
      type: seriesType,
      marker: { symbol: 'circle' },
      data: _.map(data, function(e: Datapoint) {
        return [ e.timestamp, e.value ];
      }),
      yAxis: yAxis
    });

    this.lastSelected[key] = this.selected[key];

    this.numGraphsLoaded++;
  }

  updateEmotionGraph(): void {
    this.graphEventService.load(true);

    this.databankService.retrieveEmotionValues('58a3a96d407adb0142931ff0', this.emotions[this.selected.emotion].map, 0, new Date().getTime()).then(
      sensordata => {
        this.prepareGraphSeries(sensordata, this.emotions, 'emotion', 'scatter', 1);
        if (this.numGraphsLoaded == DashboardPageComponent.GRAPHS_NUMBER) this.graphEventService.load(false);
      }
    );
  }

  updateSensorGraph(): void {
    this.graphEventService.load(true);

    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 1);

    this.databankService.retrieveSensorValues('58a3a96d407adb0142931ff0', this.sensors[this.selected.sensor].map, startDate.getTime(), new Date().getTime()).then(
      sensordata => {
        this.prepareGraphSeries(sensordata, this.sensors, 'sensor', 'line', 0);
        if (this.numGraphsLoaded == DashboardPageComponent.GRAPHS_NUMBER) this.graphEventService.load(false);
      }
    );
  }

  searchUser(): void {
    this.databankService.retrieveGraphUser(this.selected.username).then(graphUser => console.log(graphUser));
  }

  ngOnInit() {
    setTimeout(() => {
      this.updateEmotionGraph();
      this.updateSensorGraph();
    }, 1000);
  }
}
