import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

import { BackendConfiguration } from '../backend-configuration';
import { SensauraEmotion } from '../classes/sensaura-emotion';
import { SensorData } from '../classes/sensor-data';
import { Datapoint } from '../classes/datapoint';
import { GraphUser } from '../classes/graph-user';
import { BackendUser } from '../classes/backend-user';

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

  private static handleError(error: any): Promise<any> {
    console.error('Error: ', error);
    return Promise.reject(error.message || error);
  }

  private static filterData(userId: string, filterKey: string, dataArray: any): Datapoint[] {
    let userFiltered = _.filter(dataArray, function (e: any) {
      return e.userId == userId && e.hasOwnProperty(filterKey);
    });

    let dataFiltered = _.map(userFiltered, function (e: any) {
      return {
        timestamp: new Date(e.timestamp).getTime(),
        value: e[filterKey]
      };
    });

    return dataFiltered as Datapoint[];
  }

  private fetchEmotionData(startDate: number, endDate: number): Promise<SensauraEmotion[]> {
    let requestUrl = BackendConfiguration.API_ENDPOINT + BackendConfiguration.EMOTION_PATH
                      + "?page=0&limit=0&from=" + startDate + "&end=" + endDate;

    return this.http.get(requestUrl, DatabankService.getRequestOptions())
      .toPromise()
      .then(response => response.json()[BackendConfiguration.EMOTION_PATH] as SensauraEmotion[])
      .catch(DatabankService.handleError);
  }

  retrieveEmotionValues(userId: string, emotion: string, startDate: number, endDate: number): Promise<Datapoint[]> {
    return new Promise((resolve, reject) => {
      this.fetchEmotionData(startDate, endDate).then(sensordata => {
        resolve(DatabankService.filterData(userId, emotion, sensordata));
      }).catch(error => reject(error));
    });
  }

  private fetchSensorData(startDate: number, endDate: number): Promise<SensorData[]> {
    let requestUrl = BackendConfiguration.API_ENDPOINT + BackendConfiguration.SENSORS_PATH
                      + "?page=0&limit=0&from=" + startDate + "&end=" + endDate;

    return this.http.get(requestUrl, DatabankService.getRequestOptions())
      .toPromise()
      .then(response => response.json()[BackendConfiguration.SENSORS_PATH] as SensorData[])
      .catch(DatabankService.handleError);
  }

  retrieveSensorValues(userId: string, sensor: string, startDate: number, endDate: number): Promise<Datapoint[]> {
    return new Promise((resolve, reject) => {
      this.fetchSensorData(startDate, endDate).then(sensordata => {
        resolve(DatabankService.filterData(userId, sensor, sensordata));
      }).catch(error => reject(error));
    });
  }

  private fetchBackendUsers(): Promise<BackendUser[]> {
    let requestUrl = BackendConfiguration.API_ENDPOINT + BackendConfiguration.USER_PATH
                      + "?page=1&limit=80";

    return this.http.get(requestUrl, DatabankService.getRequestOptions())
      .toPromise()
      .then(response => response.json().users as BackendUser[])
      .catch(DatabankService.handleError);
  }

  retrieveGraphUser(username: string): Promise<GraphUser> {
    return new Promise((resolve, reject) => {
      this.fetchBackendUsers().then(users => {
        let filteredUsers: BackendUser[] = _.filter(users, function (e: BackendUser) {
          return e.username == username;
        });

        if (filteredUsers.length > 0) {
          let user = filteredUsers[0];
          resolve({ userId: user._id, username: user.username, rtKey: user.firstName});
        } else {
          reject({message: "Username is not found!"});
        }
      }).catch(error => reject(error));
    });
  }

}
