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
}
