// src/utils/getWalletConnectUri.ts
async function getWalletConnectUri(connector, version) {
  const provider = await connector.getProvider();
  return version === "2" ? new Promise((resolve) => provider.once("display_uri", resolve)) : provider.connector.uri;
}

// src/wallets/getWalletConnectConnector.ts
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletConnectLegacyConnector } from "wagmi/connectors/walletConnectLegacy";
var sharedConnectors = /* @__PURE__ */ new Map();
function createConnector(version, config) {
  const connector = version === "1" ? new WalletConnectLegacyConnector(config) : new WalletConnectConnector(config);
  sharedConnectors.set(JSON.stringify(config), connector);
  return connector;
}
function getWalletConnectConnector({
  chains,
  options = {},
  projectId,
  version = "2"
}) {
  if (version === "2" && !projectId)
    throw new Error("No projectId found. Every dApp must now provide a WalletConnect Cloud projectId to enable WalletConnect v2 https://www.rainbowkit.com/docs/installation");
  const config = {
    chains,
    options: version === "1" ? {
      qrcode: false,
      ...options
    } : {
      projectId,
      showQrModal: false,
      ...options
    }
  };
  const serializedConfig = JSON.stringify(config);
  const sharedConnector = sharedConnectors.get(serializedConfig);
  return sharedConnector != null ? sharedConnector : createConnector(version, config);
}

export {
  getWalletConnectUri,
  getWalletConnectConnector
};