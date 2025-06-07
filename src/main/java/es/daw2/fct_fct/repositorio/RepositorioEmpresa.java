package es.daw2.fct_fct.repositorio;

import org.springframework.data.repository.CrudRepository;

import es.daw2.fct_fct.modelo.Empresa;

public interface RepositorioEmpresa extends CrudRepository<Empresa, Long> {
   

}
