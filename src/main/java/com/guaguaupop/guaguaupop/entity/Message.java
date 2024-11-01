package com.guaguaupop.guaguaupop.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Builder
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, updatable = false)
    private Long idMessage;

    @Column(nullable = false)
    private String content;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date timestamp;

    /*@ManyToOne
    @JoinColumn(name = "idSender", referencedColumnName = "idSender")
    private User sender;

    @ManyToOne
    @JoinColumn(name = "idReceiver", referencedColumnName = "idReceiver")
    private User receiver;*/
}

