package com.guaguaupop.guaguaupop.service;

import com.guaguaupop.guaguaupop.dto.ad.CreateAdDTO;
import com.guaguaupop.guaguaupop.dto.ad.GetAdSimpleDTO;
import com.guaguaupop.guaguaupop.entity.Ad;
import com.guaguaupop.guaguaupop.entity.User;
import com.guaguaupop.guaguaupop.exception.UserNotExistsException;
import com.guaguaupop.guaguaupop.repository.AdRepository;
import com.guaguaupop.guaguaupop.repository.UserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdService {

    private final AdRepository adRepository;
    private final UserRepository userRepository;

    // Definición de las categorías disponibles
    @Getter
    private final Set<String> categories = Set.of(
            "Perros", "Gatos", "Aves", "Reptiles", "Conejos / Cobayas", "Animales Exóticos", "Otros Animales"
    );


    // CREAR ANUNCIO
    public Ad createAd(CreateAdDTO createAdDTO, MultipartFile[] files, Long idUser) throws IOException {
        List<byte[]> photos = new ArrayList<>();
        for (MultipartFile file : files) {
            photos.add(file.getBytes());
        }

        User user = userRepository.findById(idUser).orElseThrow(UserNotExistsException::new);
        Ad ad = Ad.builder()
                .title(createAdDTO.getTitle())
                .price(createAdDTO.getPrice())
                .category(createAdDTO.getCategory())
                .description(createAdDTO.getDescription())
                .city(createAdDTO.getCity())
                .typeAd(Collections.singleton(createAdDTO.getTypeAd()))
                .condition(createAdDTO.getCondition())
                .duration(createAdDTO.getDuration())
                .photos(photos)
                .user(user)
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
    public List<GetAdSimpleDTO> getAdsByCategory(String category) {
        List<Ad> ads = adRepository.findByCategory(category);
        return ads.stream()
                .map(this::toGetAdSimpleDTO)
                .collect(Collectors.toList());
    }

    // OBTENER TODOS LOS ANUNCIOS
    public List<GetAdSimpleDTO> getAllAds() {
        List<Ad> ads = adRepository.findAll();
        return ads.stream()
                .map(this::toGetAdSimpleDTO)
                .collect(Collectors.toList());
    }
        //Convertir Ad a AdSimpleDTO
        private GetAdSimpleDTO toGetAdSimpleDTO(Ad ad){
            return GetAdSimpleDTO.builder()
                    .title(ad.getTitle())
                    .photos(ad.getFirstPhoto())
                    .price(ad.getPrice())
                    .build();
        }
}


