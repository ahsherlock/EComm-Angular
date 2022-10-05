package com.alectraining.ecomm.dao;

import com.alectraining.ecomm.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {
    //Use Query Method given by SPRING REST and DATA JPA
    Page<Product> findByCategoryId(@Param("id")Long id, Pageable pageable);
    Page<Product>findByNameContaining(@Param("name")String name, Pageable pageable);
}
