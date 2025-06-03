package es.daw2.fct_fct.servicio;

import java.util.List;

import es.daw2.fct_fct.modelo.CicloLectivo;

public interface IFServicioCicloLectivo {
    
    public List<CicloLectivo> listarCiclosLectivos();
    public CicloLectivo addCicloLectivo(CicloLectivo cicloLectivo);
    public CicloLectivo getCicloLectivoId(Long cicloLectivoId);
    public boolean borrarCicloLectivo(Long cicloLectivoId);
}
