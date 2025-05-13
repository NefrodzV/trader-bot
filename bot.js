import { configDotenv } from 'dotenv'
import cron from 'node-cron'
import nodeMailer from 'nodemailer'
configDotenv()
// Symbols that the bot will look for
const symbols = {
    bitcoin: 'BTCUSDT',
    xrp: 'XRPUSDT',
}
// Binance endpoint
const apiUrl = `https://api.binance.com/api/v3/ticker/price?symbol=${symbols.xrp}`

// Setup mail transporter
const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
})
// ** Function to lookup data from binance  **/
async function viewData() {
    try {
        const response = await fetch(apiUrl)
        const data = await response.json()
        // sendEmail(
        //     {
        //         from: 'Bot Trader',
        //         subject: 'Some condition has been met',
        //         text:
        //             'Hey here this text from the condition met ' +
        //             JSON.stringify(data),
        //     },
        //     process.env.EMAIL
        // )
        console.log('Data is: ' + JSON.stringify(data))
    } catch (error) {
        console.error('Binance GET request price error: ', error)
    }
}

/**
 *
 * @param {{text:string, subject: string, from:string}} message - The email content.
 * @param {string} user - The recipient's email address.
 */
async function sendEmail(message, emailRecipient) {
    if (typeof message !== 'object')
        throwError({ message: 'Message must be a object' })
    if (!message.hasOwnProperty('text'))
        throwError({ message: 'Message text must be defined' })
    if (!message.hasOwnProperty('subject'))
        throwError({ message: 'Message subject must be defined' })
    if (!message.hasOwnProperty('from'))
        throwError({ message: 'Message from must be defined' })

    const { text, subject } = message

    try {
        await transporter.verify()
        transporter.sendMail({
            to: emailRecipient,
            subject: subject,
            text: text,
        })
    } catch (error) {
        console.error('Nodemailer error:', error)
    }
}

function throwError({ errorType = Error, message = 'An error has occurred' }) {
    throw new errorType(message)
}

export function calculateSMA({ period = 0, prices = [] }) {
    if (period === 0)
        throwError({
            message: 'Period must be defined right now tis values is: ' + 0,
        })
    if (!Array.isArray(prices))
        throwError({ message: 'Prices must be an array' })
    if (prices.length === 0) throwError({ message: 'Prices array is empty' })

    if (prices.length < period)
        throwError({ message: 'Not enough prices to calculate SMA' })
    //Calculate with all
    const lastestSMA =
        prices.reduce((accumalator, value) => accumalator + value, 0) / period

    // Calculate without the last one
    const previousSMA =
        prices.slice(0, prices.length - 1).reduce((acc, val) => acc + val, 0) /
        (period - 1)

    return {
        previousSMA,
        lastestSMA,
    }
}
