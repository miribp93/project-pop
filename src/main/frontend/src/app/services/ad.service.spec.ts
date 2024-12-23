import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AdService } from './ad.service';
import { Ad } from '../interfaces/anuncio.interfaces';
import { HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';

describe('AdService', () => {
  let service: AdService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdService,
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AdService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no queden solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllAds', () => {
    it('should fetch all ads', () => {
      const mockAds: Ad[] = [
        {
          id: 1, title: 'Ad 1', description: 'Description 1', price: 100,
          id_ad: 0,
          category: '',
          city: '',
          condition: '',
          duration: '',
          typeAd: '',
          type_ad: '',
          createdAt: ''
        },
        {
          id: 2, title: 'Ad 2', description: 'Description 2', price: 200,
          id_ad: 0,
          category: '',
          city: '',
          condition: '',
          duration: '',
          typeAd: '',
          type_ad: '',
          createdAt: ''
        },
      ];

      service.getAllAds().subscribe((ads) => {
        expect(ads).toEqual(mockAds);
      });

      const req = httpMock.expectOne('/api/ad/all');
      expect(req.request.method).toBe('GET');
      req.flush(mockAds); // Simula la respuesta del servidor
    });

    it('should return empty array on error', () => {
      service.getAllAds().subscribe((ads) => {
        expect(ads).toEqual([]);
      });

      const req = httpMock.expectOne('/api/ad/all');
      req.flush('Error occurred', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getAdsByCategory', () => {
    it('should fetch ads by category', () => {
      const mockAds: Ad[] = [
        {
          id: 1, title: 'Ad 1', description: 'Description 1', price: 100,
          id_ad: 0,
          category: '',
          city: '',
          condition: '',
          duration: '',
          typeAd: '',
          type_ad: '',
          createdAt: ''
        },
      ];

      const category = 'electronics';
      service.getAdsByCategory(category).subscribe((ads) => {
        expect(ads).toEqual(mockAds);
      });

      const req = httpMock.expectOne(`/api/ad/category/${category}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAds); // Simula la respuesta del servidor
    });

    it('should return empty array on error', () => {
      const category = 'electronics';
      service.getAdsByCategory(category).subscribe((ads) => {
        expect(ads).toEqual([]);
      });

      const req = httpMock.expectOne(`/api/ad/category/${category}`);
      req.flush('Error occurred', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getAdById', () => {
    it('should fetch an ad by ID', () => {
      const mockAd: Ad = {
        id_ad: 1,  // Usando id_ad en lugar de id
        category: 'Gato',
        city: 'madrid',
        condition: 'nuevo',
        description: 'jaula canario',
        duration: '1 ',
        price: 100,
        title: 'jaula',
        typeAd: 'PRODUCT',
        type_ad: 'PRODUCT',
        createdAt: new Date(),
      };


      const adId = 1;
      service.getAdById(adId).subscribe((ad) => {
        expect(ad).toEqual(mockAd);
      });

      const req = httpMock.expectOne(`/api/ad/id/${adId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAd); // Simula la respuesta del servidor
    });

    it('should return undefined on error', () => {
      const adId = 1;
      service.getAdById(adId).subscribe((ad) => {
        expect(ad).toBeUndefined();
      });

      const req = httpMock.expectOne(`/api/ad/id/${adId}`);
      req.flush('Error occurred', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('createAd', () => {
    it('should create an ad with files', () => {
      const mockAd: Ad = {
        id_ad: 1,  // Usando id_ad en lugar de id
        category: 'Gato',
        city: 'nuevo York',
        condition: 'Nuevo',
        description: 'jaula canario',
        duration: '1 ',
        price: 100,
        title: 'jaula',
        typeAd: 'PRODUCT',
        type_ad: 'PRODUCT',
        createdAt: new Date(),
      };

      const files: File[] = [new File([''], 'image1.jpg')];

      spyOn(localStorage, 'getItem').and.returnValue('mockToken'); // Simula el token

      service.createAd(mockAd, files).subscribe((ad) => {
        expect(ad).toEqual(mockAd);
      });

      const req = httpMock.expectOne('/api/ad/create1');
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
      expect(req.request.body.has('createAdDTO')).toBeTrue();
      expect(req.request.body.has('photos')).toBeTrue();
      req.flush(mockAd); // Simula la respuesta del servidor
    });
  });

  describe('deleteAd', () => {
    it('should delete an ad by ID', () => {
      const adId = 1;

      spyOn(localStorage, 'getItem').and.returnValue('mockToken'); // Simula el token

      service.deleteAd(adId).subscribe(() => {
        // Asegúrate de que el método haya sido llamado
        expect(true).toBeTrue();
      });

      const req = httpMock.expectOne(`/api/ad/delete-my-ad/${adId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mockToken');
      req.flush({}); // Simula la respuesta del servidor
    });
  });

  describe('searchAds', () => {
    it('should search ads by keyword', () => {
      const mockAds: Ad[] = [
        {
          id: 1,
          title: 'Ad 1',
          description: 'Perro',
          price: 100,
          id_ad: 0,
          category: '',
          city: '',
          condition: '',
          duration: 'perro',
          typeAd: '',
          type_ad: '',
          createdAt: ''
        },
      ];
      const keyword = 'perro';

      service.searchAds(keyword).subscribe((ads) => {
        expect(ads).toEqual(mockAds);
      });

      const req = httpMock.expectOne(`api/ad/search?keyword=${encodeURIComponent(keyword)}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAds); // Simula la respuesta del servidor
    });
  });


});
