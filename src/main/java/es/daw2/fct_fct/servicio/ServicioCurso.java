package es.daw2.fct_fct.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.Curso;
import es.daw2.fct_fct.repositorio.RepositorioCurso;


@Service
public class ServicioCurso implements IFServicioCurso {

    @Autowired
    RepositorioCurso repositorioCurso;

    @Override
    public List<Curso> listaCursos() {
        return (List<Curso>) repositorioCurso.findAll();
    }

    @Override
    public Curso addCurso(Curso c) {
        return repositorioCurso.save(c);
    }

    @Override
    public Optional<Curso> getCursoId(Long id) {
        return repositorioCurso.findById(id);
    }

    @Override
    public boolean borrarCurso(Long id) {
        Optional<Curso> cursoOptional = repositorioCurso.findById(id);

        if (cursoOptional.isPresent()) {
            repositorioCurso.delete(cursoOptional.get());
            return true;
        }
        return false;
    }
}
