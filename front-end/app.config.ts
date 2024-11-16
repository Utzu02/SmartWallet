import 'dotenv/config'; // To load environment variables from the .env file
import { ExpoConfig } from '@expo/config-types'; // Import Expo config types

const config: ExpoConfig = {
  name: "Smart Wallet",
  slug: "smart-wallet", // Define your slug
  extra: {
    googleCloudApiKey: process.env.GOOGLE_CLOUD_API_KEY, // Access API key from the .env file
  },
};

export default config;