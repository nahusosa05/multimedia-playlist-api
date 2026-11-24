package com.mediamanager.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("PODCAST")
public class Podcast extends ElementoMultimedia {
    @Column(name = "numero_episodio")
    private Integer numeroEpisodio;

    public Podcast() {}
    public Podcast(String titulo, Double duracionMinutos, Canal canal, Integer numeroEpisodio) {
        super(titulo, duracionMinutos, canal);
        this.numeroEpisodio = numeroEpisodio;
    }

    public Integer getNumeroEpisodio() { return numeroEpisodio; }
    public void setNumeroEpisodio(Integer numeroEpisodio) { this.numeroEpisodio = numeroEpisodio; }
}