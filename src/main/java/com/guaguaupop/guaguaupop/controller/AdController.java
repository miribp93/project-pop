package com.guaguaupop.guaguaupop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.guaguaupop.guaguaupop.dto.ad.*;
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
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Set;

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
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            CreateAdDTO createAdDTO = objectMapper.readValue(adJson, CreateAdDTO.class);
            Ad ad = adService.createAd(createAdDTO, userDetails.getIdUser());
            return ResponseEntity.ok(ad);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // SUBIR FOTOS
    @PostMapping("/upload-photos/{idAd}")
    public ResponseEntity<?> uploadPhotos(
            @PathVariable Long idAd,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("photos") MultipartFile[] files) {
        try {
            adService.addPhotosToAd(idAd, files, userDetails.getIdUser());
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading photos");
        }
    }

    // OBTENER FOTOS ANUNCIOS
    @GetMapping("/photos/{idAd}")
    public ResponseEntity<GetAdPhotosDTO> getAdPhotos(@PathVariable Long idAd) {
        try {
            GetAdPhotosDTO getAdPhotosDTO = adService.getAdPhotos(idAd);
            return ResponseEntity.ok(getAdPhotosDTO);
        } catch (RuntimeException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

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
            @PathVariable Long idAd){

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

    // USUARIO BORRA UN ANUNCIO PROPIO
    @DeleteMapping("/delete-my-ad/{idAd}")
    public ResponseEntity<Void> deleteAd(
            @PathVariable Long idAd,
            @AuthenticationPrincipal CustomUserDetails userDetails){
        adService.deleteAd(idAd, userDetails.getIdUser());
        return ResponseEntity.ok().build();
    }

    // ACTUALIZAR ANUNCIO
    @PutMapping(value = "/update/{idAd}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateAd(
            @PathVariable Long idAd,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam Optional<String> title,
            @RequestParam Optional<String> description,
            @RequestParam Optional<Double> price,
            @RequestParam Optional<String> category,
            @RequestParam Optional<String> city,
            @RequestParam Optional<Integer> duration,
            @RequestParam Optional<String> condition,
            @RequestParam Optional<Set<TypeAd>> typeAd) {
                if (userDetails == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
                }
                try {
                    UpdateAdDTO updatedAd = new UpdateAdDTO();
                    updatedAd.setTitle(title);
                    updatedAd.setDescription(description);
                    updatedAd.setPrice(price);
                    updatedAd.setCategory(category);
                    updatedAd.setCity(city);
                    updatedAd.setDuration(duration);
                    updatedAd.setCondition(condition);
                    updatedAd.setTypeAd(typeAd);
                    GetAdCompleteDTO ad = adService.updateAd(idAd, userDetails.getIdUser(), updatedAd);
                    return ResponseEntity.ok(ad);
                } catch (Exception e) {
                    e.printStackTrace();
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el anuncio: " + e.getMessage());
                }
    }

}