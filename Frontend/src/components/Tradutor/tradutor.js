// Tradutor.js

const translate = (word) => {
    // Dicionário de traduções pré-definidas
    const dicionario = {
        PREPARING: 'PREPARANDO',
        PREPARED: 'PREPARADO',
        APPROVED: 'APROVADO',
        PICKING: 'SEPARACAO',
        LACK: 'FALTA',
        CANCELED: 'CANCELADO',
        FINISHED: 'FINALIZADO',
        MERGED: 'AGRUPADO',
        // Adicione mais palavras conforme necessário
    };

    // Verifica se a palavra está no dicionário
    const palavraTraduzida = dicionario[word.toUpperCase()] || `${word}`;
    return palavraTraduzida;
};

export default translate;
