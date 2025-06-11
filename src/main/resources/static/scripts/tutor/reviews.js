import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'curso-actual';

window.addEventListener('DOMContentLoaded', (event) => {
    promise();
});

function promise() {
    Promise.all([
        fetchReviews()
    ])
    .then(([
        reviews
    ]) => {
        build(reviews);
    }).catch((error) => {
        console.error('Error al obtener las reseñas:', error);
    });
}

async function fetchReviews() {
    const response = await fetch('/api/view-reviews/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener las reseñas');
    return await response.json();
}

function build(reviews) {
    console.log('Reseñas:', reviews);
}
