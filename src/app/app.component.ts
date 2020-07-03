import { Component, OnInit } from '@angular/core';
import { Motion, Geolocation } from '@capacitor/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  WeatherData:any;
  private _data$: BehaviorSubject<any> = new BehaviorSubject(null)
  public data$: Observable<any> = this._data$.asObservable()

  title = 'CapacitorDemo';
  orientationListenerActive = false;
  alpha
  beta
  gamma

  latitude: number = 46.207175299999996
  longitude: number = 6.0998024
  appId: string = '7cb6e2f8304ca90d850a207ca64163d2'

  constructor(
    private _http: HttpClient
  ) { 
    this.getLocation()
  }

  ngOnInit() {
    this.WeatherData = {
      main : {},
      isDay: true
    };
    this.getWeatherData();
    console.log(this.WeatherData);
  }

  getWeatherData(){
    /* https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${appId}&units=metric */
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.latitude}&lon=${this.longitude}&appid=${this.appId}`)
    .then(response=>response.json())
    .then(data=>{this.setWeatherData(data);})
  }

  setWeatherData(data){
    this.WeatherData = data;
    let sunsetTime = new Date(this.WeatherData.sys.sunset * 1000);
    this.WeatherData.sunset_time = sunsetTime.toLocaleTimeString();
    let currentDate = new Date();
    this.WeatherData.isDay = (currentDate.getTime() < sunsetTime.getTime());
    this.WeatherData.temp_celcius = (this.WeatherData.main.temp - 273.15).toFixed(0);
    this.WeatherData.temp_min = (this.WeatherData.main.temp_min - 273.15).toFixed(0);
    this.WeatherData.temp_max = (this.WeatherData.main.temp_max - 273.15).toFixed(0);
    this.WeatherData.temp_feels_like = (this.WeatherData.main.feels_like - 273.15).toFixed(0);
  }

  async getLocation() {
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
  }



  async handleOrientationEvents() {
    if (this.orientationListenerActive) return;
    this.orientationListenerActive = true;
    await Motion.addListener('orientation', event => {
      /* console.log(event); */

      this.alpha = event.alpha
      this.beta = event.beta
      this.gamma = event.gamma   
    });
  }
}