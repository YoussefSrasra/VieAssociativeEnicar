package com.dev.backdev.Partner.repository;

import com.dev.backdev.Partner.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    // JpaRepository offre déjà de nombreuses méthodes CRUD
}