import { Component, OnInit, ViewChild } from '@angular/core';
import { WeatherService } from './weather.service';
import { weatherData } from './interface/weather';
import { favoriteType } from './interface/favorite';
import { iconMapping } from './data/image';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isFavorite: boolean = false;
  isDestop = window.innerWidth > 968;
  loading: boolean = false;
  weather!: weatherData;
  updateInputValue: string = '';
  favoriteData: favoriteType[] = [];
  count: number = 0;
  errMessage: string = '';
  isCurrentWeather = false;
  isCityOpen = true;

  constructor(private weatherService: WeatherService) {}

  getLocation(latitude: number, longitude: number) {
    this.isCityOpen = false;
    this.loading = true;
    this.weatherService.getWeather(latitude, longitude).subscribe({
      next: (value) => {
        this.weather = value;
        this.getWeatherData(this.weather);
        this.loading = false;
        this.isCurrentWeather = true;
        this.isCityOpen = false;
      },
      error: (err) => {
        this.errMessage = 'Error getting weather data';
        this.loading = false;
        console.log(err);
      },
    });
  }

  updateInputSearchValue(newValue: string) {
    this.updateInputValue = newValue;
  }

  getWeatherData(dataObj: any) {
    this.weatherService.getGeoCode(dataObj?.name).subscribe((data: any) => {
      this.weather.state = data[0].state;
      this.weather.imageUrl = iconMapping[dataObj?.weather[0].icon];
      this.weather.country = dataObj?.sys.country;
      this.weather.feelLike = dataObj?.main.feels_like;
      this.weather.humidity = dataObj?.main.humidity;
      this.weather.pressure = dataObj?.main.pressure;
      this.weather.temp = dataObj?.main.temp;
      this.weather.description = dataObj?.weather[0].description;
      this.weather.desc = dataObj?.weather[0].main;
      this.weather.wind = Number(dataObj?.wind.speed);
      this.weather.dewPoint = this.calculateDewpoints(dataObj);
      this.weather.visibility = dataObj?.visibility;
    });
  }

  onEnterKey() {
    this.isCityOpen = false;
    this.loading = true;
    this.weatherService.getweatherbycity(this.updateInputValue).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.weather = data;
        this.getWeatherData(this.weather);
        this.isCurrentWeather = true;
        this.updateInputValue = '';
        this.isFavorite = false;
        this.errMessage = '';
      },
      error: () => {
        this.isFavorite = false;
        this.errMessage = 'Error getting weather data';
        this.loading = false;
        this.updateInputValue = '';
      },
    });
  }

  handleWeatherByCityName(name: string) {
    this.loading = true;
    this.isCityOpen = false;
    this.weatherService.getweatherbycity(name).subscribe({
      next: (value: any) => {
        this.weather = value;
        this.getWeatherData(this.weather);
        this.loading = false;
        this.isCityOpen = false;
        this.isCurrentWeather = true;
      },
      error: () => {
        this.isFavorite = false;
        this.errMessage = 'Error getting weather data';
        this.loading = false;
      },
    });
  }
  handleCity(value: string) {
    this.handleWeatherByCityName(value);
  }
  calculateDewpoints(data: any) {
    const a = 17.27;
    const b = 237.7;
    const alpha =
      (a * Math.floor(data?.main.temp)) / (b + Math.floor(data?.main.temp)) +
      Math.log(data?.main.humidity / 100);
    const dewPoint = (b * alpha) / (a - alpha);
    return dewPoint;
  }
  handleFavoriteData(data: favoriteType) {
    const exist = this.favoriteData.some((favorite) => favorite.id === data.id);
    if (!exist) {
      this.favoriteData.push(data);
      this.count = this.favoriteData.length;
    }
  }
  handleUpdateFavorite(id: string) {
    this.favoriteData = this.favoriteData.filter((f) => f.id !== id);
    this.count = this.favoriteData.length;
  }
  handleOpenFavoriteModal() {
    if (this.isDestop) {
      this.isCurrentWeather = true;
      this.isFavorite = true;
    } else if (!this.isDestop && this.count !== 0) {
      this.isCurrentWeather = false;
      this.isFavorite = true;
    }
  }
  handleCloseFavoriteModal() {
    this.isFavorite = false;
    this.isCurrentWeather = true;
  }
  handleDeleteFavorite() {
    this.favoriteData = [];
    this.count = 0;
  }
  ngOnInit(): void {
    this.isCurrentWeather = false;
  }
}
