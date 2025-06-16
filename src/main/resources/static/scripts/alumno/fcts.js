import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'fcts-section';

window.addEventListener('DOMContentLoaded', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchEmpresas(),
        fetchFCTs(),
        fetchCursos(),
        fetchCursoActual()
    ])
    .then(([
        empresas,
        fcts,
        cursos,
        cicloLectivoActual
    ]) => {
        build(empresas, fcts, cursos, cicloLectivoActual);
    }).catch((error) => {
        console.error('Error al obtener la información:', error);
    });
}

async function fetchEmpresas() {
    const response = await fetch('/api/vista-empresas-plazas/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener las empresas');
    return await response.json();
}

async function fetchFCTs() {
    const response = await fetch('/api/fcts/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los FCT');
    return await response.json();
}

async function fetchCursos() {
    const response = await fetch('/api/cursos/alumno');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los cursos');
    return await response.json();
}

async function fetchCursoActual() {
    const response = await fetch('/api/ciclos-lectivos/actual');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener los ciclos lectivos');
    return await response.json();
}

function build(empresas, fcts, cursos, cicloLectivoActual) {
    console.log('Empresas:', empresas);
    console.log('FCTs:', fcts);
    console.log('Cursos:', cursos);
    console.log('CicloLectivoActual:', cicloLectivoActual);

    const section = document.getElementById(SECTION);
    if (!section) {
        console.error(`No se encontró la sección con ID: ${SECTION}`);
        return;
    }
    while(section.firstChild) section.removeChild(section.firstChild);
    if (cursos.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No hay cursos disponibles.';
        section.appendChild(message);
        return;
    }

    cursos.forEach((curso) => {
        const cursoDiv = document.createElement('div');
        cursoDiv.classList.add('curso');
        section.appendChild(cursoDiv);

        const cursoTitle = document.createElement('p');
        cursoTitle.textContent = `${curso.grupo.numero}º de ${curso.grupo.ciclo.acronimo} - ${curso.grupo.cicloLectivo.nombre}`;
        cursoTitle.classList.add('title');
        cursoDiv.appendChild(cursoTitle);

        const filteredFCT = fcts.find(fct => fct.curso.id === curso.id);
        console.log("FCT Filtrada: ", filteredFCT);
        if (! filteredFCT) {
            const cursoNoFCT = document.createElement('p');
            cursoNoFCT.textContent = `No tuviste FCT este ciclo.`;
            cursoNoFCT.classList.add('text');
            cursoDiv.appendChild(cursoNoFCT);
            return;
        }

        if (filteredFCT.motivoRenuncia) {
            const renunciaFCT = document.createElement('p');
            renunciaFCT.textContent = `Renunciaste a las FCT, tu motivo de renuncia fue: ${filteredFCT.motivoRenuncia}`;
            renunciaFCT.classList.add('text', 'renuncia');
            cursoDiv.appendChild(renunciaFCT);
            return;
        }

        const fctEmpresa = document.createElement('p');
        fctEmpresa.textContent = `La empresa de tus FCT es: ${filteredFCT.empresa.nombre}`;
        fctEmpresa.classList.add('text', 'empresa');
        cursoDiv.appendChild(fctEmpresa);

        const fechas = document.createElement('p');
        fechas.textContent = `Desde ${filteredFCT.fechaInicio} hasta ${filteredFCT.fechaFin}`;
        fechas.classList.add('text', 'fechas');
        cursoDiv.appendChild(fechas);

        const horasHechas = document.createElement('p');
        horasHechas.textContent = `Es un total de ${filteredFCT.horasPracticas} horas.`;
        horasHechas.classList.add('text', 'horas');
        cursoDiv.appendChild(horasHechas);

        const reviewDiv = document.createElement('div');
        reviewDiv.classList.add('review', 'collapsed');
        reviewDiv.id = `review-${filteredFCT.id}`;
        cursoDiv.appendChild(reviewDiv);

        const reviewHeader = document.createElement('p');
        reviewHeader.textContent = 'Reseña de la FCT';
        reviewHeader.classList.add('review-header');
        reviewDiv.appendChild(reviewHeader);

        const formDiv = document.createElement('div');
        formDiv.innerHTML = `
            <form id="review-form-${filteredFCT.empresa.id}">
                <div class="inputs form-container">
                    <div class="instance form-input grouped-inputs">
                        <div class="form-group form-input">
                            <input type="number" name="score" id="score-${filteredFCT.empresa.id}" class="text-based input" label="Introduce su puntuación" data-show-validity="true" data-required="true" data-min="1" data-max="5" data-step="1">
                        </div>
                        <div class="form-group form-input">
                            <input type="text" name="comment" id="comment-${filteredFCT.empresa.id}" class="text-based input" label="Introduce tu comentario">
                        </div>
                    </div>
                </div>
            </form>
        `;
        reviewDiv.appendChild(formDiv);
    });

    const forms = document.querySelectorAll(`form`);
    forms.forEach(form => {
        new Form(form).init();

        const formulario = Form.getForm(form.id);

        const id = form.id.split('-')[2];

        formulario.onsubmit = () => {
            const puntuacion = formulario.getInput(`score-${id}`);
            const comentario = formulario.getInput(`comment-${id}`);

            const data = {
                empresaId: id,
                puntuacion: puntuacion.getValue(),
                comentario: comentario.getValue()
            }

            fetch('/api/reviews/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then((response) => {
                if (response.ok || response.status === 201) {
                    formulario.reset();
                    formulario.showSuccess('Reseña enviada correctamente.');
                } else {
                    formulario.showError('Error al enviar la reseña. Inténtalo de nuevo más tarde.');
                }
            }).catch((error) => {
                formulario.showError('Error al enviar la reseña. Inténtalo de nuevo más tarde.');
            })
            .finally(() => {
                formulario.submitFinish();
            });
        };
    });
}
