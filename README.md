# near challenge 4

## Features

- [X] Sending message to smart contract
- [X] Set profile picture through cross contract call
- [X] Sending donation to smart contract
- [X] Claim back the donation

## Website

https://near-message.vercel.app

## Demo

https://twitter.com/spiritbrother/status/1518406642781782018

## How to deploy contract

In this contract i implement experimental feature to set profile picture from your nft contract, the nft contract should have NEP-171 standard or else it will fail you can set your own contract in [here](https://github.com/spiritbro1/near-challenge-4/blob/main/assembly/main.ts#L59) change the `dev-1650673472567-94467512871134` to your own contract name and it's a cross contract call and it is expensive to call it i use approximately 60 Tgas for one transaction so be careful, to deploy first you need to build:

```bash
yarn build:contract:debug
```

Deploy to testnet:

```bash
near dev-deploy --wasmFile=./out/main.wasm
```

## Development

Run this first:

```bash
yarn
```

Create and set `.env` environment variables to be like this:

```
VUE_APP_CONTRACT=// your message contract
VUE_APP_NFT_CONTRACT=// your nft contract for cross chain call
```

Then to run this we need to deploy first to vercel dont worry it wont break anything run this command:

```
vercel .
```

Then to run this to develop:

```
vercel dev
```

## Deploy to production

Set environment variable of your app that you just deploy like this:

![image](https://user-images.githubusercontent.com/62529025/165008510-5a1c9004-6929-4b82-b5d2-1a6184f9b8a8.png)

Its value are the same as in your development env, then after finish setting up deploy using this command:

```
vercel --prod
```
