package com.guaguaupop.guaguaupop.dto.ad;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetAdPhotosDTO {

    @JsonProperty("ad_photos")
    private List<byte[]> photos;}
