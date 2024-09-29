import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { weatherData } from './interface/weather';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private Api_Key: string = 'ec4bebbf272a35fe149a26b69c7275d7';
  private geoCode_Api: string = 'b1cb8f3a84dcd0646ba5131098cd3af6';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  constructor(private http: HttpClient) {}

  getWeather(latitude: number, longitude: number) {
    const url = `${this.apiUrl}?lat=${latitude}&lon=${longitude}&appid=${this.Api_Key}&units=metric&limit={1}`;
    return this.http.get<weatherData>(url);
  }
  getGeoCode(city: string): Observable<any> {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${this.geoCode_Api}`;
    return this.http.get(url);
  }
  getweatherbycity(city: string) {
    const url = `${this.apiUrl}?q=${city}&appid=${this.Api_Key}&units=metric`;
    return this.http.get(url);
  }
}
