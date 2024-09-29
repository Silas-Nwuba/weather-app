import { Component, EventEmitter, Input, Output } from '@angular/core';
import { favoriteType } from '../interface/favorite';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css'],
})
export class FavoriteComponent {
  @Input() isFavorite: any;
  @Input() favoriteData: favoriteType[] = [];
  @Output() closeFavorite = new EventEmitter<void>();
  @Output() onFavorite = new EventEmitter<string>();
  @Output() handleDeleteFavorite = new EventEmitter<void>();
  id: string = '';
  handleCloseFavorite() {
    this.closeFavorite.emit();
  }
  handleviewFavorite(id: string) {
    this.id = id;
    this.onFavorite.emit(id);
    this.closeFavorite.emit();
    console.log(this.id);
  }
  handleDeleteFavoriteBtn() {
    this.handleDeleteFavorite.emit();
  }
}
