package com.dev.backdev.Auth.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.dev.backdev.Auth.service.UserDetailsServiceImpl;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(authorize -> authorize
                // Public endpoints
                .requestMatchers("/api/public/login/**").permitAll()
                .requestMatchers("/api/demandes/creer/**").permitAll()
                .requestMatchers("/api/enrollments").permitAll()
                .requestMatchers( HttpMethod.POST,"/api/clubs").hasAnyAuthority(  "ROLE_ADMIN")
                .requestMatchers( HttpMethod.PUT,"/api/clubs/*").hasAnyAuthority(  "ROLE_MANAGER")
                .requestMatchers( HttpMethod.DELETE,"/api/clubs/*").hasAnyAuthority(  "ROLE_ADMIN")
                .requestMatchers( HttpMethod.GET,"/api/clubs").permitAll()
                .requestMatchers( HttpMethod.GET,"/api/clubs/*").hasAnyAuthority(  "ROLE_ADMIN","ROLE_MANAGER")
                .requestMatchers( HttpMethod.GET,"/api/clubs/name/*").hasAnyAuthority(  "ROLE_ADMIN","ROLE_MANAGER")
                .requestMatchers("/api/clubs/basic").hasAuthority("ROLE_ADMIN")
                .requestMatchers( "/api/clubs/username/**").hasAnyAuthority("ROLE_MEMBER", "ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers( HttpMethod.PUT,"/api/clubs/*/members").hasAnyAuthority("ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers( HttpMethod.DELETE,"/api/clubs/*/members").hasAnyAuthority("ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers( "/api/clubs/userid/**").hasAnyAuthority("ROLE_MEMBER", "ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers( HttpMethod.PUT,"/api/clubs/*/toggle-enrollment").hasAnyAuthority("ROLE_MANAGER")
                .requestMatchers( "/api/clubs/user/**").hasAnyAuthority("ROLE_MEMBER", "ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers("/api/public/switch-to-manager/**").hasAuthority("ROLE_MEMBER")
                .requestMatchers("/api/public/complete-profile").hasAnyAuthority("ROLE_MEMBER", "ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers("/api/public/register/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers("/api/public/delete-user/**").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/public/users").hasAnyAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/public/users/dto").hasAnyAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/public/users/by-role/*").hasAnyAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/public/users/by-club/*").hasAnyAuthority("ROLE_ADMIN","ROLE_MANAGER")
                .requestMatchers(HttpMethod.GET,"/api/public/users/*").hasAnyAuthority("ROLE_ADMIN","ROLE_MEMBER", "ROLE_MANAGER")
                .requestMatchers(HttpMethod.PUT,"/api/public/users/*").hasAnyAuthority("ROLE_ADMIN","ROLE_MEMBER", "ROLE_MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/public/me").hasAnyAuthority("ROLE_MEMBER", "ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/public/admin-emails").permitAll()
                .requestMatchers("/api/memberships/update-role").hasAuthority("ROLE_MANAGER")
                .requestMatchers("/api/memberships/remove").hasAuthority("ROLE_MANAGER")
                .requestMatchers(HttpMethod.POST,"/api/memberships").hasAnyAuthority("ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers("/api/memberships/getUsers/**").hasAnyAuthority("ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers("/api/memberships/getRole/**").hasAnyAuthority("ROLE_MANAGER", "ROLE_MEMBER", "ROLE_ADMIN")
                .requestMatchers("/api/club-requests/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/demandes").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/demandes").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/demandes/creer/*").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/demandes/*").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/demandes/*/approve").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/demandes/*/reject").hasAuthority("ROLE_ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/enrollments").permitAll()
                .requestMatchers("/api/enrollments/approve/**").hasAuthority("ROLE_MANAGER")
                .requestMatchers("/api/enrollments/reject/**").hasAuthority("ROLE_MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/enrollments").hasAnyAuthority("ROLE_MANAGER","ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/enrollments/club/*").hasAnyAuthority("ROLE_MANAGER","ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/enrollments/*").hasAnyAuthority("ROLE_MANAGER","ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/entretiens").hasAnyAuthority("ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/entretiens/*").hasAnyAuthority("ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.POST,"/api/entretiens").hasAnyAuthority("ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.PUT,"/api/entretiens/*").hasAnyAuthority("ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.DELETE,"/api/entretiens/*").hasAnyAuthority("ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/entretiens/club/*").hasAnyAuthority("ROLE_MANAGER", "ROLE_ADMIN")
                .requestMatchers(HttpMethod.POST,"/api/entretiens/*/creer-compte").hasAnyAuthority( "ROLE_ADMIN")
                .requestMatchers(HttpMethod.GET,"/api/entretiens/*/club-id").hasAnyAuthority( "ROLE_MANAGER","ROLE_ADMIN")
                .requestMatchers("/api/events/**").permitAll()
                .requestMatchers("/api/event-requests/**").permitAll()
                .requestMatchers("/api/feedbacks/**").permitAll()
                .requestMatchers("/api/even").permitAll()
                .requestMatchers("/api/partners/**").permitAll()
                .requestMatchers("/api/clubs/assign/**").permitAll()
                
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .securityContext(securityContext -> securityContext
            .requireExplicitSave(false)  // Important for proper context propagation
        );
        
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder = http
                .getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }
}