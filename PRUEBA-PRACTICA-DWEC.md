# Documentación prueba práctica DWEC

He creado dos componentes: 

1. Componente card-miembro

Es el componente hijo que define los datos del miembro, es standalone para evitar usar NgModule. Dentro importa los archivos y utiliza @Input para miembro, para que el componente padre le envíe los datos de miembro para que este lo utilice. No utiliza lógica propia.

2. Componente lista-miembros (page/miembros)

Es el componente que define los estilos que va a seguir la estructura de la lista (grid). Por facilidades está contenido en page/miembros por que me permite más flexibilidad en la obtención de los datos y de esta manera centralizo también los servicios para su obtención. Dentro se injectan todos los servicios que se utilizan mediante inject() y se utilizan propiedades con signals para optimizar las actualizaciones de renderizado.


La página donde se encuentran esos componentes y donde se visualiza la funcionalidad se define el enrutamiento en las rutas del grupo en mi-grupo.routes: 

```
{
    path: "miembros",
    loadComponent: () => import("../miembros/miembros").then(m => m.Miembros),
    title: "Miembros",
    data: { breadcrumb: "Miembros" }
  },
```

Lo hice en las rutas de mi grupo porque es una página que se utiliza en la página de grupo y el link (routerLink) se define concretamente en las opciones de navegación del sidebar de grupo:
```
<li class="barra-lateral__menu-item">
	<a routerLink="/grupo/miembros" routerLinkActive="barra-lateral__menu-enlace--activo" [routerLinkActiveOptions]="{ exact: true }" class="barra-lateral__menu-enlace">
	<span class="barra-lateral__menu-icono"><span [feather]="'users'" [tipo]="'submenu'"></span></span>
	<span class="barra-lateral__menu-texto">Miembros</span>
	</a>
</li>
```


He utilizado la página angular.dev