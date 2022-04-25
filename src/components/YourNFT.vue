<template>
    <div class="account" >
        <b-container>
            
            <div class="owner-nft mt-4">
                <b-tabs content-class="mt-4">
                    <b-tab :title="`NFTs (${nfts.length})`" active>
                        <div class="no-item" v-if="!loading && nfts.length === 0">
                            <b-card-img class="nologo" :src="require('../assets/images/nologo.svg')" alt="Image"></b-card-img>
                            <b-card-text>Your NFTS will be shown here. If you don't have one mint now in <a target="_blank" href="https://near-nft.vercel.app/">https://near-nft.vercel.app/</a> </b-card-text>
                        </div>
                        <b-row class="is-multiline">
                            <b-col v-if="!loading && nfts.length > 0" class="is-flex">
                                <b-card v-for="(it, k) in nfts" :key="k" no-body class="nft-item">
                                   
                                        <b-card-img class="nft-image" style="height:213px;" :class="{ 'pixelated': isPixelated}" v-bind:src="it.metadata.media.indexOf('ipfs') > -1 ? it.metadata.media : `data:image/svg+xml;charset=UTF-8,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' preserveAspectRatio='none'%3E%3Cdefs%3E%3Cstyle type='text/css'%3E%23holder_17cb7089c7d text %7B fill:'%23DFE1E6';font-weight:bold;font-family:Poppins, monospace;font-size:50pt %7D %3C/style%3E%3C/defs%3E%3Cg id='holder_17cb7089c7d'%3E%3Crect width='200' height='200' fill='%23EBECF0'%3E%3C/rect%3E%3Cg%3E%3Ctext x='44.421875' y='118.5' fill='%23DFE1E6'%3E%23${it.id}%3C/text%3E%3C/g%3E%3C/g%3E%3C/svg%3E`" alt="image"></b-card-img>
                                        <b-card-body class="is-flex">
                                            <div class="nft-head">
                                                <b-card-title class="nft-title highlight-text-color">{{ `${it.metadata.title} #${it.id}` }}</b-card-title>                                            
                                            </div>
                                        </b-card-body>
                                   <b-button @click="setPFP(it.id)" v-if="it.metadata.media!==pfp" :disabled="disabled" variant="success" class="my-2">SET AS PFP</b-button>
                                </b-card>
                                <!-- <b-button class="btn-load-more mb-4" v-if="nfts.length < iNFT" @click="loadNFTs(nfts.length, nfts.length + limit)">Next <b-spinner v-if="loadingMore" small label="Small Spinner"></b-spinner></b-button> -->
                            </b-col>
                            <!-- Skeleton loading -->
                            <b-col v-if="loading" class="is-flex" style="margin-top: 20px">
                                <b-card v-for="(i) in [1,2,3,4]" :key="i" no-body class="nft-item">
                                    <b-skeleton-img></b-skeleton-img>
                                    <b-card-body class="is-flex space-between">
                                        <div class="nft-head">
                                            <b-skeleton animation="fade" width="100%"></b-skeleton>
                                        </div>
                                    </b-card-body>
                                </b-card>
                            </b-col>
                            <!-- End skeleton loading -->
                        </b-row>
                    </b-tab>
                   
                </b-tabs>
            </div>

        </b-container>
          <b-toast
      id="tx-success1"
      title="Transaction Success"
      variant="success"
      solid
      auto-hide-delay="8000"
    >
      Your transaction is successful. Transaction <a target="_blank" :href="`https://explorer.testnet.near.org/transactions/${transactionId}`">{{transactionId}}</a>
    </b-toast>
    <b-toast
      id="tx-error1"
      title="Error"
      variant="danger"
      solid
      auto-hide-delay="8000"
    >
      {{errorMessage}}
    </b-toast>
    </div>
</template>
<script>

