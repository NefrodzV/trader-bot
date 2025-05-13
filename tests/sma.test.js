const { calculateSMA } = require('../bot.js')

test('Calculates SMA with simple numbers', () => {
    const { lastestSMA, previousSMA } = calculateSMA({
        period: 10,
        prices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    })

    // Check if the values are correct
    expect(lastestSMA).toBe(5.5)
    expect(previousSMA).toBe(5)
})
