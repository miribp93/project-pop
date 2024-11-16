package com.guaguaupop.guaguaupop.dto.ad;

import lombok.*;
import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetAdSimpleDTO {

    private Long idAd;
    private String title;
    private Double price;
    private List<byte[]> photos;

}
