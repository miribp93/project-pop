package com.guaguaupop.guaguaupop.repository;

import com.guaguaupop.guaguaupop.dto.ad.GetAdSimpleDTO;
import com.guaguaupop.guaguaupop.entity.Ad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
    List<Ad> findByCategory(String category);
}
