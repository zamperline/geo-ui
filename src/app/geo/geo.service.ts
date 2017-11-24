
  import { URLSearchParams } from '@angular/http';
  import { Injectable } from '@angular/core';

  import { AuthHttp } from 'angular2-jwt';
  import 'rxjs/add/operator/toPromise';

  import { environment } from './../../environments/environment';
import { Bounds } from '../core/model';
//  import { Geo } from './../core/model';

  export class MapaFiltro {
    bounds = new Bounds();
    latCenter: string;
    lngCenter: string;
    opcao: Number = -1;
  }

  @Injectable()
  export class GeoService {

    mapaUrl: string;

    constructor(private http: AuthHttp) {
      this.mapaUrl = `${environment.apiUrl}/geo`;
    }

    getGeoJson(filtro: MapaFiltro): Promise<any> {
      const params = new URLSearchParams();
      if (filtro.bounds.lat1) {
        params.set('bounds.lat1', filtro.bounds.lat1);
      }
      if (filtro.bounds.lat2) {
        params.set('bounds.lat2', filtro.bounds.lat2);
      }
      if (filtro.bounds.lng1) {
        params.set('bounds.lng1', filtro.bounds.lng1);
      }
      if (filtro.bounds.lng2) {
        params.set('bounds.lng2', filtro.bounds.lng2);
      }
      if (filtro.latCenter) {
        params.set('latCenter', filtro.latCenter);
      }
      if (filtro.lngCenter) {
        params.set('lngCenter', filtro.lngCenter);
      }
      if (filtro.opcao > -1) {
        params.set('opcao', filtro.opcao.toString());
        console.log('string: ' + filtro.opcao.toString());
      }

      return this.http.get(`${this.mapaUrl}`, { search: params })
        .toPromise()
        .then(response => {
          const responseJson = response.json();
          const geoJson = responseJson;

          const resultado = {
            geoJson,
            total: responseJson.lenght
          };
          return resultado;
        });
    }


/*
    private url: string = 'assets/dados.geo.json';
    getGeoJson(): Promise<any> {
      return this.http.get(this.url)
        .toPromise()
        .then(response => response.json());
    }
*/

  }
