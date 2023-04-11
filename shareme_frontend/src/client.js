import imageUrlBuilder from '@sanity/image-url'
import {createClient} from '@sanity/client'

export const client =  createClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2023-04-07',
    useCdn: true,
    token: process.env.REACT_APP_SANITY_TOKEN,
})

const builder = imageUrlBuilder({
    projectId:'xih2ceve',
    dataset: 'production',
})

export const urlFor = (source) => builder.image(source)

