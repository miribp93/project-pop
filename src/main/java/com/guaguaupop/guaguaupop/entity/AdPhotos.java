package com.guaguaupop.guaguaupop.entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class AdPhotos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_photo", nullable = false, updatable = false)
    private Long idPhoto;

    @Lob
    @Column(name = "photos", columnDefinition = "BYTEA")
    private byte[] photos;

    @ManyToOne
    @JoinColumn(name = "id_ad", referencedColumnName = "id_ad")
    private Ad ad;
}
