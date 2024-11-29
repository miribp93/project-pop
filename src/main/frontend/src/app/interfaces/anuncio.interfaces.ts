export interface Ad {
  createdAt: string | number | Date;
  idAd: number;
  id_ad: number;
  category: string;
  city: string;
  condition: string;
  description: string;
  duration: number;
  price: number;
  title: string;
  id_user: number;
  photos?: string[] | null ;
  type_ad: string;
}

export interface Ad_photo {
  id_photo: number;
  photos: string; // URL de la foto
}
