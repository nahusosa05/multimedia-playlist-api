package com.mediamanager.model;

import jakarta.persistence.*;

@Entity
@Table(name = "canales")
public class Canal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    private Integer suscriptores;

    public Canal() {}

    public Canal(String nombre, Integer suscriptores) {
        this.nombre = nombre;
        this.suscriptores = suscriptores;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getSuscriptores() {
        return suscriptores;
    }
    public void setSuscriptores(int suscriptores) {
        this.suscriptores = suscriptores;
    }
}
