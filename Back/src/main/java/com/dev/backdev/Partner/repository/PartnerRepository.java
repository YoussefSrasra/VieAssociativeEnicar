package com.dev.backdev.Partner.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.dev.backdev.Partner.model.Partner;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
}