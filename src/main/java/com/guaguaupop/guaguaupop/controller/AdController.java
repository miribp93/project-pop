package com.guaguaupop.guaguaupop.controller;

import com.guaguaupop.guaguaupop.dto.ad.CreateAdDTO;
import com.guaguaupop.guaguaupop.entity.Ad;
import com.guaguaupop.guaguaupop.service.AdService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/api/ad")
@RequiredArgsConstructor
public class AdController {

    private final AdService adService;

    // CREAR ANUNCIO
    @PostMapping("/create")
    public ResponseEntity<Ad> createAd(@ModelAttribute CreateAdDTO createAdDTO,
                                       @RequestParam("files") MultipartFile[] files) {
        try { Ad ad = adService.createAd(createAdDTO, files);
            return new ResponseEntity<>(ad, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // SUBIR FOTOS A ANUNCIO

    // MODIFICAR ANUNCIO

    // BORRAR ANUNCIO
}