package com.guaguaupop.guaguaupop.dto.ad;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.guaguaupop.guaguaupop.dto.user.GetSimpleUserDTO;
import com.guaguaupop.guaguaupop.entity.TypeAd;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Set;

@Builder
@Data
public class GetAdCompleteDTO {

    @JsonProperty("id_ad")
    private Long idAd;
    private String title;
    private String description;
    private Double price;
    private String category;
    private String city;
    private int duration;
    private String condition;
    @JsonProperty("type_ad")
    private Set<TypeAd> typeAd;
    private GetSimpleUserDTO creator;
    private List<GetAdPhotosDTO> photos;
}
