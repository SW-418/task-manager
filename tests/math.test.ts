import { calculateTip } from "../src/math.js"

test("Should calculate total with tip", () => {
    const result = calculateTip(10, 30)
    if(result != 13) {
        throw new Error(`Expected result to be 13 but was ${result}`)
    }
})
