import { calculateTip, fahrenheitToCelsius, celsiusToFahrenheit } from "../src/math"

test("calculateTip should calculate total with tip", () => {
    const result = calculateTip(10, 30)

    expect(result).toBe(13)
})

test("fahrenheitToCelsius convert 32 F to 0 C", () => {
    const result = fahrenheitToCelsius(32)

    expect(result).toBe(0)
})

test("celsiusToFahrenheit convert 0 C to 32 F", () => {
    const result = celsiusToFahrenheit(0)

    expect(result).toBe(32)
})


// Goal: Test temperature conversion functions
//
// 1. Export both functions and load them into test suite
// 2. Create "Should convert 32 F to 0 C"
// 3. Create "Should convert 0 C to 32 F"
// 4. Run the Jest to test your work!
