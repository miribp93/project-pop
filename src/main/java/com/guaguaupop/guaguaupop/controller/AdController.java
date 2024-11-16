package com.guaguaupop.guaguaupop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guaguaupop.guaguaupop.dto.ad.CreateAdDTO;
import com.guaguaupop.guaguaupop.dto.ad.GetAdCompleteDTO;
import com.guaguaupop.guaguaupop.dto.ad.GetAdSimpleDTO;
import com.guaguaupop.guaguaupop.entity.Ad;
import com.guaguaupop.guaguaupop.entity.TypeAd;
import com.guaguaupop.guaguaupop.service.AdService;
import com.guaguaupop.guaguaupop.service.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

    // FILTRAR ANUNCIOS POR TYPE_AD : PRODUCT / SERVICE
    @GetMapping("/type/{typeAd}")
    public ResponseEntity<List<GetAdSimpleDTO>>getAdsByTypeAd(
            @PathVariable TypeAd typeAd){
        List<GetAdSimpleDTO> ads = adService.getAllByTypeAd(typeAd);
        return ResponseEntity.ok(ads);
    }

    // FILTRAR ANUNCIOS POR TYPE_AD y CATEGORIA
    @GetMapping("/type/{typeAd}/category/{category}")
    public ResponseEntity<List<GetAdSimpleDTO>> getAdsByTypeAdAndCategory(
            @PathVariable TypeAd typeAd,
            @PathVariable String category) {
        List<GetAdSimpleDTO> ads = adService.getAllByTypeAdAndCategory(typeAd, category);
        return ResponseEntity.ok(ads);
    }

    // VER ANUNCIO COMPLETO
    @GetMapping("/complete/{idAd}")
    public ResponseEntity<GetAdCompleteDTO> getAdComplete(
            @PathVariable Long idAd,
            @AuthenticationPrincipal CustomUserDetails userDetails){

        if (userDetails == null){
            return ResponseEntity.status(401).build();
        }
        GetAdCompleteDTO ad = adService.getAdComplete(idAd);
        return ResponseEntity.ok(ad);
    }

    // BORRAR ANUNCIO
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @DeleteMapping("/delete/{idAd}")
    public ResponseEntity<?> deleteById(@PathVariable Long idAd) {

        adService.deleteById(idAd);
        return ResponseEntity.noContent().build();
    }

    // MIS ANUNCIOS --(usuario ve sus anuncios)
    @GetMapping("/myads")
    public ResponseEntity<List<GetAdSimpleDTO>> getMyAds(
            @AuthenticationPrincipal CustomUserDetails userDetails){
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        Long idUser = userDetails.getIdUser();
        List<GetAdSimpleDTO> ads = adService.getMyAds(idUser);
        return ResponseEntity.ok(ads);
    }








}