import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { GeoService, MapaFiltro } from './../geo.service';
import { Bounds } from './../../core/model';
import { AuthService } from '../../seguranca/auth.service';
import { LatLngLiteral } from '@agm/core/services/google-maps-types';

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
  zoom: Number = 15;
  map: any;
  geoJsonObject: Object;
  @ViewChild('map') m: ElementRef;
  @ViewChild('infoWindow') infoWindow: ElementRef;
  display: Boolean = true;
  paths: Array<LatLngLiteral> = [{ lat: -23.552011, lng: -51.460635 }];
  mostrarPoligono: Boolean = false;
  mapStyle: object = [
    {
      'featureType': 'poi',
      'elementType': 'all',
      'stylers': [{ visibility: 'off' }]
    }
  ];

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

  public viewBoundsChanged(event) {
    this.bounds.lat1 = this.map.getBounds().getSouthWest().lat();
    this.bounds.lng1 = this.map.getBounds().getSouthWest().lng();
    this.bounds.lat2 = this.map.getBounds().getNorthEast().lat();
    this.bounds.lng2 = this.map.getBounds().getNorthEast().lng();

    const zoom = this.map.getZoom();
    const center = this.map.getCenter();
    this.lat = center.toJSON().lat;
    this.lng = center.toJSON().lng;

    if (zoom >= 18) {
      this.filtro.bounds = this.bounds;
      this.filtro.latCenter = center.toJSON().lat;
      this.filtro.lngCenter = center.toJSON().lng;
      this.getGeoJSON();
    } else if (zoom < 18) {
      this.geoJsonObject = null;
    }
  }

  getGeoJSON() {
    if (this.filtro.opcao > -1) {
      this.geoService.getGeoJson(this.filtro)
        .then(resultado => {
          this.geoJsonObject = resultado.geoJson;
        })
        .catch(erro => this.errorHandler.handle(erro));
    }
  }

  public zoomChange(event) {
  }

  clicked(clickEvent) {
    this.infowinLat = clickEvent.feature.getProperty('lat');
    this.infowinLng = clickEvent.feature.getProperty('lng');
    this.infowinLat = clickEvent.feature.getProperty('lat');
    this.infowinLng = clickEvent.feature.getProperty('lng');
    this.infowinIsOpen = true;
    if (this.filtro.opcao === 0) {
      this.setPropertyZoneamentoClicado(clickEvent);
    } else if (this.filtro.opcao === 1) {
      this.setPropertyLoteClicado(clickEvent);
    }
    this.paths = clickEvent.feature.b.b[0].b;
    this.mostrarPoligono = true;
  }

  setPropertyLoteClicado(clickEvent) {
    this.infowinMsg['ins'] = clickEvent.feature.getProperty('Inscrição');
    this.infowinMsg['qua'] = clickEvent.feature.getProperty('Quadra');
    this.infowinMsg['lot'] = clickEvent.feature.getProperty('Lote');
    this.infowinMsg['log'] = clickEvent.feature.getProperty('Logradouro');
    this.infowinMsg['num'] = clickEvent.feature.getProperty('Número');
    this.infowinMsg['bai'] = clickEvent.feature.getProperty('Bairro');
    this.infowinMsg['pro'] = clickEvent.feature.getProperty('Proprietário');
  }

  setPropertyZoneamentoClicado(clickEvent) {
    this.infowinMsg['zon'] = clickEvent.feature.getProperty('Zoneamento');
    this.infowinMsg['des'] = clickEvent.feature.getProperty('Descrição');
    this.infowinMsg['cor'] = clickEvent.feature.getProperty('fill');
  }

  onTabClose(event) {
    this.filtro.opcao = -1;
    this.geoJsonObject = null;
    this.mostrarPoligono = false;
    this.zoom = 18;
    this.viewBoundsChanged();
  }

  onTabOpen(event) {
    this.geoJsonObject = null;
    this.zoom = 18;
    this.filtro.opcao = event.index;
    this.mostrarPoligono = false;
    this.viewBoundsChanged();
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
