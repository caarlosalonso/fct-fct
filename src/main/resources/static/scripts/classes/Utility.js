export class Utility {
    static getBooleanAttribute(name, element) {
        return element.getAttribute(name) === 'true';
    }

    static getAttributeValueOrDefault(name, def, element) {
        const value = element.getAttribute(name);
        return value !== null ? value : def;
    }

    static getElementValueByAttribute(name, element, b = null) {
        return Utility.getBooleanAttribute(name, element) ? element.value : b;
    }
}
