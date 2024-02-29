import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NzMessageModule } from 'ng-zorro-antd/message';

//for lang
import { NZ_I18N, en_US as nzLang } from 'ng-zorro-antd/i18n';

//For Drawer
// import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzButtonModule } from 'ng-zorro-antd/button';

//For Component
import { DrawerComponent } from './drawer/drawer.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { MapComponent } from './map/map.component';
import { RiderHistoryComponent } from './rider-history/rider-history.component';
import { OrderNotificationComponent } from './order-notification/order-notification.component';
import { AnimationComponent } from './animation/animation.component';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { TestForBentoComponent } from './test-for-bento/test-for-bento.component';
import { OrderDeliverdComponent } from './order-deliverd/order-deliverd.component';
import { GirlSearchingAnimationComponent } from './girl-searching-animation/girl-searching-animation.component';
import { NavigationAminationComponent } from './navigation-amination/navigation-amination.component';
import { OrderConformAnimationComponent } from './order-conform-animation/order-conform-animation.component';
import { OnlineStatusComponent } from './online-status/online-status.component';
import { RiderProfileComponent } from './rider-profile/rider-profile.component';
import { MegaMapComponent } from './mega-map/mega-map.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

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
    TestForBentoComponent,
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
