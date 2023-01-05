# strm-xmpl

A simple(ish) example of a script that reads JSON objects (as a stream) from an `s3` bucket,
and process them in parallel (*5* at a time, but could be any concurrency).

## Run

```shell
docker-compose up -d
```

Then contemplate the meeaning of existence while `localstack` comes up...

```shell
./index.js
```

## Output

The "processed" JSON objects from the bucket, with some extra fields to show the time and the order of their processing.
