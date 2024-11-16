package com.guaguaupop.guaguaupop.dto.ad;

import com.guaguaupop.guaguaupop.entity.TypeAd;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Set;

@Builder
@Data
public class GetAdCompleteDTO {

    private Long idAd;
    private String title;
    private String description;
    private Double price;
    private String category;
    private String city;
    private int duration;
    private String condition;
    private Set<TypeAd> typeAd;
    private List<byte[]> photos;
}
