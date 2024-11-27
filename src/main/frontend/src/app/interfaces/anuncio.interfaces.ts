export interface Ad {
  createdAt: string | number | Date; // ESTA LA HE CREADO PROVISIONALMETE POR QUE NO LA HAY EN LA BBDD
  idAd: number;
  category: string;
  city: string;
  condition: string;
  description: string;
  duration: string;
  price: number;
  title: string;
  id_user: number;
  photos?: string[];  // Propiedad opcional para fotos
  typeAd: string;
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
