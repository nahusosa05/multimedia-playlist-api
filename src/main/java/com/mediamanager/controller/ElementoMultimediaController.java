package com.mediamanager.controller;

import com.mediamanager.model.ElementoMultimedia;
import com.mediamanager.service.ElementoMultimediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contenidos")
@CrossOrigin(origins = "*")
public class ElementoMultimediaController {

    @Autowired
    private ElementoMultimediaService multimediaService;

    @GetMapping
    public List<ElementoMultimedia> listar() {
        return multimediaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElementoMultimedia> obtenerPorId(@PathVariable Long id) {
        return multimediaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ElementoMultimedia elemento) {
        try {
            ElementoMultimedia guardado = multimediaService.guardar(elemento);
            return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ElementoMultimedia> actualizar(@PathVariable Long id, @RequestBody ElementoMultimedia elemento) {
        return multimediaService.actualizar(id, elemento)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (multimediaService.eliminar(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}