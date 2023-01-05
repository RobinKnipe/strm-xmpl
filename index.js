#!/bin/env node

const { stdout } = require('node:process')
// const stream = require('stream')
const sleep = require('timers/promises').setTimeout
const JSONStream = require('JSONStream')
const transforms = require('async-transforms')

let order = 0
const items = Array.from({ length: 50 }).map((_, i) => ({ creationID: i }))
// console.log(items)

const AWS = require('aws-sdk')
const s3 = new AWS.S3({
    region: 'eu-west-1',
    endpoint: "http://localhost:4566",
    accessKeyId: "test",
    secretAccessKey: "test",
    s3ForcePathStyle: true
})
const setupS3 = async () => {
    await s3.createBucket({ Bucket: 'test' }).promise().catch(() => true) // in case it already exists
    await s3.putObject({ Bucket: 'test', Key: 'dummy.json', Body: JSON.stringify(items)}).promise()
}

setupS3().then(() =>
    s3.getObject({ Bucket: 'test', Key: 'dummy.json' })
        .createReadStream()
        .pipe(JSONStream.parse('*'))
        .pipe(transforms.map(async (obj, i) => {
            await sleep((i<=3 ? 8000 : 0) + Math.round(Math.random() * 1000))
            // console.log(Date.now(), 'processing', i)
            return { t: Date.now(), ...obj, processed: order++ }
        }, { tasks: 5 }))
        .pipe(transforms.map(_ => JSON.stringify(_)+'\n'))
        .pipe(stdout)
)
