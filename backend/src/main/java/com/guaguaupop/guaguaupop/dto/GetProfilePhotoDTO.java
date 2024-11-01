package com.guaguaupop.guaguaupop.dto;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetProfilePhotoDTO {

    private byte [] profilePhoto;
}
