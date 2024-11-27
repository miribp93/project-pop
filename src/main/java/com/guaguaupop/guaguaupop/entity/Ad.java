package com.guaguaupop.guaguaupop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Ad implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name= "id_ad", nullable = false, updatable = false)
    private Long idAd;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(nullable = false, length = 100)
    private String city;

    @OneToMany(mappedBy = "ad", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<AdPhotos> photos = new ArrayList<>();

    @Column(name = "duration")
    private int duration;

    @Column(length = 50, name = "condition")
    private String condition;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "ad_types", joinColumns = @JoinColumn(name = "id_ad"))
    @Column(name = "type_ad")
    private Set<TypeAd> typeAd;

    @ManyToOne
    @JoinColumn(name = "id_user", referencedColumnName = "id_user")
    private User user;

    public static class AdBuilder{
        private Set<TypeAd> typeAds;

        public AdBuilder typeAds(Set<TypeAd> typeAds){
            this.typeAds = typeAds;
            return this;
        }
    }


}
