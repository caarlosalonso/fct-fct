package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import es.daw2.fct_fct.modelo.Curso;

public interface IFServicioCurso {

    public List<Curso> listaCursos();
    public Curso addCurso(Curso c);
    public Optional<Curso> getCursoId(Long id);
    public boolean borrarCurso(Long id);
}
