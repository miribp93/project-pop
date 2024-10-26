package com.guaguaupop.guaguaupop.security.jwt;

import com.guaguaupop.guaguaupop.exception.AuthorizationException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import com.guaguaupop.guaguaupop.service.CustomUserDetailsService;
import java.io.IOException;

@RequiredArgsConstructor
@Component
@Log
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        try {
            String token = getTokenFromRequest(request);

            if (StringUtils.hasText(token) && jwtTokenUtil.validateToken(token)) {

                Long idUser = jwtTokenUtil.getUserIdFromJWT(token);

                User user = (User) customUserDetailsService.loadUserById(idUser);
                UsernamePasswordAuthenticationToken authentication
                        = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }

        }catch(CannotCreateTransactionException e){
            log.info("No se pudo crear la transacción: " + e.getMessage());
            AuthorizationException.handleAuthorizationException(response, e, HttpStatus.UNAUTHORIZED);
        }


        filterChain.doFilter(request, response);
    }

    public String getTokenFromRequest(HttpServletRequest request){

        String bearerToken = request.getHeader(JwtTokenUtil.TOKEN_HEADER);

        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith((JwtTokenUtil.TOKEN_PREFIX))){
            return bearerToken.substring(JwtTokenUtil.TOKEN_PREFIX.length(), bearerToken.length());
        }
        return null;
    }

}
