package com.mediamanager.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.persistence.*;

@Entity
@Table(name = "elementos_multimedia")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_elemento", discriminatorType = DiscriminatorType.STRING)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "tipo")
@JsonSubTypes({
        @JsonSubTypes.Type(value = Cancion.class, name = "CANCION"),
        @JsonSubTypes.Type(value = Video.class, name = "VIDEO"),
        @JsonSubTypes.Type(value = Podcast.class, name = "PODCAST")
})
public abstract class ElementoMultimedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(name = "duracion_minutos", nullable = false)
    private Double duracionMinutos;

    @ManyToOne(optional = false)
    @JoinColumn(name = "canal_id", nullable = false)
    private Canal canal;

    public ElementoMultimedia() {}

    public ElementoMultimedia(String titulo, double duracionMinutos, Canal canal) {
        this.titulo = titulo;
        this.duracionMinutos = duracionMinutos;
        this.canal = canal;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }
    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public double getDuracionMinutos() {
        return duracionMinutos;
    }
    public void setDuracionMinutos(double duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }

    public Canal getCanal() {
        return canal;
    }
    public void setCanal(Canal canal) {
        this.canal = canal;
    }
}
