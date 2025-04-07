package com.dev.backdev.Partner.service;


import com.dev.backdev.Partner.model.*;
import com.dev.backdev.Partner.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PartnerService {

    @Autowired
    private PartnerRepository partnerRepository;

    public List<Partner> getAllPartners() {
        return partnerRepository.findAll();
    }

    public Optional<Partner> getPartnerById(Long id) {
        return partnerRepository.findById(id);
    }

    public Partner createPartner(Partner partner) {
        return partnerRepository.save(partner);
    }

    public Partner updatePartner(Long id, Partner partnerDetails) {
        Partner partner = partnerRepository.findById(id).orElseThrow(() -> new RuntimeException("Partner not found"));
        partner.setName(partnerDetails.getName());
        partner.setType(partnerDetails.getType());
        partner.setContact(partnerDetails.getContact());
        partner.setPhone(partnerDetails.getPhone());
        partner.setSince(partnerDetails.getSince());
        partner.setDetails(partnerDetails.getDetails());
        return partnerRepository.save(partner);
    }

    public void deletePartner(Long id) {
        Partner partner = partnerRepository.findById(id).orElseThrow(() -> new RuntimeException("Partner not found"));
        partnerRepository.delete(partner);
    }
}