import { Lancamento } from './../model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { LogoutService } from './../../seguranca/logout.service';
import { ErrorHandlerService } from './../error-handler.service';
import { AuthService } from './../../seguranca/auth.service';
import { MenuItem } from 'primeng/components/common/menuitem';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  items: MenuItem[];

  constructor(
    public auth: AuthService,
    private logoutService: LogoutService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Opções',
        items: [
          {
            label: 'Lançamentos',
            routerLink: '/lancamentos',
            visible: this.auth.temPermissao('ROLE_PESQUISAR_LANCAMENTO')
          },
          {
            label: 'Pessoas',
            routerLink: '/pessoas',
            visible: this.auth.temPermissao('ROLE_PESQUISAR_PESSOA')
          },
          {
            label: 'Mapas',
            routerLink: '/geo',
            visible: this.auth.temPermissao('ROLE_PESQUISAR_MAPA')
          },
        ]
      }
    ];
  }

  temPermissao(menu: string): boolean {
    return this.auth.temPermissao('ROLE_PESQUISAR_LANCAMENTO');
  }

  logout() {
    this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
