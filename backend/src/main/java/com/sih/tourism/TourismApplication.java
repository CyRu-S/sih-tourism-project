package com.sih.tourism;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableCaching
@EnableFeignClients
public class TourismApplication {

    public static void main(String[] args) {
        
        SpringApplication.run(TourismApplication.class, args);

        System.out.println("Tourism Application is Running...");
    }
}
