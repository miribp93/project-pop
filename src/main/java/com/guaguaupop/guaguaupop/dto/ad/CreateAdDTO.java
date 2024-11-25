package com.guaguaupop.guaguaupop.dto.ad;

import com.guaguaupop.guaguaupop.entity.TypeAd;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;
import java.util.Set;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAdDTO {

    @NotBlank(message = "Este campo no puede estar en blanco")
    private String title;

    @Size(max = 500, message = "Este campo no puede estar en blanco")
    private String description;

    @NotNull(message = "Este campo no puede estar en blanco")
    private Double price;

    @NotBlank(message = "Este campo no puede estar en blanco")
    private String category;

    @NotBlank(message = "Este campo no puede estar en blanco")
    private String city;

    private int duration;

    private String condition;

    @NotNull(message = "Señale uno")
    private TypeAd typeAd;

    private List<byte[]> photos;
}