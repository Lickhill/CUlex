package com.culex.culex.service;

import com.culex.culex.model.Ad;
import com.culex.culex.repository.AdRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdService {

    @Autowired
    private AdRepository adRepository;

    public List<Ad> getAllAds() {
        return adRepository.findAll();
    }

    public Ad createAd(Ad ad) {
        ad.setCreatedAt(LocalDateTime.now());
        return adRepository.save(ad);
    }
}
