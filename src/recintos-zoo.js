class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: ['MACACO', 'MACACO', 'MACACO'] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: ['GAZELA'] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: ['LEAO'] }
        ];

        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        if (!this._validarAnimal(animal)) return { erro: "Animal inválido" };
        if (!this._validarQuantidade(quantidade)) return { erro: "Quantidade inválida" };

        const { tamanho: tamanhoAnimal, biomas: biomasAnimal, carnivoro } = this.animais[animal];
        const recintosViaveis = [];

        for (let recinto of this.recintos) {
            let espacoUsado = this._calcularEspacoUsado(recinto.animais);
            let espacoNecessario = this._calcularEspacoNecessario(tamanhoAnimal, quantidade, recinto.animais, animal);

            if (this._biomaValido(biomasAnimal, recinto.bioma) &&
                this._espacoDisponivel(espacoUsado, espacoNecessario, recinto.tamanho) &&
                this._verificarRegrasDeConvivencia(animal, recinto.animais, carnivoro, recinto.bioma)) {

                recintosViaveis.push({
                    numero: recinto.numero,
                    descricao: `Recinto ${recinto.numero} (espaço livre: ${recinto.tamanho - espacoUsado - espacoNecessario} total: ${recinto.tamanho})`
                });
            }
        }

        if (recintosViaveis.length === 0) return { erro: "Não há recinto viável" };

        // Ordenar recintos viáveis pelo número do recinto
        recintosViaveis.sort((a, b) => a.numero - b.numero);

        return {
            recintosViaveis: recintosViaveis.map(r => r.descricao)
        };
    }

    _validarAnimal(animal) {
        return !!this.animais[animal];
    }

    _validarQuantidade(quantidade) {
        return quantidade > 0;
    }

    _biomaValido(biomasAnimal, biomaRecinto) {
        return biomasAnimal.includes(biomaRecinto) || biomaRecinto.includes('savana') && biomasAnimal.includes('savana');
    }

    _espacoDisponivel(espacoUsado, espacoNecessario, tamanhoRecinto) {
        return (tamanhoRecinto - espacoUsado) >= espacoNecessario;
    }

    _calcularEspacoUsado(animaisNoRecinto) {
        let espaco = 0;
        for (let animal of animaisNoRecinto) {
            espaco += this.animais[animal].tamanho;
        }
        return espaco;
    }

    _calcularEspacoNecessario(tamanhoAnimal, quantidade, animaisNoRecinto, novoAnimal) {
        let espacoExtra = 0;

        // Verifica se há mais de uma espécie diferente no recinto
        if (animaisNoRecinto.length > 0) {
            const existeOutraEspecie = animaisNoRecinto.some(animal => animal !== novoAnimal);
            if (existeOutraEspecie) {
                espacoExtra = 1;
            }
        }

        return (tamanhoAnimal * quantidade) + espacoExtra;
    }

    _verificarRegrasDeConvivencia(animal, animaisNoRecinto, carnivoro, biomaRecinto) {
        // Verifica se há algum carnívoro no recinto
        const haCarnivoroNoRecinto = animaisNoRecinto.some(animalNoRecinto => this.animais[animalNoRecinto].carnivoro);
    
        // Regra: Se o novo animal é carnívoro e há outra espécie no recinto, retorna false
        if (carnivoro && animaisNoRecinto.length > 0 && animaisNoRecinto.some(a => a !== animal)) {
            return false;
        }
    
        // Regra: Se já há carnívoros no recinto e o novo animal não é da mesma espécie, retorna false
        if (haCarnivoroNoRecinto && (animaisNoRecinto.some(a => a !== animal) || carnivoro === false)) {
            return false;
        }
    
        // Regra específica para o hipopótamo
        if (animal === 'HIPOPOTAMO' && biomaRecinto !== 'savana e rio') {
            return false; 
        }
    
        return true;
    }
}

  // Exportação para uso externo
  export { RecintosZoo as RecintosZoo };
