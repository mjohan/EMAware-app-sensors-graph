export class SensorData {
  _id: string;
  timestamp: string;
  skinTemperature: number;
  gsr: number;
  rrInterval: number;
  heartRate: number;
  userId: string;
  __v: number;
  accelerometer: {
    x: number;
    y: number;
    z: number;
  }
}
