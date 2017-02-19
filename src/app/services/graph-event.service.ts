import { Injectable, EventEmitter } from '@angular/core';
import { GraphSeries } from "../classes/graph-series";

@Injectable()
export class GraphEventService {

  public graphSeriesAdded$: EventEmitter<GraphSeries>;
  public graphSeriesRemoved$: EventEmitter<number>;
  public graphSeriesLoading$: EventEmitter<boolean>;

  private seriesList = [];

  constructor() {
    this.graphSeriesAdded$ = new EventEmitter();
    this.graphSeriesRemoved$ = new EventEmitter();
    this.graphSeriesLoading$ = new EventEmitter();
  }

  public load(loading: boolean): void {
    this.graphSeriesLoading$.emit(loading);
  }

  public add(series: GraphSeries): void {
    this.seriesList.push(series);
    this.graphSeriesAdded$.emit(series);
  }

  public remove(seriesName: string): void {
    let removedIndex = -1;
    for (let i = 0; i < this.seriesList.length; i++) {
      if (this.seriesList[i].name == seriesName) {
        removedIndex = i;
      }
    }

    if (removedIndex > -1) {
      this.seriesList.splice(removedIndex, 1);
      this.graphSeriesRemoved$.emit(removedIndex);
    }
  }
}
