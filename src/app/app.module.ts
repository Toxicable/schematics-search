import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatInputModule} from '@angular/material';
import { MatProgressBarModule} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports:      [ BrowserModule, ReactiveFormsModule, HttpClientModule, MatInputModule, BrowserAnimationsModule, MatProgressBarModule ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
