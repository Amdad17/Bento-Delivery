//for lang
import { NZ_I18N, en_US as nzLang } from 'ng-zorro-antd/i18n';

//Modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AppRoutingModule } from './app-routing.module';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

//Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';

//For Component
import { AppComponent } from './app.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { MapComponent } from './pages/map/map.component';
import { RiderHistoryComponent } from './pages/rider-history/rider-history.component';
import { OrderNotificationComponent } from './pages/order-notification/order-notification.component';
import { AnimationComponent } from './components/animation/animation.component';
import { OrderDeliverdComponent } from './pages/order-deliverd/order-deliverd.component';
import { GirlSearchingAnimationComponent } from './components/girl-searching-animation/girl-searching-animation.component';
import { NavigationAminationComponent } from './components/navigation-amination/navigation-amination.component';
import { OrderConformAnimationComponent } from './components/order-conform-animation/order-conform-animation.component';
import { OnlineStatusComponent } from './components/online-status/online-status.component';
import { RiderProfileComponent } from './pages/rider-profile/rider-profile.component';
import { MegaMapComponent } from './pages/mega-map/mega-map.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    DrawerComponent,
    SignInComponent,
    SignUpComponent,
    MapComponent,
    RiderHistoryComponent,
    OrderNotificationComponent,
    AnimationComponent,
    OrderDeliverdComponent,
    GirlSearchingAnimationComponent,
    NavigationAminationComponent,
    OrderConformAnimationComponent,
    OnlineStatusComponent,
    RiderProfileComponent,
    MegaMapComponent,
    EditProfileComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NzIconModule,
    NzDrawerModule,
    NzUploadModule,
    NzInputModule,
    NzModalModule,
    NzMessageModule,
    NzCarouselModule,
    NzButtonModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    { provide: NZ_I18N, useValue: nzLang },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
