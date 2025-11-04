package com.culex.culex.repository;

import com.culex.culex.model.Ad;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdRepository extends MongoRepository<Ad, String> {
    List<Ad> findByUserId(String userId);
}
