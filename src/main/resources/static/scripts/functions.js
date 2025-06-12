/*
import { tableLoading, tableFail, createSVG, createClickableSVG } from './functions.js';
*/

export function tableLoading(tableId) {
    const element = document.getElementById(tableId);
    if (!element) {
        console.error(`Element with ID ${tableId} not found.`);
        return;
    }
    while (element.firstChild) element.removeChild(element.firstChild);

    const spinner = document.createElement('div');
    spinner.className = 'spinner spinner-border color-primary';
    element.appendChild(spinner);

    const spinnerText = document.createElement('span');
    spinnerText.className = 'visually-hidden';
    spinnerText.textContent = 'Cargando...';
    spinner.appendChild(spinnerText);
}

export function tableFail(tableId, TIMEOUT, promise) {
    const element = document.getElementById(tableId);
    if (!element) {
        console.error(`Element with ID ${tableId} not found.`);
        return;
    }
    while (element.firstChild) element.removeChild(element.firstChild);

    const errorSymbol = document.createElement('div');
    errorSymbol.id = 'error-message-section';
    errorSymbol.appendChild(createSVG(
        "0 0 48 48",
        "M 40.9706 35.3137 L 29.6569 24 L 40.9706 12.6863 C 42.3848 11.2721 42.3848 8.4437 40.9706 7.0294 S 36.7279 5.6152 35.3137 7.0294 L 24 18.3431 L 12.6863 7.0294 C 11.2721 5.6152 8.4437 5.6152 7.0294 7.0294 S 5.6152 11.2721 7.0294 12.6863 L 18.3431 24 L 7.0294 35.3137 C 5.6152 36.7279 5.6152 39.5563 7.0294 40.9706 S 11.2721 42.3848 12.6863 40.9706 L 24 29.6569 L 35.3137 40.9706 C 36.7279 42.3848 39.5563 42.3848 40.9706 40.9706 S 42.3848 36.7279 40.9706 35.3137 Z",
        "cross-svg"
    ));
    element.appendChild(errorSymbol);

    clearTimeout(TIMEOUT);
    TIMEOUT = setTimeout(() => {
        clearTimeout(TIMEOUT);
        
        tableLoading(tableId);
        TIMEOUT = setTimeout(() => {
            promise();
        }, 8000);
    }, 2000);
}

export function createSVG(viewBox, pathData, ...classList) {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(SVG_NS, 'svg');
    classList.forEach(cls => svg.classList.add(cls));
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('xmlns', SVG_NS);

    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', pathData);
    svg.appendChild(path);

    return svg;
}

export function createClickableSVG(viewBox, pathData, clickHandler, ...classList) {
    const svg = createSVG(viewBox, pathData, ...classList);
    svg.onclick = clickHandler;
    return svg;
}