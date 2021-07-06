# DBlocks

Avalon block explorer, written using Bootstrap library.

## Installation

DBlocks is a single page application (SPA) where all routing are handled on the client-side. This is so that it can be served from IPFS and Skynet without the need of a single webserver.

To run a development server using `http-server`:
```
git clone https://github.com/techcoderx/dblocks
npm i -g http-server
http-server
```

## Using your own Avalon API

To use your own Avalon API node instead of the default `avalon.oneloved.tube`, replace the API node in [config.js](https://github.com/techcoderx/dblocks/blob/main/js/config.js). Indicate if the API node points to a testnet in `config.isTestnet`.