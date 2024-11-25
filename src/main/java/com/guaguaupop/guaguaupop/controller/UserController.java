package com.guaguaupop.guaguaupop.controller;

import com.guaguaupop.guaguaupop.dto.user.*;
import com.guaguaupop.guaguaupop.entity.User;
import com.guaguaupop.guaguaupop.entity.UserRole;
import com.guaguaupop.guaguaupop.exception.EmailAlreadyExistsException;
import com.guaguaupop.guaguaupop.exception.NewUserWithDifferentPasswordsException;
import com.guaguaupop.guaguaupop.service.AdService;
import com.guaguaupop.guaguaupop.service.CustomUserDetails;
import com.guaguaupop.guaguaupop.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserDTOConverter userDTOConverter;
    private final AdService adService;

    // Registrar al MANAGER
    @PostMapping("/register-manager")
    public ResponseEntity<?> registerManager(@RequestBody CreateUserDTO createUserDTO) {
        try {
            User user = userService.registerManager(createUserDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (EmailAlreadyExistsException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (NewUserWithDifferentPasswordsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    // REGISTRAR A UN USUARIO
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

    // OBTENER DATOS DE USUARIO Y VISUALIZAR PERFIL
    @GetMapping("/profile")
    public ResponseEntity<GetUserDTOAdmin> me(@AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Convertir CustomUserDetails a User
        User user = userService.findById(userDetails.getIdUser())
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        return ResponseEntity.ok(userDTOConverter.convertUserToGetUserDTOProfile(user));
    }

    // BORRAR USUARIO
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal CustomUserDetails  userDetails) {

        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<User> userOptional = userService.findById(userDetails.getIdUser());
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        User user = userOptional.get();
        adService.deleteAdsByUser(user);
        userService.deleteById(userDetails.getIdUser());
        return ResponseEntity.noContent().build();
    }

    // EL ADMINISTRADOR BORRA A UN USUARIO POR ID (NO LOGUEADO)
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUserById(@PathVariable Long id) {
        if (!userService.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // EL ADMINISTRADOR ASIGNA ROLES A LOS USUARIOS
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMINISTRATOR')")
    @PostMapping("/{idUser}/roles")
    public ResponseEntity<Void> assignRoleToUser(
            @PathVariable Long idUser,
            @RequestBody Map<String, String> request) {
        String roleName = request.get("role");
        UserRole role = UserRole.valueOf(roleName.toUpperCase());
        userService.assignRoleToUser(idUser, role);
        return ResponseEntity.ok().build();
    }

    // ACTUALIZAR DATOS PERSONALES DEL USUARIO
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateUserDTO updateUserDTO) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
        }

        if (updateUserDTO.getPassword().isPresent() &&
                !updateUserDTO.getPassword().get().equals(updateUserDTO.getPassword2().get())) {
            return ResponseEntity.badRequest().body("Las contraseñas no coinciden");
        }

        try {
            User updatedUser = userService.updateUser(userDetails.getIdUser(), updateUserDTO);
            GetUserDTOAdmin userResponse = userDTOConverter.convertUserToGetUserDTOProfile(updatedUser);
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al actualizar el usuario: " + e.getMessage());
        }
    }

    // SUBIR LA FOTO DE PERFIL
    @PostMapping("/upload-profile-photo")
    public ResponseEntity<?> uploadProfilePhoto(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam("file") MultipartFile file) {

        if (userDetails == null) {

            log.warn("Usuario no autenticado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
        }

        try {

            log.info("Uploading profile photo for user: {}", userDetails.getUsername());
            userService.uploadProfilePhoto(userDetails.getIdUser(), file);
            log.info("Profile photo uploaded for user: {}", userDetails.getUsername());
            return ResponseEntity.ok("Foto de perfil actualizada correctamente");

        } catch (Exception e) {

            log.error("Error al subir la foto de perfil: {}", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al subir la foto de perfil: " + e.getMessage());
        }
    }

    // GET FOTO DE PERFIL
    @GetMapping("/profile-photo")
    public ResponseEntity<?> getProfilePhoto(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null) {
            log.warn("Usuario no autenticado");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
        }

        try {
            log.info("Retrieving profile photo for user: {}", userDetails.getUsername());
            GetProfilePhotoDTO photoDTO = userService.getProfilePhoto(userDetails.getIdUser());
            if (photoDTO.getProfilePhoto() == null) {
                log.warn("Foto de perfil no encontrada para usuario: {}", userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Foto de perfil no encontrada");
            }
            log.info("Profile photo retrieved for user: {}", userDetails.getUsername());
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(photoDTO.getProfilePhoto());

        } catch (Exception e) {

            log.error("Error al obtener la foto de perfil: {}", e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al obtener la foto de perfil: " + e.getMessage());
        }
    }

    // LISTAR USUARIOS EN VISTA ADMIN
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @GetMapping("/all")
    public ResponseEntity<List<GetUserDTOAdmin>> getAllUsers() {
        List<GetUserDTOAdmin> users = userService.findAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(users);
    }

    // BLOQUEAR USUARIO
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @PutMapping("block/{idUser}")
    public ResponseEntity<?> blockUser(
            @PathVariable Long idUser) {

        try{

            userService.blockUser(idUser);
            return ResponseEntity.ok("Usuario bloqueado.");

        }catch (Exception e){

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se puede bloquear a este usuario.");
        }
    }

    // DESBLOQUEAR USUARIO
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @PutMapping("unblock/{idUser}")
    private ResponseEntity<?> unblockUser(
            @PathVariable Long idUser){

        try{

            userService.unblockUser(idUser);
            return ResponseEntity.ok("Usuario desbloqueado.");

        }catch (Exception e){

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se puede bloquear a este usuario.");
        }
    }

    // QUITAR ROLE USUARIO
    @PreAuthorize("hasRole('ADMINISTRATOR') or hasRole('MANAGER')")
    @PutMapping("quitroleuser/{idUser}")
    private ResponseEntity<?> quitRoleUser(
            @PathVariable Long idUser){

        try{

            userService.quitRoleUser(idUser);
            return ResponseEntity.ok("Role borrado.");

        }catch (Exception e){

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("No se puede cambiar a este usuario.");
        }
    }


    /*@PostMapping("/block/{id}")
    public ResponseEntity<?> blockUser(@PathVariable Long id,
        @RequestParam int durationMinutes) {

        try { userService.blockUser(id, durationMinutes);
        return ResponseEntity.ok("User blocked successfully for " +
        durationMinutes + " minutes");
        } catch (Exception e) {
        return ResponseEntity.status(500).body("Error blocking user: " + e.getMessage());
        }
    }*/




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

