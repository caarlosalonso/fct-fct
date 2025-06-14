import { Form } from '../classes/Form.js';
import { tableLoading, tableFail, createSVG, createClickableSVG } from '../functions.js';

const SECTION = 'reviews-section';

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
    const response = await fetch('/api/reviews/all');
    if (response.status === 204) return [];
    if (!response.ok) throw new Error('Error al obtener las reseñas');
    return await response.json();
}

function build(reviews) {
    console.log('Reseñas:', reviews);

    const section = document.getElementById(SECTION);
    if (!section) {
        console.error(`No se encontró la sección con ID: ${SECTION}`);
        return;
    }
    while(section.firstChild) section.removeChild(section.firstChild);

    if (reviews.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No hay reseñas.';
        section.appendChild(message);
        return;
    }

    reviews.forEach((review) => {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review';
        section.appendChild(reviewDiv);

        const title = document.createElement('p');
        title.className = 'review-title';
        title.textContent = review.empresa.nombre;
        reviewDiv.appendChild(title);

        const score = document.createElement('p');
        score.className = 'review-score';
        score.textContent = `Puntuación: ${review.score} / 5`;
        reviewDiv.appendChild(score);

        const content = document.createElement('p');
        content.className = 'review-content';
        content.textContent = review.comment;
        reviewDiv.appendChild(content);

        const author = document.createElement('p');
        author.className = 'review-author';
        author.textContent = `Autor: ${review.user.name}`;
        reviewDiv.appendChild(author);
    });
}
