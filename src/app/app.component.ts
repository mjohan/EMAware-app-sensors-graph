import { Component, OnInit } from '@angular/core';
import { GraphEventService } from "./services/graph-event.service";
import { DatabankService } from "./services/databank.service";

import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private emotions = [
    { index: 0, map: 'excitement', name: 'Engagement' },
    { index: 1, map: 'boredom', name: 'Boredom' },
    { index: 2, map: 'angriness', name: 'Frustration' },
    { index: 3, map: 'stress', name: 'Confusion' }
  ];

  selected = { emotion: this.emotions[0].index};
  lastSelected = null;

  constructor(private graphEventService: GraphEventService, private databankService: DatabankService) { }

  updateEmotionGraph(): void {
    this.graphEventService.load(true);

    this.databankService.retrieveEmotionValues('5893fb6250fe308549853203', this.emotions[this.selected.emotion].map, 0, new Date().getTime()).then(
      sensordata => {
        if (this.lastSelected != null) this.graphEventService.remove(this.emotions[this.lastSelected].name);

        this.graphEventService.add({
          name: this.emotions[this.selected.emotion].name,
          type: 'line',
          data: _.map(sensordata, function(e) {
            return [ e.timestamp, e.value ];
          }),
          yAxis: 1
        });

        this.lastSelected = this.selected.emotion;

        this.graphEventService.load(false);
      }
    );
  }

  ngOnInit() {
    setTimeout(() => this.updateEmotionGraph(), 1000);
  }
}
