package es.daw2.fct_fct.dto;

public record CreateEmpresaDTO(String nombre, String cif, String email, String sector, String address, String phone, String persona_contacto, Boolean hay_convenio, String observaciones) {

}
