export function converterDataBRParaISO(data: string): string {
    if (!data || !data.includes('/')) {
        return data;
    }
    const [dia, mes, ano] = data.split('/');
    return `${ano}-${mes}-${dia}`;
}

export function converterDataISOParaBR(data: string): string {
    if (!data || !data.includes('-')) {
        return data;
    }
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
}
