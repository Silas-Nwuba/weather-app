import { Component, EventEmitter, Input, Output } from '@angular/core';
import { favoriteType } from '../interface/favorite';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.css'],
})
export class CurrentWeatherComponent {
  isFavouriteChecked: boolean = false;
  @Input() weather: any;
  @Input() isLoading: any;
  @Output() handleFavoriteData: EventEmitter<favoriteType> = new EventEmitter();
  @Output() handleUpdateFavorite: EventEmitter<string> = new EventEmitter();

  handleFavoriteChecked(weather: any) {
    console.log(weather);
    this.isFavouriteChecked = !this.isFavouriteChecked;
    if (this.isFavouriteChecked) {
      const newFavorite = {
        id: weather.name,
        name: weather.name,
        state: weather.state,
        temp: weather.temp,
        country: weather.country,
      };
      this.handleFavoriteData.emit(newFavorite);
    }
    if (!this.isFavouriteChecked) {
      this.handleUpdateFavorite.emit(weather.name);
    }
  }
}
