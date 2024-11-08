package com.guaguaupop.guaguaupop.service;

import com.guaguaupop.guaguaupop.dto.ad.CreateAdDTO;
import com.guaguaupop.guaguaupop.entity.Ad;
import com.guaguaupop.guaguaupop.repository.AdRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdService {

    private final AdRepository adRepository;

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

}


//SUBIR FOTOS DEL ANUNCIO
    /*public void uploadAdPhotos(Long adId, MultipartFile[] files) throws IOException {

        Ad ad = adRepository.findById(adId)
                .orElseThrow(AdNotExistsException::new);

        List<byte[]> photos = new ArrayList<>();
        for (MultipartFile file : files) {
            photos.add(file.getBytes());
        }
        ad.setPhotos(photos.toArray(new byte[0][])); // BLOB array
        adRepository.save(ad);
    }*/

// GET FOTOS DE ANUNCIO



