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
const viewData = async () => {
    try {
        const response = await fetch(apiUrl)
        const data = await response.json()
        sendEmail(
            {
                from: 'Bot Trader',
                subject: 'Some condition has been met',
                text:
                    'Hey here this text from the condition met ' +
                    JSON.stringify(data),
            },
            process.env.EMAIL
        )
        console.log('Data was ')
    } catch (error) {
        console.error('Binance GET request price error: ', error)
    }
}

/**
 *
 * @param {{text:string, subject: string, from:string}} message - The email content.
 * @param {string} user - The recipient's email address.
 */
const sendEmail = async (message, emailRecipient) => {
    if (typeof message !== 'object')
        throwError({ message: 'Message must be a object' })
    if (!message.hasOwnProperty('text'))
        throwError({ message: 'Message text must be defined' })
    if (!message.hasOwnProperty('subject'))
        throwError({ message: 'Message subject must be defined' })
    if (!message.hasOwnProperty('from'))
        throwError({ message: 'Message from must be defined' })

    const { from, text, subject } = message

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

await viewData()
cron.schedule('* * * * * *', () => console.log('Running every second'))
