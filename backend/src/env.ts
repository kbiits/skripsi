import 'dotenv/config'

const env = {
    'JWT_SECRET': process.env.JWT_SECRET || '',
    'JWT_EXPIRATION': process.env.JWT_EXPIRATION || '30d',
    'PORT': Number(process.env.PORT) || 3003,
    'AMQP_URL': process.env.AMQP_URL || '',
    'DB_URL': process.env.DB_URL || '',
    'LOG_QUERY': Boolean(process.env.LOG_QUERY) || false,
}


for (const [k, v] of Object.entries(env)) {
    if (v == undefined) {
        throw new Error(`Env: ${k} is not defined`)
    }
}

export default env