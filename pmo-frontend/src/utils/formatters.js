/**
 * Groups items by unit and calculates totals with smart conversions.
 * 
 * Rules:
 * - Weight (kg, ton): Sum converted to kg. If total >= 1000 kg, display in ton (3 decimals). Else in kg.
 * - Area (m², ha): Sum converted to m². If total >= 10000 m², display in ha (2 decimals). Else in m².
 * - Others: Sum by unit key.
 * 
 * @param {Array} items - Array of data objects.
 * @param {string} valueKey - Key for the numeric value.
 * @param {string} unitKey - Key for the unit string.
 * @returns {string} - Formatted string (e.g., "2,15 ton + 50 maços").
 */
export const formatSmartTotal = (items, valueKey, unitKey) => {
    if (!items || items.length === 0) return '-';

    let totalWeightKg = 0;
    let totalAreaM2 = 0;
    const discreteTotals = {};
    let hasWeight = false;
    let hasArea = false;

    items.forEach(item => {
        // Handle comma decimal separator just in case, though usually it's stored as number or dot-string
        let rawVal = item[valueKey];
        if (typeof rawVal === 'string') {
            rawVal = rawVal.replace(',', '.');
        }
        const val = parseFloat(rawVal);

        if (isNaN(val) || val === 0) return;

        const unit = (item[unitKey] || '').toLowerCase().trim();

        // Weight Normalization
        if (['kg', 'kilo', 'kilograma', 'kilogramas'].includes(unit)) {
            hasWeight = true;
            totalWeightKg += val;
        } else if (['ton', 't', 'tonelada', 'toneladas', 'mg'].includes(unit)) {
            // Note: 'mg' (Megagrama) is technically ton, but rarely used.
            // Assuming input is standard ton.
            hasWeight = true;
            totalWeightKg += val * 1000;
        }

        // Area Normalization
        else if (['m²', 'm2', 'metro quadrado', 'metros quadrados'].includes(unit)) {
            hasArea = true;
            totalAreaM2 += val;
        } else if (['ha', 'hectare', 'hectares'].includes(unit)) {
            hasArea = true;
            totalAreaM2 += val * 10000;
        }

        // Discrete / Other Units
        else {
            // Keep original casing for display if needed, but we normalized to lowercase for grouping.
            // Let's use the first encountered case for display if we want, or just lowercase?
            // User example: "maços". Let's stick to the unit string found.
            // To avoid splitting "Maço" and "maço", we use the normalized key.
            const normUnit = unit || 'unid';
            if (!discreteTotals[normUnit]) {
                discreteTotals[normUnit] = { val: 0, label: item[unitKey] || unit };
            }
            discreteTotals[normUnit].val += val;
        }
    });

    const parts = [];

    // Format Weight
    if (hasWeight) {
        if (totalWeightKg >= 1000) {
            const tons = totalWeightKg / 1000;
            parts.push(`${tons.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 3 })} ton`);
        } else if (totalWeightKg > 0) {
            parts.push(`${totalWeightKg.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 3 })} kg`);
        }
    }

    // Format Area
    if (hasArea) {
        if (totalAreaM2 >= 10000) {
            const ha = totalAreaM2 / 10000;
            parts.push(`${ha.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ha`);
        } else if (totalAreaM2 > 0) {
            parts.push(`${totalAreaM2.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} m²`);
        }
    }

    // Format Discrete
    Object.values(discreteTotals).forEach(({ val, label }) => {
        if (val > 0) {
            parts.push(`${val.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ${label}`);
        }
    });

    return parts.join(' + ') || '-';
};
