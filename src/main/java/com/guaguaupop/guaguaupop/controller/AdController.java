package com.guaguaupop.guaguaupop.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.guaguaupop.guaguaupop.dto.ad.*;
import com.guaguaupop.guaguaupop.entity.Ad;
import com.guaguaupop.guaguaupop.entity.AdPhotos;
import com.guaguaupop.guaguaupop.entity.TypeAd;
import com.guaguaupop.guaguaupop.repository.PhotoAdRepository;
import com.guaguaupop.guaguaupop.service.AdService;
import com.guaguaupop.guaguaupop.service.CustomUserDetails;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
@Data
@RestController
@RequestMapping("/api/ad")
public class AdController {

    private final AdService adService;
    private final PhotoAdRepository photoAdRepository;
    private final ObjectMapper objectMapper;

    // CREAR ANUNCIO
    @PostMapping("/create")
    public ResponseEntity<?> createAd(
            @RequestBody CreateAdDTO createAdDTO,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Ad ad = adService.createAd(createAdDTO, userDetails.getIdUser());
            return ResponseEntity.ok(ad);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    //CREAR ANUNCIO Ivan
    @PostMapping(value = "/create1", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createAd1(
            @RequestPart("createAdDTO") String createAdDTOJson,
            @RequestPart(value = "photos", required = false) MultipartFile[] files,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            CreateAdDTO createAdDTO = objectMapper.readValue(createAdDTOJson, CreateAdDTO.class);
            if (files != null) {
                for (MultipartFile file : files) {
                    if (file.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Empty file uploaded");
                    }
                    if (!isValidFileType(file)) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file type uploaded");
                    }
                }
            }
            // Crear el anuncio
            Ad ad = adService.createAd(createAdDTO, userDetails.getIdUser());
            // Agregar las fotos al anuncio
            if (files != null && files.length > 0) {
                adService.addPhotosToAd(ad.getIdAd(), files, userDetails.getIdUser());
            }
            return ResponseEntity.ok(ad);

        } catch (IOException e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading photos: " + e.getMessage());

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + e.getMessage());
        }
    }

    // SUBIR FOTOS
    @PostMapping("/upload-photos/{idAd}")
    public ResponseEntity<?> uploadPhotos(
            @PathVariable Long idAd,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("photos") MultipartFile[] files) {
        try {
            for (MultipartFile file : files) {
                if (file.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Empty file uploaded");
                }
                if (!isValidFileType(file)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file type uploaded");
                }
            }
            adService.addPhotosToAd(idAd, files, userDetails.getIdUser());
            return ResponseEntity.ok().body("Photos uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading photos");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    private boolean isValidFileType(MultipartFile file) {
        String fileType = file.getContentType();
        return fileType != null && (fileType.equals("image/jpeg") || fileType.equals("image/png"));
    }

    //Ivan2
    @GetMapping("/photo/ad/{idAd}")
    public ResponseEntity<?> getAdPhoto (
            @PathVariable Long idAd) {
        AdPhotos photos = photoAdRepository.getReferenceById(idAd);
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(photos.getPhotos());
    }

    // OBTENER FOTOS ANUNCIOS
    @GetMapping("/photos/{idAd}")
    public ResponseEntity<List<GetAdPhotosDTO>> getAdPhotos(
            @PathVariable Long idAd) {
        try {
            List<GetAdPhotosDTO> getAdPhotosDTOList = adService.getAdPhotos(idAd);
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(getAdPhotosDTOList);
        } catch (RuntimeException e) { return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
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
    @PutMapping(value = "/update/{idAd}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateAd(
            @PathVariable Long idAd,
            @RequestPart("updateAdDTO") String updateAdDTOJson,
            @RequestPart(value = "photos", required = false) MultipartFile[] files,
            @AuthenticationPrincipal CustomUserDetails userDetails
            ) {
                if (userDetails == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
                }
        try {
            UpdateAdDTO updateAdDTO = objectMapper.readValue(updateAdDTOJson, UpdateAdDTO.class);

            if (files != null && files.length > 0) {
                try {

                    photoAdRepository.deleteByAd_IdAd(idAd);
                    adService.addPhotosToAd(idAd, files, userDetails.getIdUser());

                } catch (IOException e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error subiendo fotos: " + e.getMessage());
                }
            }
            GetAdCompleteDTO ad = adService.updateAd(idAd, userDetails.getIdUser(), updateAdDTO);
            return ResponseEntity.ok(ad);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error subiendo fotos: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el anuncio: " + e.getMessage());
        }
    }

    //BUSCAR ANUNCIOS POR KEYWORD
    @GetMapping("/search")
    public ResponseEntity<?> searchAds(
            @RequestParam("keyword") String keyword){

        try{
            List<GetAdSimpleDTO> ads = adService.searchAds(keyword);
            return ResponseEntity.ok(ads);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ocurrió un error inesperado.");
        }
    }
}