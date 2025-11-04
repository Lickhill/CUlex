package com.culex.culex.controller;

import com.culex.culex.model.Ad;
import com.culex.culex.service.AdService;
import com.culex.culex.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/api/ads")
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" }, allowCredentials = "true")
public class AdController {

    @Autowired
    private AdService adService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<Ad>> getAllAds() {
        List<Ad> ads = adService.getAllAds();
        return ResponseEntity.ok(ads);
    }

    @GetMapping("/my-ads")
    public ResponseEntity<List<Ad>> getMyAds(@RequestHeader("Authorization") String token) {
        try {
            String email = jwtUtil.getEmailFromToken(token.substring(7));
            List<Ad> userAds = adService.getAdsByUserId(email);
            System.out.println("Fetching ads for User ID: " + email);
            System.out.println("Found " + userAds.size() + " ads for this user");
            return ResponseEntity.ok(userAds);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Ad> createAd(@RequestHeader("Authorization") String token, @RequestBody Ad ad) {
        try {
            String email = jwtUtil.getEmailFromToken(token.substring(7));
            ad.setUserId(email);
            Ad createdAd = adService.createAd(ad);
            return new ResponseEntity<>(createdAd, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/{adId}")
    public ResponseEntity<Void> deleteAd(@RequestHeader("Authorization") String token, @PathVariable String adId) {
        try {
            String email = jwtUtil.getEmailFromToken(token.substring(7));
            boolean deleted = adService.deleteAdByIdAndUserId(adId, email);
            if (deleted) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }

    @PutMapping(value = "/{adId}", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Ad> updateAd(@RequestHeader("Authorization") String token, @PathVariable String adId,
            @RequestBody Ad adUpdate) {
        try {
            String email = jwtUtil.getEmailFromToken(token.substring(7));
            Ad updatedAd = adService.updateAdByIdAndUserId(adId, email, adUpdate);
            if (updatedAd != null) {
                return ResponseEntity.ok(updatedAd);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }
}
