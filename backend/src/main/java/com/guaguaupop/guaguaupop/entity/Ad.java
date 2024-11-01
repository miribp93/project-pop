package com.guaguaupop.guaguaupop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Builder
@Data
@Getter
@Setter
@ToString
@NoArgsConstructor //constructor vacío
@AllArgsConstructor //constructor con todos los parámetros
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
    private String location;

    @Lob
    @Column
    private byte[] photo;

    @Column(nullable = false)
    private int duration;

    @Column(length = 50)
    private String condition;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeAd typeAd;

    @ManyToOne
    @JoinColumn(name = "idUser", referencedColumnName = "idUser")
    private User user;

}
