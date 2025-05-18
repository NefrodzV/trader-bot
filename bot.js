import { configDotenv } from 'dotenv'
import nodeMailer from 'nodemailer'
configDotenv()
// Symbols that the bot will look for
const coins = ['bitcoin', 'ethereum', 'ripple']
// Binance endpoint
const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd`

// Setup mail transporter
const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
    },
})

async function getCoinPrices(coins) {
    const coinIds = Array.isArray(coins) ? coins.join(',') : coins
    const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd`
    try {
        const response = await fetch(apiUrl)
        const data = await response.json()
        return data
    } catch (error) {
        console.error('[GET] Coin prices error : ', error)
        return null
    }
}

async function viewData(coins, email, conditions) {
    if (!coins) throwError({ message: 'Coins must be defined' })
    if (Array.isArray(coins) && coins.length === 0)
        throwError('Coins array is empty')
    try {
        const data = await getCoinPrices(coins)
        if (!email) throwError({ message: 'Email must be defined' })
        // No conditions are set just send information about the coins

        if (!conditions) {
            console.log('Sending email')
            return await sendEmail(
                {
                    from: 'Crypto Price Information',
                    subject: 'Crypto Price Information',
                    text: formatData(data),
                },
                email
            )
        }
    } catch (error) {
        console.error('View data error : ', error)
    }
}

function formatData(data) {
    const substringArray = [`Current prices : \n`]
    for (const [key, value] of Object.entries(data)) {
        substringArray.push(`[${key.toUpperCase()}] : ${value.usd} USD \n`)
    }
    return substringArray.join('')
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
    // if (!message.hasOwnProperty('from'))
    //     throwError({ message: 'Message from must be defined' })

    const { text, subject } = message

    try {
        await transporter.verify()
        transporter.sendMail({
            to: emailRecipient,
            subject: subject,
            text: text,
        })
        console.log('Email sent')
    } catch (error) {
        console.error('Nodemailer error:', error)
    }
}

function throwError({ errorType = Error, message = 'An error has occurred' }) {
    throw new errorType(message)
}

console.log('Worker ran at', new Date().toISOString())
