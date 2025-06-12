package es.daw2.fct_fct.servicio.vistas;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import es.daw2.fct_fct.modelo.vistas.VistaEmpresaTutor;
import es.daw2.fct_fct.repositorio.vistas.VistaEmpresaTutorRepository;

@Service
public class VistaEmpresaTutorService {

    @Autowired
    private VistaEmpresaTutorRepository repository;

    public Iterable<VistaEmpresaTutor> listarTodos() {
        return repository.findAll();
    }

    public java.util.Optional<VistaEmpresaTutor> buscarPorId(Long empresaId) {
        return repository.findById(empresaId);
    }
}
