package es.daw2.fct_fct.controlador;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import es.daw2.fct_fct.modelo.Empresa;
import es.daw2.fct_fct.servicio.ServicioEmpresa;

@RestController
@RequestMapping("/api/empresas")
public class ControladorEmpresa extends CrudController<Long, Empresa, Empresa, Empresa, ServicioEmpresa> {

    // all ya existe en CrudController

}
