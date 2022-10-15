package com.alectraining.ecomm.config;

import com.alectraining.ecomm.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.Stack;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
    //inject the property from application.properties
    @Value("${allowed.origins}")
    private String[] myAllowedOrigins;

    private EntityManager entityManager;


    @Autowired
    public MyDataRestConfig(EntityManager myEntityManager){
        this.entityManager = myEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions = {HttpMethod.POST,HttpMethod.PUT,HttpMethod.DELETE, HttpMethod.PATCH};
        //disable HTTP METHODS for Product: PUT POST DELETE
        disableHttpMethods(Product.class, config, theUnsupportedActions);
        //disable HTTP METHODS for ProductCategory: PUT POST DELETE
        disableHttpMethods(ProductCategory.class,config, theUnsupportedActions);
        //disable HTTP Methods for Country, and State: PUT POST DELETE
        disableHttpMethods(Country.class,config,theUnsupportedActions);
        disableHttpMethods(State.class, config, theUnsupportedActions);
        disableHttpMethods(Order.class, config, theUnsupportedActions);
        exposeIds(config);
        //configure coors mapping
        cors.addMapping(config.getBasePath()+"/**").allowedOrigins(myAllowedOrigins);
    }

    private void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metadata, httpMethods)-> httpMethods.disable(theUnsupportedActions))
                .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedActions)));
    }

    private void exposeIds(RepositoryRestConfiguration config){
        // this method exposes the entity ids so we can use them
        // Get a list of all entity classes from the entityManager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        //Create an array of the entity types
        List<Class> entityClasses = new ArrayList<>();

        //get the entity types for the entities
        for (EntityType tempEntityType: entities){
            entityClasses.add(tempEntityType.getJavaType());
        }
        // expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
