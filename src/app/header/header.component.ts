import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() inputValue: any;
  @Input() count: number = 0;
  @Output() onEnterKey: EventEmitter<void> = new EventEmitter();
  @Input() isFavorite: any;
  @Output() isFavoriteOpen: EventEmitter<any> = new EventEmitter();
  @Output() inputValueChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    // console.log(this.inputSearchValue);
  }
  handleOpenFavoriteModal() {
    this.isFavoriteOpen.emit();
  }
  onInputChangeValue(value: string) {
    this.inputValueChange.emit(value);
  }
  handleEnterKey() {
    this.onEnterKey.emit();
  }

  ngOnInit(): void {}
}
