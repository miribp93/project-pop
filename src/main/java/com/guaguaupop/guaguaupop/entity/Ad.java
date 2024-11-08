package com.guaguaupop.guaguaupop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Builder
@Data
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Ad implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long idAd;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false, length = 100)
    private String city;

    @ElementCollection
    @CollectionTable(name = "adPhotos", joinColumns = @JoinColumn(name = "idAd"))
    @Column(name = "photos", columnDefinition = "BYTEA")
    private List<byte[]> photos = new ArrayList<>();

    @Column(nullable = false)
    private int duration;

    @Column(length = 50)
    private String condition;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "AdTypes", joinColumns = @JoinColumn(name = "idAd"))
    @Column(name = "typeAd")
    private Set<TypeAd> typeAd;

    @ManyToOne
    @JoinColumn(name = "idUser", referencedColumnName = "idUser")
    private User user;

    public static class AdBuilder{
        private Set<TypeAd> typeAds;

        public AdBuilder typeAds(Set<TypeAd> typeAds){
            this.typeAds = typeAds;
            return this;
        }
    }

}
