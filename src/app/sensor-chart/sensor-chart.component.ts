import { Component, OnInit } from '@angular/core';
import { DatabankService } from "../databank.service";

@Component({
  selector: 'sensor-chart',
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.css']
})
export class SensorChartComponent implements OnInit {

  options: Object;

  constructor(private databankService: DatabankService) {
    this.options = {
      chart: { zoomType: 'x', width: window.screen.width/2, height: 450 },
      plotOptions: { series: { showInNavigator: true } },
      xAxis: { type: 'datetime' },
      rangeSelector: { selected: 0 },
      series: [{
        name: 'Sensor A',
        type: 'spline',
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
    this.databankService.retrieveEmotionValues('588fee9761dce3a47ec505b5', 'angriness', 1483189200000, 1486645199000).then(sensordata => console.log(sensordata))
    this.databankService.fetchEmotionData(1483189200000, 1486645199000).then(sensordata => console.log(sensordata))
  }

}
