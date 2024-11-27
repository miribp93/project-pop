package com.guaguaupop.guaguaupop.dto.ad;

import com.guaguaupop.guaguaupop.entity.TypeAd;
import lombok.*;
import java.util.List;
import java.util.Set;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetAdSimpleDTO {

    private Long idAd;
    private String title;
    private Double price;
    private Set<TypeAd> typeAd;
    private String condition;
    private List<GetAdPhotosDTO> photos;

}
