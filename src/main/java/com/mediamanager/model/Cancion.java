package com.mediamanager.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("CANCION")
public class Cancion extends ElementoMultimedia {
    private String album;

    public Cancion() {}
    public Cancion(String titulo, Double duracionMinutos, Canal canal, String album) {
        super(titulo, duracionMinutos, canal);
        this.album = album;
    }

    public String getAlbum() { return album; }
    public void setAlbum(String album) { this.album = album; }
}
