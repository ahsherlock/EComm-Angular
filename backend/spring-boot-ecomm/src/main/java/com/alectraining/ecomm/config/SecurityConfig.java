package com.alectraining.ecomm.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http.authorizeRequests(configurer ->
                                configurer.antMatchers("/api/orders/**").authenticated())
                                .oauth2ResourceServer()
                                .jwt();
        //add CORS filters
        http.cors();
        // add content negotiation strat
        http.setSharedObject(ContentNegotiationStrategy.class, new HeaderContentNegotiationStrategy());

        // force a non-empty response body for 401 errors to make the response more friendly
        Okta.configureResourceServer401ResponseBody(http);

        //disable CSRF since we arent using cookies for session tracking
        http.csrf().disable();

        return http.build();
    }
}
