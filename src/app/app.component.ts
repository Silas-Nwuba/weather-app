import { Component, OnInit } from '@angular/core';
import { WeatherService } from './weather.service';
import { weatherData } from './interface/weather';
import { favoriteType } from './interface/favorite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isFavorite: boolean = false;
  isDestop = window.innerWidth > 968;
  latitude: number | null = null;
  longitude: number | null = null;
  loading: boolean = false;
  weather!: weatherData;
  updateInputValue: string = '';
  favoriteData: favoriteType[] = [];
  count: number = 0;
  errMessage: string = '';
  isCurrentWeather = false;

  private iconMapping: { [key: string]: string } = {
    '01d': '../../../assets/image/sunny-night.png',
    '01n': '../../../assets/image/sunny.png',
    '02d': '../../../assets/image/partly-cloudy.png',
    '02n': '../../../assets/image/partly-cloudy-night.png',
    '03d': '../../../assets/image/partly-cloudy.png',
    '03n': '../../../assets/image/partly-cloudy.png',
    '04d': '../../../assets/image/drizzle.png',
    '04n': '../../../assets/image/drizzle.png',
    '09d': '../../../assets/weather/shower-rain.png',
    '09n': '../../../assets/weather/shower-rain.png',
    '10d': '../../../assets/image/rainy-day.png',
    '10n': '../../../assets/image/rainy-night.png',
    '11d': '../../../assets/image/thunderstorm.png',
    '13d': '../../../assets/image/snow.png',
    '13n': '../../../assets/image/snow.png',
    '50d': '../../../assets/image/haza.png',
  };
  constructor(private weatherService: WeatherService) {}
  getLocation() {
    this.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = parseFloat(position.coords.latitude.toFixed(4));
          this.longitude = parseFloat(position.coords.longitude.toFixed(4));
          this.weatherService
            .getWeather(this.latitude, this.longitude)
            .subscribe({
              next: (value) => {
                this.weather = value;
                this.getWeatherData(this.weather);
                this.loading = false;
                this.isCurrentWeather = true;
              },
              error: (err) => {
                this.errMessage = 'Error getting weather data';
                this.loading = false;
                console.log(err);
              },
            });
        },
        (error) => {
          console.error('Error getting location:', error.message);
          this.loading = false;
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser');
    }
  }

  getWeatherData(dataObj: any) {
    this.weatherService.getGeoCode(dataObj?.name).subscribe((data: any) => {
      this.weather.state = data[0].state;
      this.weather.imageUrl = this.iconMapping[dataObj?.weather[0].icon];
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
  updateInputSearchValue(newValue: string) {
    this.updateInputValue = newValue;
  }
  onEnterKey() {
    this.loading = true;
    this.weatherService.getweatherbycity(this.updateInputValue).subscribe({
      next: (data: any) => {
        this.weatherService.getGeoCode(data?.name).subscribe((dataObj: any) => {
          this.loading = false;
          this.isCurrentWeather = true;
          this.updateInputValue = '';
          dataObj.map((item: any) => {
            this.weather.name = item.name;
            this.weather.state = item.state;
            this.weather.imageUrl = this.iconMapping[data?.weather[0].icon];
            this.weather.country = data?.sys.country;
            this.weather.feelLike = data?.main.feels_like;
            this.weather.humidity = data?.main.humidity;
            this.weather.pressure = data?.main.pressure;
            this.weather.temp = data?.main.temp;
            this.weather.description = data?.weather[0].description;
            this.weather.desc = data?.weather[0].main;
            this.weather.wind = Number(data?.wind.speed);
            this.weather.dewPoint = this.calculateDewpoints(data);
            this.weather.visibility = data?.visibility;
          });
        });
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

  onFavorite(name: string) {
    this.loading = true;
    this.weatherService.getweatherbycity(name).subscribe({
      next: (data: any) => {
        this.weatherService.getGeoCode(data?.name).subscribe((dataObj: any) => {
          this.loading = false;
          this.isCurrentWeather = true;
          dataObj.map((item: any) => {
            this.weather.name = item.name;
            this.weather.state = item.state;
            this.weather.imageUrl = this.iconMapping[data?.weather[0].icon];
            this.weather.country = data?.sys.country;
            this.weather.feelLike = data?.main.feels_like;
            this.weather.humidity = data?.main.humidity;
            this.weather.pressure = data?.main.pressure;
            this.weather.temp = data?.main.temp;
            this.weather.description = data?.weather[0].description;
            this.weather.desc = data?.weather[0].main;
            this.weather.wind = Number(data?.wind.speed);
            this.weather.dewPoint = this.calculateDewpoints(data);
            this.weather.visibility = data?.visibility;
          });
        });
      },
      error: () => {
        this.isFavorite = false;
        this.errMessage = 'Error getting weather data';
        this.loading = false;
      },
    });
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
    this.getLocation();
  }
  ngOnInit() {
    this.getLocation();
  }
}
