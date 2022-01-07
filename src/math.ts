const calculateTip = (total: number, tipPercentage: number): number => {
    return total + ((total / 100) * tipPercentage)
}

const fahrenheitToCelsius = (temp: number) => {
    return (temp - 32) / 1.8
}

const celsiusToFahrenheit = (temp: number) => {
    return (temp * 1.8) + 32
}

export { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit }
