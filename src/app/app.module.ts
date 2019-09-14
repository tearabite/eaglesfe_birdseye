import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TelemetryComponent } from './telemetry/telemetry.component';
import { MenuComponent } from './menu/menu.component';
import { DebuggerComponent } from './debugger/debugger.component';
import { SceneComponent } from './scene/scene.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { HttpClientModule } from '@angular/common/http';

import 'codemirror/mode/javascript/javascript';
import 'hammerjs';
import { GamePickerComponent } from './game-picker/game-picker.component';
import { RobotComponent } from './robot/robot.component';

@NgModule({
  declarations: [
    AppComponent,
    TelemetryComponent,
    MenuComponent,
    DebuggerComponent,
    SceneComponent,
    GamePickerComponent,
    RobotComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    CodemirrorModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSliderModule,
    MatCardModule,
    MatCheckboxModule,
    MatListModule,
    MatRadioModule,
    HttpClientModule,
    MatSelectModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
