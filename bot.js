import { configDotenv } from 'dotenv'
import cron from 'node-cron'
import nodeMailer from 'nodemailer'
import crypto from 'crypto'
globalThis.crypto = crypto
configDotenv()
// Symbols that the bot will look for
const symbols = ['BTCUSD', 'ETHUSD', 'XRPUSD']
// Binance endpoint
const apiUrl = `https://api.binance.us/api/v3/ticker/price?symbol=BTCUSD`

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

async function lookForCoin(name) {
    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/coins/list'
        )
        const data = await response.json()
        data.forEach((coinData) => {
            if (coinData.symbol === name) console.log(coinData)
        })
    } catch (error) {
        console.error('Error looking for coin', error)
    }
}
cron.schedule('* * * * * *', viewData)
