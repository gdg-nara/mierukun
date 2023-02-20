import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// 学習活動を記録するボタンのコンポーネント
import { ButtonsetComponent } from './components/buttonset/buttonset.component';

// ボタン
import { MatButtonModule } from '@angular/material/button';
// テキストインプット
import { MatInputModule } from '@angular/material/input';
// Forms
import { FormsModule } from '@angular/forms';
// ユーザの入力に応じて追加入力が可能なテキストインプットコンポーネント
import { InputmoreComponent } from './components/inputmore/inputmore.component';
// 黒板面積グラフを表示するためのコンポーネント
import { KokubanChartComponent } from './components/kokuban-chart/kokuban-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonsetComponent,
    InputmoreComponent,
    KokubanChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatRippleModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatTabsModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatInputModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
