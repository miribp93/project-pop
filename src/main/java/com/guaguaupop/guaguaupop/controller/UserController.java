package com.guaguaupop.guaguaupop.controller;

import com.guaguaupop.guaguaupop.dto.*;
import com.guaguaupop.guaguaupop.entity.User;
import com.guaguaupop.guaguaupop.exception.EmailAlreadyExistsException;
import com.guaguaupop.guaguaupop.exception.NewUserWithDifferentPasswordsException;
import com.guaguaupop.guaguaupop.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserDTOConverter userDTOConverter;

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody CreateUserDTO createUserDTO) {
        try {
            User user = userService.createUser(createUserDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (NewUserWithDifferentPasswordsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<GetUserDTOAdmin> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userDTOConverter.convertUserToGetUserDTOProfile(user));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal User user) {
        this.userService.deleteById(user.getIdUser());
        return ResponseEntity.noContent().build();
    }

    /*
    @GetMapping("/myAds")
    public ResponseEntity<Page<AdDTO>> myProducts(@AuthenticationPrincipal User user, Pageable pageable) {
        Page<AdDTO> myProducts = (this.productService.findByUser(user, pageable))
                .map(product -> adDTOConverter.convertToGetProduct(product, user));
        return ResponseEntity.ok().body(myProducts);
    }

    @GetMapping("/products")
    public ResponseEntity<Page<AdDTO>> otherProducts(@AuthenticationPrincipal User user, Pageable pageable) {
        Page<AdDTO> products = (this.productService.findOthers(user, pageable))
                .map(product -> adDTOConverter.convertToGetProduct(product, product.getUser()));
        return ResponseEntity.ok().body(products);
    }*/
}
