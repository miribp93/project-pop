export interface Anuncio {
  id: number;
  nombre: string;
  descripcion: string;
  tipo_animal: string;
  tipo_anuncio: TipoAnuncio;
  precio: number;
  img: string;
}

export interface Ad {
  idAd: number;
  category: string;
  city: string;
  condition: string;
  description: string;
  duration: string;
  price: number;
  title: string;
  id_user: number;
  photos?: Ad_photo[];  // Propiedad opcional para fotos
  type?: Ad_type;
}

export interface Ad_photo{
  ad_id_ad: number;
  photos: string;
}

export interface Ad_type{
  id_ad: number;
  type_ad: ImageBitmap;
}

export enum TipoAnuncio {
  Producto = 'Producto',
  Servicio = 'Servicio',
}
