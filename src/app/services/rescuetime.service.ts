import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

import { Datapoint } from '../classes/datapoint';

@Injectable()
export class RescuetimeService {
  public static TASKS_FILTER = 'activity_number';
  public static PRODUCTIVITY_FILTER = 'productivity_level';
  public static EMAIL_FILTER = 'Email';
  public static ONLINE_CHAT_FILTER = 'Instant Message';
  public static SNS_FILTER = 'General Social Networking';

  private static DATA_API_URL = 'https://www.rescuetime.com/anapi/data';

  constructor(private http: Http) { }

  private static handleError(error: any): Promise<any> {
    console.error('Error: ', error);
    return Promise.reject(error.message || error);
  }

  private fetchRawActivities(key: string, start: string, end: string): Promise<Array<number | string>> {
    let requestUrl = RescuetimeService.DATA_API_URL + '?' + 
                      'key=' + key + '&' + 
                      'perspective=interval&' + 
                      'restrict_kind=activity&' +
                      'resolution_time=minute&' +
                      'format=json&' +
                      'restrict_begin=' + start + '&' +
                      'restrict_end=' + end;

    return this.http.get(requestUrl)
      .toPromise()
      .then(response => response.json().rows as Array<number | string>)
      .catch(RescuetimeService.handleError);
  }

  private retrieveActivityNumber(key: string, start: string, end: string): Promise<Datapoint[]> {
		return new Promise((resolve, reject) => {
			this.fetchRawActivities(key, start, end)
				.then(arrays => {
					let bufferData = {};
					_.each(arrays, function (e) {
						let date = new Date(e[0]);
						let timestamp = date.getTime() + date.getTimezoneOffset()*60*1000;
						if (bufferData[timestamp]) { bufferData[timestamp]++; }
						else { bufferData[timestamp] = 1; }
					});

					let dataArray = [];
					_.forOwn(bufferData, function(val, key) { dataArray.push({ timestamp: Number(key), value: val }) });

					resolve(dataArray);
				})
				.catch(error => reject(error))
			});
  }

  private retrieveProductivity(key: string, start: string, end: string): Promise<Datapoint[]> {
		return new Promise((resolve, reject) => {
			this.fetchRawActivities(key, start, end)
				.then(arrays => {
					let bufferData = {};
					_.each(arrays, function (e) {
						let date = new Date(e[0]);
						let timestamp = date.getTime() + date.getTimezoneOffset()*60*1000;
            if (!bufferData[timestamp]) bufferData[timestamp] = 0;
            bufferData[timestamp] += Math.round(e[1] * e[5] / 6.0);
					});

					let dataArray = [];
					_.forOwn(bufferData, function(val, key) { dataArray.push({ timestamp: Number(key), value: val }) });

					resolve(dataArray);
				})
				.catch(error => reject(error))
			});
  }

  private retrieveSpecificDuration(key: string, filterString: string, start: string, end: string): Promise<Datapoint[]> {
		return new Promise((resolve, reject) => {
			this.fetchRawActivities(key, start, end)
				.then(arrays => {
					let bufferData = {};
					_.each(arrays, function (e) {
						let date = new Date(e[0]);
						let timestamp = date.getTime() + date.getTimezoneOffset()*60*1000;
            if (!bufferData[timestamp]) bufferData[timestamp] = 0;
            if (e[4] == filterString) bufferData[timestamp] += e[1];
					});

					let dataArray = [];
					_.forOwn(bufferData, function(val, key) { dataArray.push({ timestamp: Number(key), value: val }) });

					resolve(dataArray);
				})
				.catch(error => reject(error))
			});
  }

  retrieveRescueTimeValues(key: string, filterString: string, start: string, end: string): Promise<Datapoint[]> {
    if (filterString == RescuetimeService.TASKS_FILTER) {
      return this.retrieveActivityNumber(key, start, end);
    } else if (filterString == RescuetimeService.PRODUCTIVITY_FILTER) {
      return this.retrieveProductivity(key, start, end);
    } else {
      return this.retrieveSpecificDuration(key, filterString, start, end);
    }
  }
}
