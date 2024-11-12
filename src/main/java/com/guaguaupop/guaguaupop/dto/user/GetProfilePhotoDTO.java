package com.guaguaupop.guaguaupop.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetProfilePhotoDTO {

    @JsonProperty("profile_photo")
    private byte [] profilePhoto;
}
