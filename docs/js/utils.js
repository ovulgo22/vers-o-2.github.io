const SUFFIXES = ['', 'mil', 'mi', 'bi', 'tri', 'qua', 'qui', 'sex', 'sep', 'oct', 'non', 'dec'];

/**
 * @description Formata um número grande em uma string legível (ex: 1.23 mi).
 * @param {number} number - O número a ser formatado.
 * @returns {string} O número formatado.
 */
export function formatNumber(number) {
    if (number < 1000) {
        // Usa toFixed(1) para mostrar decimais do CPS, mas arredonda para inteiros para a contagem principal
        return number < 100 ? number.toFixed(1) : Math.floor(number).toString();
    }

    const tier = Math.floor(Math.log10(number) / 3);
    if (tier >= SUFFIXES.length) {
        return number.toExponential(2); // Fallback para notação científica
    }

    const suffix = SUFFIXES[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = number / scale;

    return scaled.toFixed(2) + ' ' + suffix;
}
