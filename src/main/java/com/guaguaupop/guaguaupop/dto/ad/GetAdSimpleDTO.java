package com.guaguaupop.guaguaupop.dto.ad;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.guaguaupop.guaguaupop.dto.user.GetSimpleUserDTO;
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

    @JsonProperty("id_ad")
    private Long idAd;
    private String title;
    private Double price;
    @JsonProperty("type_ad")
    private Set<TypeAd> typeAd;
    private String condition;
    private List<GetAdPhotosDTO> photos;
    private GetSimpleUserDTO creator;

}
