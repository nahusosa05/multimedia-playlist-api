package com.mediamanager.controller;

import com.mediamanager.model.Canal;
import com.mediamanager.service.CanalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/canales")
@CrossOrigin(origins = "*")
public class CanalController {
    @Autowired
    private CanalService canalService;

    @GetMapping
    public List<Canal> listar() {
        return canalService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Canal> obtenerPorId(@PathVariable Long id) {
        return canalService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Canal> crear(@RequestBody Canal canal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(canalService.guardar(canal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Canal> actualizar(@PathVariable Long id, @RequestBody Canal canal) {
        return canalService.actualizar(id, canal)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            if (canalService.eliminar(id)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }
}