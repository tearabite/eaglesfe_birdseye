import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TelemetryComponent } from './telemetry/telemetry.component';
import { MenuComponent } from './menu/menu.component';
import { SceneComponent } from './scene/scene.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

import { AngularFireModule } from '@angular/fire';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { HttpClientModule } from '@angular/common/http';

import 'codemirror/mode/javascript/javascript';
import 'hammerjs';
import { GamePickerComponent } from './game-picker/game-picker.component';
import { RobotComponent } from './robot/robot.component';
import { RecorderComponent } from './recorder/recorder.component';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import { from } from 'rxjs';

@NgModule({
  declarations: [
    AppComponent,
    TelemetryComponent,
    MenuComponent,
    SceneComponent,
    GamePickerComponent,
    RobotComponent,
    RecorderComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
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
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
