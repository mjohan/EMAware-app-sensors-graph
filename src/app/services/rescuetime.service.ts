import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

import { Datapoint } from '../classes/datapoint';

@Injectable()
export class RescuetimeService {
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

  retrieveActivityNumber(key: string, start: string, end: string): Promise<Datapoint[]> {
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

}
