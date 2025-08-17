import { Decimal } from './libs/break_infinity.js';

const SUFFIXES = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

export function formatNumber(number) {
    if (!(number instanceof Decimal)) {
        number = new Decimal(number);
    }
    if (number.lt(1000)) {
        return number.toFixed(number.isInteger() ? 0 : 1);
    }
    const tier = number.log10().div(3).floor();
    if (tier.gte(SUFFIXES.length)) {
        return number.toExponential(2);
    }
    const suffix = SUFFIXES[tier.toNumber()];
    const scale = Decimal.pow(10, tier.times(3));
    const scaled = number.div(scale);
    return scaled.toFixed(2) + suffix;
}

export function formatTime(seconds) {
    const s = Math.floor(seconds % 60);
    const m = Math.floor((seconds / 60) % 60);
    const h = Math.floor(seconds / 3600);
    return `${h}h ${m}m ${s}s`;
}
