import { Injectable } from '@angular/core';
import { Datapoint } from '../classes/datapoint';

@Injectable()
export class RescuetimeFeaturesService {

  constructor() { }

  mapDatapoints(emotions: Datapoint[], rtData: Datapoint[]): Promise<Datapoint[]> {
    return new Promise((resolve, reject) => {
      let rtIndex = 0;
      let searching = true;
      let prevValue = 0;
      let dataPoints = [];

      for (let i = 0; i < emotions.length; i++) {
        while (searching && rtIndex < rtData.length) {
          let timeDiff = emotions[i].timestamp - rtData[rtIndex].timestamp;

          if (timeDiff < 300000) {
            let val = -999;
            if (timeDiff > 120000) {
              val = rtData[rtIndex].value;
            } else if (timeDiff > 30000) {
              val = (rtData[rtIndex].value + prevValue) / 2;
            } else if (timeDiff > 0) {
              val = prevValue;
            }
            dataPoints.push({ timestamp: emotions[i].timestamp, value: val });
            searching = false;
          } else {
            prevValue = rtData[rtIndex].value;
            rtIndex++;
          }
        }
        searching = true;
      }

      resolve(dataPoints as Datapoint[]);
    });
  }
}
