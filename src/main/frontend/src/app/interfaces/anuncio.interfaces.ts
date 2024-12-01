// export interface Ad {
//   createdAt: string | number | Date; // ESTA LA HE CREADO PROVISIONALMETE POR QUE NO LA HAY EN LA BBDD
//   idAd: number;
//   category: string;
//   city: string;
//   condition: string;
//   description: string;
//   duration: string;
//   price: number;
//   title: string;
//   id_user: number;
//   photos?: string[];  // Propiedad opcional para fotos
//   typeAd: string;
//   type_ad: string;
// }

// export interface Ad_photo{
//   ad_id_ad: number;
//   photos: string;
// }

// export interface Ad_type{
//   id_ad: number;
//   type_ad: ImageBitmap;
// }

// export enum TipoAnuncio {
//   Producto = 'Producto',
//   Servicio = 'Servicio',
// }

export interface Ad {

  idAd: number;               // Opcional durante la creación
  category: string;
  city: string;
  condition: string;
  description: string;
  duration: string;
  price: number;
  title: string;
  typeAd: string;              // En camelCase para alinearse con el DTO del backend
  type_ad: string;
  id_user?: number;            // Opcional en caso de que no se maneje directamente en el frontend
  photos?: string[];           // Opcional: URLs de las fotos si son retornadas
  createdAt: string | number | Date; // Opcional: Propiedad solo para uso en frontend
}

export interface AdPhoto {
  ad_id_ad: number;
  photos: string;             // Se refiere al enlace o URI de una foto
}

export interface AdType {
  id_ad: number;
  type_ad: string;            // Cambiado de `ImageBitmap` a `string` si solo almacena un tipo
}

export enum TipoAnuncio {
  Producto = 'Producto',
  Servicio = 'Servicio',
}
