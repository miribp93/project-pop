import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SearchResultsComponent } from './search-results.component';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importa HttpClientTestingModule
import { AdService } from '../../services/ad.service'; // Asegúrate de importar correctamente el servicio
import { of } from 'rxjs';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchResultsComponent,
        HttpClientTestingModule, // Importa HttpClientTestingModule para pruebas
      ],
      providers: [
        AdService, // Proveedor explícito del servicio AdService
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }), // Simulación de parámetros de ruta
            queryParams: of({ search: 'test' }), // Simulación de parámetros de consulta
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
