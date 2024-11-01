package com.guaguaupop.guaguaupop.repository;

import com.guaguaupop.guaguaupop.entity.Ad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdRepository extends JpaRepository<Ad, Long> {
}
