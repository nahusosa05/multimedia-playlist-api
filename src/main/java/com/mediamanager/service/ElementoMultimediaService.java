package com.mediamanager.service;

import com.mediamanager.model.*;
import com.mediamanager.repository.CanalRepository;
import com.mediamanager.repository.ElementoMultimediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ElementoMultimediaService {

    @Autowired
    private ElementoMultimediaRepository multimediaRepository;

    @Autowired
    private CanalRepository canalRepository;

    public List<ElementoMultimedia> listarTodos() {
        return multimediaRepository.findAll();
    }

    public Optional<ElementoMultimedia> buscarPorId(Long id) {
        return multimediaRepository.findById(id);
    }

    public ElementoMultimedia guardar(ElementoMultimedia elemento) {
        Long canalId = (elemento.getCanal() != null) ? elemento.getCanal().getId() : null;
        if (canalId == null) {
            throw new IllegalArgumentException("Debe especificar el ID de un canal existente.");
        }
        Canal canal = canalRepository.findById(canalId)
                .orElseThrow(() -> new IllegalArgumentException("No existe un canal con el ID: " + canalId));

        elemento.setCanal(canal);
        return multimediaRepository.save(elemento);
    }

    public Optional<ElementoMultimedia> actualizar(Long id, ElementoMultimedia datosNuevos) {
        return multimediaRepository.findById(id).map(existente -> {
            existente.setTitulo(datosNuevos.getTitulo());
            existente.setDuracionMinutos(datosNuevos.getDuracionMinutos());

            if (existente instanceof Cancion c && datosNuevos instanceof Cancion cNueva) {
                c.setAlbum(cNueva.getAlbum());
            } else if (existente instanceof Video v && datosNuevos instanceof Video vNuevo) {
                v.setCalidad(vNuevo.getCalidad());
            } else if (existente instanceof Podcast p && datosNuevos instanceof Podcast pNuevo) {
                p.setNumeroEpisodio(pNuevo.getNumeroEpisodio());
            }

            return multimediaRepository.save(existente);
        });
    }

    public boolean eliminar(Long id) {
        if (multimediaRepository.existsById(id)) {
            multimediaRepository.deleteById(id);
            return true;
        }
        return false;
    }
}