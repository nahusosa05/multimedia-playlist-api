package com.mediamanager.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("VIDEO")
public class Video extends ElementoMultimedia {
    private String calidad;

    public Video() {}
    public Video(String titulo, Double duracionMinutos, Canal canal, String calidad) {
        super(titulo, duracionMinutos, canal);
        this.calidad = calidad;
    }

    public String getCalidad() { return calidad; }
    public void setCalidad(String calidad) { this.calidad = calidad; }
}