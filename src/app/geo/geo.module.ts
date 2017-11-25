import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import {AccordionModule} from 'primeng/components/accordion/accordion';
import {DialogModule} from 'primeng/components/dialog/dialog';
import {ButtonModule} from 'primeng/components/button/button';
import {ToolbarModule} from 'primeng/components/toolbar/toolbar';

import { SharedModule } from './../shared/shared.module';
import { GeoRoutingModule } from './geo-routing.module';
import { GmapComponent } from './gmap/gmap.component';


@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'RAIzaSyCuF0jO6w-aCgx7P28epp7zKGbNJwjlw6gl'
    }),
    AgmSnazzyInfoWindowModule,
    DialogModule,
    AccordionModule,
    ButtonModule,
    ToolbarModule,

    SharedModule,
    GeoRoutingModule
  ],
  declarations: [GmapComponent]
})
export class GeoModule { }
