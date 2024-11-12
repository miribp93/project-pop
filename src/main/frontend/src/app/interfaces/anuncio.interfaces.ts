export interface Anuncio {
  id:           number;
  nombre:       string;
  descripcion:  string;
  tipo_animal:  string;
  tipo_anuncio: TipoAnuncio;
  precio:       number;
  img:          string;
}

export interface ad {
  id_ad: number;
category: string;
city: string;
contition:string;
description: string;
duration: string;
price: number;
title: string;
id_user: number;
}

export enum TipoAnuncio {
  Producto = "Producto",
  Servicio = "Servicio",
}
