import { format } from 'date-fns'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import fsPromises from 'fs/promises'
import Log from '../models/log.model.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const logEvents = async (message, logName) => {
	const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
	const logItem = `${dateTime}\t${uuid()}\t${message}\n`

	try {
		if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
			await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
		}

		await fsPromises.appendFile(
			path.join(__dirname, '..', 'logs', logName),
			logItem
		)
	} catch (err) {
		console.log(err)
	}
}

const logger = async (req, res, next) => {
	try {
		logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
		const newLog = new Log({
			method: req.method,
			origin: req.headers.origin || 'undefined',
			url: req.url,
		})
		await newLog.save()
		console.log(`${req.method} ${req.path}`)
		next()
	} catch (err) {
		console.log(err)
	}
}

export { logger }
