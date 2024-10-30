export interface Anuncio {
  id:           number;
  nombre:       string;
  descripcion:  string;
  tipo_animal:  string;
  tipo_anuncio: TipoAnuncio;
  precio:       number;
  img:          string;
}

export enum TipoAnuncio {
  Producto = "Producto",
  Servicio = "Servicio",
}
