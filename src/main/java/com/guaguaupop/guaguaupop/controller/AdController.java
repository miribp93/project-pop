package com.guaguaupop.guaguaupop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guaguaupop.guaguaupop.dto.ad.CreateAdDTO;
import com.guaguaupop.guaguaupop.dto.ad.GetAdSimpleDTO;
import com.guaguaupop.guaguaupop.entity.Ad;
import com.guaguaupop.guaguaupop.service.AdService;
import com.guaguaupop.guaguaupop.service.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/ad")
@RequiredArgsConstructor
public class AdController {

    private final AdService adService;

    // CREAR ANUNCIO
    @PostMapping("/create")
    public ResponseEntity<Ad> createAd(
            @RequestPart("ad") String adJson,
            @RequestPart("photos") MultipartFile[] files,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            CreateAdDTO createAdDTO = objectMapper.readValue(adJson, CreateAdDTO.class);
            Ad ad = adService.createAd(createAdDTO, files, userDetails.getIdUser());            return ResponseEntity.ok(ad);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // MODIFICAR ANUNCIO

    // BORRAR ANUNCIO

    // VER ANUNCIOS FILTRADOS
    @GetMapping("/category/{category}")
    public ResponseEntity<List<GetAdSimpleDTO>> getAdsByCategory(
            @PathVariable String category) {
        List<GetAdSimpleDTO> ads = adService.getAdsByCategory(category);
        return ResponseEntity.ok(ads);
    }

    // VER TODOS LOS ANUNCIOS
    @GetMapping("/all")
    public ResponseEntity<List<GetAdSimpleDTO>> getAllAds() {
        List<GetAdSimpleDTO> ads = adService.getAllAds();
        return ResponseEntity.ok(ads);
    }

}