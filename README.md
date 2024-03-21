**Status: Deprecated.**

# Avalon Blocks

Avalon block explorer, written using Bootstrap library.

## Installation

DBlocks is a single page application (SPA) where all routing are handled on the client-side. This is so that it can be served from IPFS and Skynet without the need of a single webserver.

To run a development server using `http-server`:
```
git clone https://github.com/techcoderx/dblocks
npm i -g http-server
http-server
```

## Configuring default API node

To configure the default API node, replace the API node URL in [config.js](https://github.com/techcoderx/dblocks/blob/main/js/config.js). Indicate if the API node points to a testnet in `config.isTestnet`.
