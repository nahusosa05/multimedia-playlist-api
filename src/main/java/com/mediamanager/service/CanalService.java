package com.mediamanager.service;

import com.mediamanager.model.Canal;
import com.mediamanager.model.ElementoMultimedia;
import com.mediamanager.repository.CanalRepository;
import com.mediamanager.repository.ElementoMultimediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CanalService {
    @Autowired
    private CanalRepository canalRepository;

    @Autowired
    private ElementoMultimediaRepository multimediaRepository;

    public List<Canal> listarTodos() {
        return canalRepository.findAll();
    }

    public Optional<Canal> buscarPorId(Long id) {
        return canalRepository.findById(id);
    }

    public Canal guardar(Canal canal) {
        return canalRepository.save(canal);
    }

    public Optional<Canal> actualizar(Long id, Canal datosNuevos) {
        return canalRepository.findById(id).map(canal -> {
            canal.setNombre(datosNuevos.getNombre());
            canal.setSuscriptores(datosNuevos.getSuscriptores());
            return canalRepository.save(canal);
        });
    }

    public boolean eliminar(Long id) {
        if (!canalRepository.existsById(id)) {
            return false;
        }

        if (multimediaRepository.existsByCanalId(id)) {
            throw new IllegalStateException("No se puede eliminar el canal porque tiene asociados en la playlist.");
        }

        canalRepository.deleteById(id);
        return true;
    }
}
