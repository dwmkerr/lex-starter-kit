# oscar-cli

A lovely CLI for Oscar 🤖.

## Usage

Build it:

```bash
npm build
```

Run it:

```bash
npm start
```

You can also publish and install it, or link it. Make sure you are logged in to the AWS CLI to use this CLI.

## Configuration

You can configure what bot the CLI interacts with using the following environment variables:

| Variable | Default | Usage |
|----------|-------|---------|
| `OSCAR_CLI_BOT` | `oscarbot` | The name of the bot. |
| `OSCAR_CLI_BOT_ALIAS` | `$LATEST` | The bot alias or version. |
| `OSCAR_CLI_REGION` | `us-east-1` | The region for the bot. |


## Troubleshooting

The CLI uses the [debug](https://www.npmjs.com/package/debug) module. To get extended information when running, just set the `DEBUG` environment variable:

```bash
DEBUG=oscar oscar
```


