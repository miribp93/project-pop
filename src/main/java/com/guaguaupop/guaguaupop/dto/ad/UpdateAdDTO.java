package com.guaguaupop.guaguaupop.dto.ad;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.guaguaupop.guaguaupop.entity.TypeAd;
import lombok.Data;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Data
public class UpdateAdDTO {

    private Optional<String> title = Optional.empty();
    private Optional<String> description = Optional.empty();
    private Optional<Double> price = Optional.empty();
    private Optional<String> category = Optional.empty();
    private Optional<String> city = Optional.empty();
    private Optional<Integer> duration = Optional.empty();
    private Optional<String> condition = Optional.empty();
    @JsonProperty("type_ad")
    private Optional<Set<TypeAd>> typeAd = Optional.empty();
    private Optional<List<byte[]>> photos = Optional.empty();
}
