export function calculateIMC(weight, height) {
        const imc = weight / (height * height);
        return imc.toFixed(2);
}

export function getIMCCategory(imc){
        if (imc < 18.5) return 'Abaixo do peso';
        if (imc >= 18.5 && imc < 24.9) return 'Peso normal';
        if (imc >= 25 && imc < 29.9) return 'Sobrepeso';
        if (imc >= 30) return 'Obesidade';
}