import * as nearAPI from "near-api-js";
export default {
    name: 'YourNFT',
    data: () => ({
        transactionId:"",
        errorMessage:"",
        account: '',
        userBids: {},
        userAsks: {},
        asks: [],
        bids: [],
        nfts: [],
        loading: true,
        loadingMore: false,
        isCopy: false,
        isPixelated: false,
        limit: 12,
        iAsk: 0,
        iBid: 0,
        iNFT: 0,
        disabled:false
    }),
    props: ['getMessages','ftLink', 'nftAddress', 'ftSymbol', 'nftSymbol','pfp','cokim','getPFP','selector'],
    updated: async function () {
        this.$nextTick().then(() => { 
            let nftImg = document.querySelector(".nft-image")
            if (nftImg) {
                if (nftImg.naturalWidth < 200) {
                    this.isPixelated = true
                } else {
                    this.isPixelated = false
                }
            }
        })
    },
    created: async function () {
        
     try{
const nearRpc = new nearAPI.providers.JsonRpcProvider({url: "https://rpc.testnet.near.org"});

            const account = new nearAPI.Account({
                    provider: nearRpc,
                    networkId: "testnet",
                    signer: process.env.VUE_APP_NFT_CONTRACT,
                    headers:  {}
                },
                process.env.VUE_APP_NFT_CONTRACT);
                const semua=await account.viewFunction(
                process.env.VUE_APP_NFT_CONTRACT,
                "nft_tokens_for_owner",
                {account_id:this.nftAddress}
            );
            
            this.nfts=semua;
            
        this.loading = false
     }catch(e){
console.log(e.message)
this.loading=false;
     }
    

    }, 
    methods: {
       async setPFP(id){
           this.disabled=true;
 try{
const data=await this.selector
              .signAndSendTransaction({
                signerId: (await this.selector.getAccounts())[0].accountId,
                actions: [
                  {
                    type: "FunctionCall",
                    params: {
                      methodName: "setPFP",
                      args: { token_id: id },
                      gas: 60e12,
                      
                    },
                  },
                ],
              });
              if(localStorage.getItem("near-wallet-selector:selectedWalletId")==='"near-wallet"'){
this.$bvToast.show('tx-success1');
                this.transactionId="";
                        this.cokim.hide('your-nft')
                        this.getPFP(this.nftAddress)
                        this.getMessages()
              }else if(data?.transaction_outcome){
                this.$bvToast.show('tx-success1');
                this.transactionId=data.transaction_outcome.id;
                        this.cokim.hide('your-nft')
                        this.getPFP(this.nftAddress)
                        this.getMessages()
        
              } else{
                this.$bvToast.show('tx-error1');
                this.errorMessage="can't set pfp";
                 this.disabled=false;
              }
     }catch(e){
this.$bvToast.show('tx-error1');
                this.errorMessage=e.message;
                 this.disabled=false;
     }
     this.disabled=false;
       }

    }
};
</script>
<style lang="scss" scoped>
    .account{
        background-color: #fff;
        max-height: calc(100vh - 74px);
        .header-account{
            align-items: center;
            .w-icon{
                height: 30px;
            }
        }
        .address{
            font-size: 30px;
            font-weight: 700;
        }
        .action{
            margin-left: 40px;
        }
        .copy-address, .view-explorer{
            padding: 8px;
            display: inline-block;
            border-radius: 8px;    
        }
        .copy-address{
            color: #0065FF;
            background-color: #DEEBFF;
            margin-right: 16px;
            cursor: pointer;
        }
        .view-explorer{
            color: #9D22C1;
            background-color: #9D22C11A;

        }
        .owner-nft{
            .no-item{
                // position: absolute;
                // left: 50%;
                // top: 50%;
                // transform: translate(-50%,-50%);
                margin-top: 150px;
                text-align: center;
                color: #5E6C84;
                .nologo{
                    max-width: 80px;
                    margin-bottom: 16px;
                }
            }
            .nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link{
                background-color: transparent;
                color: #091E42;
                &::after{
                    background: #091E42;
                }
            }
            .nav-tabs .nav-link{
                border: none;
                position: relative;
                color: #7A869A;
                margin-right: 20px;
                &::after{
                    position: absolute;
                    width: 100%;
                    content: '';
                    height: 2px;
                    bottom: 0;
                    left: 0;
                    transition: all 0.35s ease;
                }
                &:hover, &:focus{
                    color: #091E42;
                    &:after{
                        background: #091E42;
                    }
                }

            }
        }
        .btn-load-more{
            margin: 0 auto;
            padding: 5px 10px;
            border-radius: 8px;
            color: #fff;
            background-color: #9D22C1;
        }
        .nft-item{
            width: calc(25% - 20px);
            margin-right: 24px;
            margin-bottom: 24px;
            padding: 16px;
            border-radius: 8px;
            background-color: #F4F5F7;
            border-color: transparent;
            transition: all 0.35s ease;
            cursor: pointer;
            .item-link{
                &:hover{
                    text-decoration: none;
                }
            }
            &:nth-child(4n) {
                margin-right: 0;
            }
            &:hover{
                background-color: #fff;
                box-shadow: 0px 0px 8px 2px #e9e9e9;
            }
            .card-body{
                padding: 16px 0 0 0;
            }
            .is-flex{
                justify-content: space-between;
            }
            .nft-head{
                width: 61%;
            }
            .nft-price{
                width: 39%;
            }
            .nft-acc{
                font-size: 12px;
                margin-bottom: 0;
                color: #FEBC11;
                line-height: 16px;
            }
            .nft-title{
                font-size: 20px;
                font-weight: 700;
                line-height: 30px;
                margin-bottom: 0;
            }
            .nft-price-text{
                font-size: 12px;
                margin-bottom: 0;
                color: #7A869A;
                text-align: right;
            }
            .nft-price-value{
                font-size: 20px;
                text-align: right;
            }
            @media(max-width: 767px){
                width: calc(50% - 14px);
                margin-right: 24px;
                &:nth-child(2n) {
                    margin-right: 0;
                }
            }
            @media(max-width: 560px){
                width: 100%;
                margin-right: 0;
            }
        }
        @media(max-width: 767px){
            .action{
                margin-left: 0;
                margin-top: 20px;
            }
        }
    }
</style>
