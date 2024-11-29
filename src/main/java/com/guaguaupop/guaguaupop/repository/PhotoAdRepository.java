package com.guaguaupop.guaguaupop.repository;

import com.guaguaupop.guaguaupop.entity.Ad;
import com.guaguaupop.guaguaupop.entity.AdPhotos;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PhotoAdRepository extends JpaRepository<AdPhotos, Long> {
    List<AdPhotos> findByAd(Ad ad);
    @Transactional
    void deleteByAd_IdAd(Long idAd);
}
