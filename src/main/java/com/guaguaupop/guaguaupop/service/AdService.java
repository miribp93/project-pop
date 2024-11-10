package com.guaguaupop.guaguaupop.service;

import com.guaguaupop.guaguaupop.dto.ad.CreateAdDTO;
import com.guaguaupop.guaguaupop.entity.Ad;
import com.guaguaupop.guaguaupop.repository.AdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdService {

    private final AdRepository adRepository;

    // Definición de las categorías disponibles
    private final Set<String> categories = Set.of(
            "Perros", "Gatos", "Aves", "Reptiles", "Conejos / Cobayas", "Animales Exóticos", "Otros Animales"
    );

    public Set<String> getCategories() {
        return categories;
    }


    // CREAR ANUNCIO
    public Ad createAd(CreateAdDTO createAdDTO, MultipartFile[] files) throws IOException {
        List<byte[]> photos = new ArrayList<>();
        for (MultipartFile file : files) {
            photos.add(file.getBytes());
        }

        Ad ad = Ad.builder()
                .title(createAdDTO.getTitle())
                .price(createAdDTO.getPrice())
                .category(createAdDTO.getCategory())
                .description(createAdDTO.getDescription())
                .city(createAdDTO.getCity())
                .typeAd(Collections.singleton(createAdDTO.getTypeAd()))
                .condition(createAdDTO.getCondition())
                .duration(createAdDTO.getDuration())
                .photos(photos) // Usar la lista de bytes
                .build();

        Ad savedAd = adRepository.save(ad);
        log.info("Anuncio guardado correctamente: {}", savedAd);
        return savedAd;
    }

    /*//SUBIR FOTOS DEL ANUNCIO
    public void uploadAdPhotos(Long adId, MultipartFile[] files) throws IOException {

        Ad ad = adRepository.findById(adId)
                .orElseThrow(AdNotExistsException::new);

        List<byte[]> photos = new ArrayList<>();
        for (MultipartFile file : files) {
            photos.add(file.getBytes());
        }
        ad.setPhotos(photos.toArray(new byte[0][])); // BLOB array
        adRepository.save(ad);
    }

    // GET FOTOS DE ANUNCIO
    public List<byte[]> getAdPhotos(Long adId) {
    Ad ad = adRepository.findById(adId) .orElseThrow(()
            -> new AdNotExistsException("El anuncio no existe"));
    return ad.getPhotos();
    }*/

    // OBTENER ANUNCIOS POR FILTRADO DE CATEGORIA
    public List<Ad> getAdsByCategory(String category) {
        return adRepository.findByCategory(category); }
}


