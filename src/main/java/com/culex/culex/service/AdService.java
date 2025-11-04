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

    public List<Ad> getAdsByUserId(String userId) {
        return adRepository.findByUserId(userId);
    }

    public Ad createAd(Ad ad) {
        ad.setCreatedAt(LocalDateTime.now());
        return adRepository.save(ad);
    }

    public boolean deleteAdByIdAndUserId(String adId, String userId) {
        try {
            Ad ad = adRepository.findById(adId).orElse(null);
            if (ad != null && ad.getUserId().equals(userId)) {
                adRepository.deleteById(adId);
                return true;
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    public Ad updateAdByIdAndUserId(String adId, String userId, Ad adUpdate) {
        try {
            Ad existingAd = adRepository.findById(adId).orElse(null);
            if (existingAd != null && existingAd.getUserId().equals(userId)) {
                // Update the fields
                existingAd.setName(adUpdate.getName());
                existingAd.setDescription(adUpdate.getDescription());
                existingAd.setAddress(adUpdate.getAddress());
                existingAd.setPhoneNumber(adUpdate.getPhoneNumber());

                // Save and return the updated ad
                return adRepository.save(existingAd);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}
