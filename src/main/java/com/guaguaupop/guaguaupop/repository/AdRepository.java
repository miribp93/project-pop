package com.guaguaupop.guaguaupop.repository;

import com.guaguaupop.guaguaupop.entity.Ad;
import com.guaguaupop.guaguaupop.entity.TypeAd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {

    List<Ad> findByCategory(String category);

    @Query("SELECT a FROM Ad a JOIN a.typeAd t WHERE t = :typeAd")
    List<Ad> findByTypeAd(@Param("typeAd") TypeAd typeAd);

    List<Ad> findByTypeAdAndCategory(TypeAd typeAd, String category);
}
