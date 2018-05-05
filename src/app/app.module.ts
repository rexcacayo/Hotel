import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

//Componentes
import { AppComponent } from './app.component';

//Servicios
import { RoomsApiService } from './servicios/roomsApi.service';
import { ExtrasApiService } from './servicios/extrasApi.service';
import { SeasonsApiService } from './servicios/seasonsApi.service';
import { ReservationsApiService } from './servicios/reservationsApi.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    BrowserModule
  ],
  providers: [
    RoomsApiService,
    ExtrasApiService,
    SeasonsApiService,
    ReservationsApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
