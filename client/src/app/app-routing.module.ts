import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawerComponent } from './drawer/drawer.component';
import { MapComponent } from './map/map.component';
import { AnimationComponent } from './animation/animation.component';
import { OrderDeliverdComponent } from './order-deliverd/order-deliverd.component';
import { GirlSearchingAnimationComponent } from './girl-searching-animation/girl-searching-animation.component';
import { NavigationAminationComponent } from './navigation-amination/navigation-amination.component';
import { OrderConformAnimationComponent } from './order-conform-animation/order-conform-animation.component';
import { OnlineStatusComponent } from './online-status/online-status.component';
import { MegaMapComponent } from './mega-map/mega-map.component';

const routes: Routes = [
  { path: '', component: DrawerComponent },
  { path: ':riderId/ridermap', component: MapComponent },
  { path: 'orderStatus', component: OrderDeliverdComponent },
  { path: 'animation', component: AnimationComponent },
  { path: 'animation1', component: GirlSearchingAnimationComponent },
  { path: 'animation2', component: NavigationAminationComponent },
  { path: 'animation3', component: OrderConformAnimationComponent },
  { path: 'status', component: OnlineStatusComponent },
  { path: 'megaMap', component: MegaMapComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
