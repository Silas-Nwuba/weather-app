import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cities } from '../data/data';
import { WeatherService } from '../weather.service';
import { weatherData } from '../interface/weather';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css'],
})
export class CitiesComponent implements OnInit {
  @Output() handleCity = new EventEmitter<string>();
  @Output() getLocation = new EventEmitter<{
    latitude: number;
    longitude: number;
  }>();
  city = cities;
  cityData: any = [];
  latitude: number | null = null;
  longitude: number | null = null;
  isCityLoading = false;
  erroMessages: string = '';
  constructor(private weatherService: WeatherService) {}

  getCities() {
    this.isCityLoading = true;
    this.city.map((c) =>
      this.weatherService.getweatherbycity(c.city).subscribe({
        next: (value: any) => {
          this.cityData.push(value);
          this.isCityLoading = false;
        },
        error: (err) => {
          this.erroMessages = 'Error getting cities data';
          this.isCityLoading = false;
        },
      })
    );
  }

  handleLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = parseFloat(position.coords.latitude.toFixed(4));
        this.longitude = parseFloat(position.coords.longitude.toFixed(4));
        this.getLocation.emit({
          latitude: this.latitude,
          longitude: this.longitude,
        });
      });
    } else {
      this.erroMessages = 'Geolocation is not supported by this browser';
    }
  }
  handlecity(value: string) {
    this.handleCity.emit(value);
  }

  ngOnInit(): void {
    this.getCities();
  }
}
