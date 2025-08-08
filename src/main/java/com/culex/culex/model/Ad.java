package com.culex.culex.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ads")
public class Ad {
    @Id
    private String id;
    private String name;
    private String description;
    private String address;
    private String phoneNumber;
    private String userId; // To link the ad to the user who posted it
    private LocalDateTime createdAt;
}
