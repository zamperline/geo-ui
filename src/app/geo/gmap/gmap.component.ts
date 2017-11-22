import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { GeoService, MapaFiltro } from './../geo.service';
import { Bounds } from './../../core/model';
import { AuthService } from '../../seguranca/auth.service';

declare var google: any;

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  exibindoMenu = false;
  totalRegistros = 0;
  infowinIsOpen: Boolean = false;
  infowinLat: Number = 23.552011;
  infowinLng: Number = -51.460635;
  infowinMsg: string[] = ['', '', ''];
  filtro = new MapaFiltro();
  bounds = new Bounds();
  lat: Number = -23.552011;
  lng: Number = -51.460635;
  zoom: Number = 17;
  map: any;
  geoJsonObject: Object;
  @ViewChild('map') m: ElementRef;
  @ViewChild('infoWindow') infoWindow: ElementRef;
  display: Boolean = false;
  mapTypeId: String = 'terrain';

  constructor(
    private geoService: GeoService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private toasty: ToastyService,
    private title: Title,
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.title.setTitle('Mapaclear');
  }

  public onMapReady(map: any) {
    this.map = map;
  }

  showDialog() {
    this.display = true;
  }

  public viewBoundsChanged() {
    this.bounds.lat1 = this.map.getBounds().getSouthWest().lat();
    this.bounds.lng1 = this.map.getBounds().getSouthWest().lng();
    this.bounds.lat2 = this.map.getBounds().getNorthEast().lat();
    this.bounds.lng2 = this.map.getBounds().getNorthEast().lng();

    const zoom = this.map.getZoom();
    const center = this.map.getCenter();
    this.lat = center.toJSON().lat;
    this.lng = center.toJSON().lng;

    if (zoom >= 17) {
      this.filtro.bounds = this.bounds;
      this.filtro.latCenter = center.toJSON().lat;
      this.filtro.lngCenter = center.toJSON().lng;
      this.getGeoJSON();
    } else if (zoom < 17) {
      this.geoJsonObject = null;
    }
  }

  getGeoJSON() {
    this.geoService.getGeoJson(this.filtro)
      .then(resultado => {
        this.geoJsonObject = resultado.geoJson;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  public zoomChange() {
  }

  clicked(clickEvent) {
    this.infowinLat = clickEvent.feature.getProperty('lat');
    this.infowinLng = clickEvent.feature.getProperty('lng');
    this.infowinLat = clickEvent.feature.getProperty('lat');
    this.infowinLng = clickEvent.feature.getProperty('lng');
    this.infowinMsg[0] = clickEvent.feature.getProperty('Id');
    this.infowinMsg[1] = clickEvent.feature.getProperty('Inscrição');
    this.infowinMsg[2] = clickEvent.feature.getProperty('Situação');
    this.infowinIsOpen = true;
  }

  loteStyle(feature) {
    return {
      fillColor: feature.getProperty('fill'),
      fillOpacity: feature.getProperty('fill-opacity'),
      strokeColor: feature.getProperty('stroke'),
      strokeOpacity: feature.getProperty('stroke-opacity'),
      strokeWeight: 1
    };
  }
}
