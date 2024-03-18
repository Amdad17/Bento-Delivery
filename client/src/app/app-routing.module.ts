import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawerComponent } from './components/drawer/drawer.component';
import { MapComponent } from './pages/map/map.component';
import { AnimationComponent } from './components/animation/animation.component';
import { OrderDeliverdComponent } from './pages/order-deliverd/order-deliverd.component';
import { GirlSearchingAnimationComponent } from './components/girl-searching-animation/girl-searching-animation.component';
import { NavigationAminationComponent } from './components/navigation-amination/navigation-amination.component';
import { OrderConformAnimationComponent } from './components/order-conform-animation/order-conform-animation.component';
import { OnlineStatusComponent } from './components/online-status/online-status.component';
import { MegaMapComponent } from './pages/mega-map/mega-map.component';

const routes: Routes = [
  { path: '', component: DrawerComponent },
  { path: ':riderId/ridermap', component: MapComponent },
  { path: 'orderStatus', component: OrderDeliverdComponent },
  { path: 'goOnline', component: AnimationComponent },
  { path: 'animation1', component: GirlSearchingAnimationComponent },
  { path: 'searchHub', component: NavigationAminationComponent },
  { path: 'animation3', component: OrderConformAnimationComponent },
  { path: 'status', component: OnlineStatusComponent },
  { path: 'megaMap', component: MegaMapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
