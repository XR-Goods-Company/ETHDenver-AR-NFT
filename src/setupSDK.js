import { setup } from "@liquality/wallet-sdk";

export function setupSDK() {
  setup({
    alchemyApiKey: "J_yAB3Lb2RfbBDxudGF-1ZxOAstzseqR",
    etherscanApiKey: "4WDBB6U3MKACZRP896S9I76N547VJ7D3PS",
    infuraProjectId: "2MToeVkdTOU1HtVd3JzbZMAlH3J",
    pocketNetworkApplicationID: "-",
    quorum: 1,
    slowGasPriceMultiplier: 1,
    averageGasPriceMultiplier: 1.5,
    fastGasPriceMultiplier: 2,
    gasLimitMargin: 2000,
  });
}

export function getPrivateKey() {
  return JSON.parse().loginResponse.privateKey;
}