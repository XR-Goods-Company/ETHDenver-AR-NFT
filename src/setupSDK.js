import { setup } from "@liquality/wallet-sdk";

export function setupSDK() {
  setup({
    alchemyApiKey: "J_yAB3Lb2RfbBDxudGF-1ZxOAstzseqR",
    etherscanApiKey: " ",
    infuraProjectId: "-",
    pocketNetworkApplicationID: "-",
    quorum: 1,
    slowGasPriceMultiplier: 1,
    averageGasPriceMultiplier: 1.5,
    fastGasPriceMultiplier: 2,
    gasLimitMargin: 2000,
  });
}