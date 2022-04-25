<template>
  <div id="app" class="page-layout">
      <Nav :key="renderNav" @waku="forceRerender()" :selector="selector" />
      <router-view :key="renderRouterView" @refresh="renderNav++" :selector="selector" id="view-container"/>
  </div>
</template>

<script>
import Nav from './components/Nav.vue'
import NearWalletSelector from "@near-wallet-selector/core";
import { setupNearWallet } from "@near-wallet-selector/near-wallet";
import { setupSender } from "@near-wallet-selector/sender";
import nearWalletIconUrl from "@near-wallet-selector/near-wallet/assets/near-wallet-icon.png";
import senderIconUrl from "@near-wallet-selector/sender/assets/sender-icon.png";
export default {
    name: 'App',
    components: {
        Nav
    },
    data: () => ({
        renderRouterView: 0,
        renderNav: 1,
        selector:{}
    }),
  async created(){
       this.selector=await NearWalletSelector.init({
            network:"testnet",
            contractId: process.env.VUE_APP_CONTRACT,
            wallets: [
           setupNearWallet({iconUrl: nearWalletIconUrl}),
                setupSender({iconUrl: senderIconUrl}),
            ],
          });
          this.forceRerender()
  },
    methods: {
        forceRerender() {
            this.renderNav++
            this.renderRouterView++
        }
    }
}
</script>

<style lang="scss">

@import './assets/styles/main.scss';

</style>
