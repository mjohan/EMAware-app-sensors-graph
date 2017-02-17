import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ChartModule } from 'angular2-highcharts';

import { AppComponent } from './app.component';
import { SensorChartComponent } from './sensor-chart/sensor-chart.component';

import { GraphEventService } from './services/graph-event.service';
import { DatabankService } from './services/databank.service';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';
import { DashboardSideRadioComponent } from './dashboard-page/dashboard-side-radio/dashboard-side-radio.component';
import { DashboardSideFilterComponent } from './dashboard-page/dashboard-side-filter/dashboard-side-filter.component';

const Highcharts = require('highcharts');
Highcharts.setOptions({
  global: { useUTC : true, timezoneOffset: new Date().getTimezoneOffset() }
});

@NgModule({
  declarations: [
    AppComponent,
    SensorChartComponent,
    DashboardPageComponent,
    DashboardSideRadioComponent,
    DashboardSideFilterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartModule.forRoot(Highcharts)
  ],
  providers: [
    DatabankService,
    GraphEventService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
