import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ChartModule } from 'angular2-highcharts';

import { AppComponent } from './app.component';
import { SensorChartComponent } from './sensor-chart/sensor-chart.component';

import { GraphEventService } from './services/graph-event.service';
import { DatabankService } from './services/databank.service';

@NgModule({
  declarations: [
    AppComponent,
    SensorChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartModule
  ],
  providers: [
    DatabankService,
    GraphEventService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
