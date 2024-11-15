package com.guaguaupop.guaguaupop.entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.util.Collections;
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

    @Column(name = "category", nullable = false)
    private String category;

    @Column(nullable = false, length = 100)
    private String city;

    @ElementCollection
    @Column(name = "photos", columnDefinition = "BYTEA")
    private List<byte[]> photos;

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
    @JoinColumn(name = "id_user", referencedColumnName = "id_user")
    private User user;

    public static class AdBuilder{
        private Set<TypeAd> typeAds;

        public AdBuilder typeAds(Set<TypeAd> typeAds){
            this.typeAds = typeAds;
            return this;
        }
    }

    public List<byte[]> getFirstPhoto(){

        if (photos != null && !photos.isEmpty()){
            return Collections.singletonList(photos.getFirst());
        }
        return Collections.singletonList(new byte[0]);
    }

    @Override public String toString() {
        return "Ad{" + "idAd=" + idAd + ", " +
                "title='" + title + '\'' + ", " +
                "description='" + description + '\'' + ", " +
                "price=" + price + ", " +
                "category='" + category + '\'' + ", " +
                "city='" + city + '\'' + ", " +
                "duration=" + duration + ", " +
                "condition='" + condition + '\'' + ", " +
                "city='" + city + '\'' + ", " +
                "user=" + (user != null ? user.getIdUser() : null) + '}';
    }

}
