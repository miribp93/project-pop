package com.guaguaupop.guaguaupop.service;

import com.guaguaupop.guaguaupop.dto.ad.CreateAdDTO;
import com.guaguaupop.guaguaupop.dto.ad.GetAdCompleteDTO;
import com.guaguaupop.guaguaupop.dto.ad.GetAdSimpleDTO;
import com.guaguaupop.guaguaupop.entity.Ad;
import com.guaguaupop.guaguaupop.entity.TypeAd;
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

    //Convertir Ad a AdSimpleDTO
    private GetAdSimpleDTO toGetAdSimpleDTO(Ad ad){
        return GetAdSimpleDTO.builder()
                .idAd(ad.getIdAd())
                .title(ad.getTitle())
                .photos(ad.getFirstPhoto())
                .price(ad.getPrice())
                .build();
    }

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

    // OBTENER TODOS LOS ANUNCIOS POR TIPO DE ANUNCIO : PRODUCT / SERVICE
    public List<GetAdSimpleDTO> getAllByTypeAd(TypeAd typeAd){
        List<Ad> ads = adRepository.findByTypeAd(typeAd);
        return ads.stream()
                .map(this::toGetAdSimpleDTO)
                .collect(Collectors.toList());
    }

    // OBTENER TODOS LOS ANUNCIOS POR TIPO Y CATEGORIA
    public List<GetAdSimpleDTO> getAllByTypeAdAndCategory(TypeAd typeAd, String category) {
        List<Ad> ads = adRepository.findByTypeAdAndCategory(typeAd, category);
        return ads.stream()
                .map(this::toGetAdSimpleDTO)
                .collect(Collectors.toList());
    }


    // OBTENER DATOS COMPLETOS ANUNCIO
    public GetAdCompleteDTO getAdComplete(Long idAd){
        Ad ad = adRepository.findById(idAd).orElseThrow(()->new RuntimeException("No se puede abrir el anuncio"));
        return GetAdCompleteDTO.builder()
                .idAd(ad.getIdAd())
                .title(ad.getTitle())
                .duration(ad.getDuration())
                .description(ad.getDescription())
                .condition(ad.getCondition())
                .price(ad.getPrice())
                .typeAd(ad.getTypeAd())
                .photos(ad.getPhotos())
                .category(ad.getCategory())
                .city(ad.getCity())
                .build();
    }

    // BORRAR ANUNCIO POR ID
    public void deleteById(Long idAd){
        adRepository.deleteById(idAd);
    }

    // USUARIO BORRA SU ANUNCIO
    public void deleteAd(Long idAd, Long idUser){
        Ad ad = adRepository.findById(idAd).orElseThrow(()->new RuntimeException("No se puede abrir el anuncio"));
        if (!ad.getUser().getIdUser().equals(idUser)){
            throw new RuntimeException("No tienes permiso para borrar el anuncio");
        }
        adRepository.delete(ad);
    }


    // MIS ANUNCIOS --(usuario ve sus anuncios)
    public List<GetAdSimpleDTO> getMyAds(Long idUser){
            List<Ad> ads = adRepository.findByUserIdUser(idUser);
            return ads.stream()
                    .map(this::toGetAdSimpleDTO)
                    .collect(Collectors.toList());
    }




}


