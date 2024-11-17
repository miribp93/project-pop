package com.guaguaupop.guaguaupop.dto.ad;

import com.guaguaupop.guaguaupop.entity.TypeAd;
import lombok.Data;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Data
public class UpdateAdDTO {

    private Optional<String> title;
    private Optional<String> description;
    private Optional<Double> price;
    private Optional<String> category;
    private Optional<String> city;
    private Optional<Integer> duration;
    private Optional<String> condition;
    private Optional<Set<TypeAd>> typeAd;
    private Optional<List<byte[]>> photos;
}
