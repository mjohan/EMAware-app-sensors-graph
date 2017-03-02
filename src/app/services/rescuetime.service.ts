import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

import { Datapoint } from '../classes/datapoint';
import { FilterOption } from '../classes/filter-option'

@Injectable()
export class RescuetimeService {
  private static TYPE = { GENERAL: 'general', ACTIVITY: 'activity', CATEGORY: 'overview' };

  public static FILTER = {
    TASK: { type: RescuetimeService.TYPE.GENERAL, value: 'activity_number' },
    PRODUCTIVITY: { type: RescuetimeService.TYPE.GENERAL, value: 'productivity_level' },
    EMAIL: { type: RescuetimeService.TYPE.ACTIVITY, value: 'Email' },
    CHAT: { type: RescuetimeService.TYPE.ACTIVITY, value: 'Instant Message' },
    SOCMED: { type: RescuetimeService.TYPE.CATEGORY, value: 'Social Networking' },
    BUSINESS: { type: RescuetimeService.TYPE.CATEGORY, value: 'Business' },
    COMMSCHED: { type: RescuetimeService.TYPE.CATEGORY, value: 'Communication & Scheduling' },
    DESIGN: { type: RescuetimeService.TYPE.CATEGORY, value: 'Design & Composition' },
    ENTERTAINMENT: { type: RescuetimeService.TYPE.CATEGORY, value: 'Entertainment' },
    NEWS: { type: RescuetimeService.TYPE.CATEGORY, value: 'News & Opinion' },
    REFERENCE: { type: RescuetimeService.TYPE.CATEGORY, value: 'Reference & Learning' },
    DEVELOPMENT: { type: RescuetimeService.TYPE.CATEGORY, value: 'Software Development' },
    SHOPPING: { type: RescuetimeService.TYPE.CATEGORY, value: 'Shopping' },
    UTILITIES: { type: RescuetimeService.TYPE.CATEGORY, value: 'Utilities' },
    MISC: { type: RescuetimeService.TYPE.CATEGORY, value: 'Miscellaneous' },
    ETC: { type: RescuetimeService.TYPE.CATEGORY, value: 'Uncategorized' }
  };

  private static DATA_API_URL = 'https://www.rescuetime.com/anapi/data';

  constructor(private http: Http) { }

  private static handleError(error: any): Promise<any> {
    console.error('Error: ', error);
    return Promise.reject(error.message || error);
  }

  private fetchRawActivities(key: string, type: string, start: string, end: string): Promise<Array<number | string>> {
    let requestUrl = RescuetimeService.DATA_API_URL + '?' + 
                      'key=' + key + '&' + 
                      'perspective=interval&' + 
                      'restrict_kind=' + type + '&' +
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
			this.fetchRawActivities(key, RescuetimeService.TYPE.CATEGORY, start, end)
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
			this.fetchRawActivities(key, RescuetimeService.TYPE.ACTIVITY, start, end)
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

  private retrieveSpecificDuration(key: string, filter: FilterOption, start: string, end: string): Promise<Datapoint[]> {
		return new Promise((resolve, reject) => {
			this.fetchRawActivities(key, filter.type, start, end)
				.then(arrays => {
					let bufferData = {};
					_.each(arrays, function (e) {
						let date = new Date(e[0]);
						let timestamp = date.getTime() + date.getTimezoneOffset()*60*1000;
            if (!bufferData[timestamp]) bufferData[timestamp] = 0;

            let index = (filter.type == RescuetimeService.TYPE.CATEGORY) ? 3 : 4;
            if (e[index] == filter.value) bufferData[timestamp] += e[1];
					});

					let dataArray = [];
					_.forOwn(bufferData, function(val, key) { dataArray.push({ timestamp: Number(key), value: val }) });

					resolve(dataArray);
				})
				.catch(error => reject(error))
			});
  }

  retrieveRescueTimeValues(key: string, filter: FilterOption, start: string, end: string): Promise<Datapoint[]> {
    if (filter.type == RescuetimeService.TYPE.GENERAL) {
      if (filter.value == RescuetimeService.FILTER.TASK.value) {
        return this.retrieveActivityNumber(key, start, end);
      } else {
        return this.retrieveProductivity(key, start, end);
      }
    } else {
      return this.retrieveSpecificDuration(key, filter, start, end);
    }
  }
}
