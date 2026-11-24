package com.mediamanager.repository;

import com.mediamanager.model.ElementoMultimedia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElementoMultimediaRepository extends JpaRepository<ElementoMultimedia, Long>{
    boolean existsByCanalId(Long canalId);
}
