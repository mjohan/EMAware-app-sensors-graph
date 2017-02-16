import { Component, OnInit } from '@angular/core';
import { GraphEventService } from "../services/graph-event.service";

@Component({
  selector: 'sensor-chart',
  templateUrl: './sensor-chart.component.html',
  styleUrls: ['./sensor-chart.component.css']
})
export class SensorChartComponent implements OnInit {

  options: Object;
  chart: any;

  constructor(private graphEventService: GraphEventService) {
    this.options = {
      chart: { zoomType: 'x', width: window.screen.width/2, height: 600 },
      plotOptions: { series: { showInNavigator: true } },
      xAxis: { type: 'datetime', minRange: 60000 },
      yAxis: [{ height: '50%' }, { min: 1, max: 5, height: '10%', top: '85%' }],
      rangeSelector: {
        buttons: [
          { type: 'minute', count: 5, text: '5m' },
          { type: 'minute', count: 10, text: '10m' },
          { type: 'minute', count: 30, text: '30m' },
          { type: 'hour', count: 1, text: '1h' },
          { type: 'all', text: 'All'}
        ],
        selected: 4
      },
    };

    this.graphEventService.graphSeriesAdded$.subscribe(series => this.chart.addSeries(series));
    this.graphEventService.graphSeriesRemoved$.subscribe(index => this.chart.series[index].remove());
    this.graphEventService.graphSeriesLoading$.subscribe(loading => {
      if (loading) this.chart.showLoading();
      else this.chart.hideLoading();
    });
  }

  ngOnInit() { }

  saveChart(chartObject: Object) {
    this.chart = chartObject;
  }

}
