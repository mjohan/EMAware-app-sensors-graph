import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

import { BackendConfiguration } from './backend-configuration';
import { SensauraEmotion } from './classes/sensaura-emotion';
import { SensorData } from './classes/sensor-data';
import { Datapoint } from './classes/datapoint';

@Injectable()
export class DatabankService {

  constructor(private http: Http) { }

  private static getRequestOptions(): RequestOptions {
    let headers = new Headers({
      'ACCESS-KEY': BackendConfiguration.API_ACCESS_KEY,
      'ROOT-KEY': BackendConfiguration.API_ROOT_KEY
    });

    return new RequestOptions({ headers: headers });
  }

  private handleError(error: any): Promise<any> {
    console.error('Error: ', error);
    return Promise.reject(error.message || error);
  }

  fetchEmotionData(startDate: number, endDate: number): Promise<SensauraEmotion[]> {
    let requestUrl = BackendConfiguration.API_ENDPOINT + BackendConfiguration.EMOTION_PATH 
                      + "?page=0&limit=0&from=" + startDate + "&end=" + endDate;

    return this.http.get(requestUrl, DatabankService.getRequestOptions())
      .toPromise()
      .then(response => response.json()[BackendConfiguration.EMOTION_PATH] as SensauraEmotion[])
      .catch(this.handleError);
  }

  fetchSensorData(startDate: number, endDate: number): Promise<SensorData[]> {
    let requestUrl = BackendConfiguration.API_ENDPOINT + BackendConfiguration.SENSORS_PATH 
                      + "?page=0&limit=0&from=" + startDate + "&end=" + endDate;

    return this.http.get(requestUrl, DatabankService.getRequestOptions())
      .toPromise()
      .then(response => response.json()[BackendConfiguration.SENSORS_PATH] as SensorData[])
      .catch(this.handleError);
  }

  retrieveEmotionValues(userId: string, emotion: string, startDate: number, endDate: number): Promise<Datapoint[]> {
    return new Promise((resolve, reject) => {
      this.fetchEmotionData(startDate, endDate).then(sensordata => {
        let userFiltered = _.filter(sensordata, function (e) {
          return e.userId == userId && e.hasOwnProperty(emotion);
        });

        let dataFiltered = _.map(userFiltered, function (e) {
          return { 
            timestamp: new Date(e.timestamp).getMilliseconds(), 
            value:e[emotion] 
          };
        });

        resolve(dataFiltered as Datapoint[]);
      }).catch(error => reject(error));
    });
  }
}
