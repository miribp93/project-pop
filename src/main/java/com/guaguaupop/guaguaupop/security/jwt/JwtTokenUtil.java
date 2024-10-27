package com.guaguaupop.guaguaupop.security.jwt;

import com.guaguaupop.guaguaupop.entity.User;
import com.guaguaupop.guaguaupop.exception.InvalidTokenException;
import com.guaguaupop.guaguaupop.service.CustomUserDetails;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.java.Log;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
@Log
public class JwtTokenUtil{

    public static final String TOKEN_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer";
    public static final String TOKEN_TYPE = "JWT";

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.token-expiration}")
    private Integer jwtExpirationTime;

    //Generar TOKEN
    public String generateToken(Authentication auth) {
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        Date tokenExpirationDate = new Date(System.currentTimeMillis() + (jwtExpirationTime * 1000));
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .signWith(key, SignatureAlgorithm.HS512)
                .setHeaderParam("type", TOKEN_TYPE)
                .setSubject(Long.toString(userDetails.getIdUser()))  // Almacenar userId
                .setIssuedAt(new Date())
                .setExpiration(tokenExpirationDate)
                .compact();
    }




    //Obtener username del token
    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8)))
                .parseClaimsJws(token)
                .getBody();
        return Long.parseLong(claims.getSubject());
    }

   /* public Long getUserIdFromJWT(String token){
        Claims claims = Jwts.parser()
                .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes()))
                .parseClaimsJws(token)
                .getBody();
        return Long.parseLong(claims.getSubject());
    }*/

    //Validar TOKEN
    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8))).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            log.info("Error en la firma del token JWT: " + ex.getMessage());
            throw new InvalidTokenException("Error en la firma del token de sesión, vuelve a iniciar sesión.");
        } catch (MalformedJwtException ex) {
            log.info("Token mal formado: " + ex.getMessage());
            throw new InvalidTokenException("Token mal formado, vuelve a iniciar sesión.");
        } catch (ExpiredJwtException ex) {
            log.info("El token ha expirado: " + ex.getMessage());
            throw new InvalidTokenException("El token ha expirado, vuelve a iniciar sesión.");
        } catch (UnsupportedJwtException ex) {
            log.info("Token JWT no soportado: " + ex.getMessage());
            throw new InvalidTokenException("Token de sesión no soportado, vuelve a iniciar sesión.");
        } catch (IllegalArgumentException ex) {
            log.info("JWT claims vacío");
            throw new InvalidTokenException("JWT claims vacío, vuelve a iniciar sesión.");

        }}

}
