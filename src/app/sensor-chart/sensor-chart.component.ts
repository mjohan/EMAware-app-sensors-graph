import { Component, OnInit } from '@angular/core';

import { ChartModule } from 'angular2-highcharts';

@Component({
  selector: 'sensor-chart',
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.css']
})
export class SensorChartComponent implements OnInit {

  options: Object;

  constructor() {
    this.options = {
      title: { text: 'Dummy Chart' },
      chart: { zoomType: 'x'},
      plotOptions: { series: { showInNavigator: true } },
      xAxis: { type: 'datetime' },
      rangeSelector: { selected: 4 },
      series: [{ 
        name: 'Sensor A', 
        data: [
          [1486664737234, 23.21], 
          [1486664837234, 54.12], 
          [1486664937234, 76.12], 
          [1486665037234, 12.23], 
          [1486665137234, 43.12], 
          [1486665237234, 23.21], 
          [1486665337234, 54.12], 
          [1486665437234, 76.12], 
          [1486665537234, 12.23], 
          [1486665637234, 43.12]
        ] 
      }]
    };
  }

  ngOnInit() {
  }

}
