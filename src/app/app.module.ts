import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CurrentWeatherComponent } from './current-weather/current-weather.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from './loader/loader.component';
import { HttpClientModule } from '@angular/common/http';
import { ErrorMessageComponent } from './error-message/error-message.component';
import { CitiesComponent } from './cities/cities.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CurrentWeatherComponent,
    FavoriteComponent,
    FooterComponent,
    LoaderComponent,
    ErrorMessageComponent,
    CitiesComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
