package com.guaguaupop.guaguaupop.dto.user;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetProfilePhotoDTO {

    private String photoBase64;
}
