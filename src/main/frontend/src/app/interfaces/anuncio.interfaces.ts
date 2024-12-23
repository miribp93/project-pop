export interface Creator {
  id_user: number;             // ID del usuario creador
  email: string;               // Email del creador
  username: string;            // Nombre de usuario
  profile_photo?: string;      // Foto de perfil (opcional)
}

export interface Ad {
  id?: number
  idAd?: number;
  id_ad: number;               // Opcional durante la creación
  category: string;
  city: string;
  condition: string;
  description: string;
  duration: string;
  price: number;
  title: string;
  typeAd: string;
  type_ad: string;             // En camelCase para alinearse con el DTO del backend
  id_user?: number;            // Opcional en caso de que no se maneje directamente en el frontend
  photos?: string[];           // Opcional: URLs de las fotos si son retornadas
  createdAt: string | number | Date; // Opcional: Propiedad solo para uso en frontend
  creator?: Creator;           // Información del creador del anuncio
}

export interface AdPhoto {
  ad_id_ad: number;
  photos: string;              // Se refiere al enlace o URI de una foto
}

export interface AdType {
  id_ad: number;
  type_ad: string;             // Cambiado de `ImageBitmap` a `string` si solo almacena un tipo
}

export enum TipoAnuncio {
  Producto = 'Producto',
  Servicio = 'Servicio',
}
