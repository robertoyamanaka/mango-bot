# AI Community Rewards + Telegram Mini App

A Telegram Mini App (TMA) that rewards active community participation through AI-powered analysis and blockchain rewards, powered by Dynamic wallet integration.

## Overview

This project combines Telegram's Mini App functionality with AI-driven community engagement tracking and blockchain rewards. It:
- Analyzes and scores user interactions in Telegram communities
- Distributes ERC20 token rewards across Starknet and EVM chains
- Provides seamless wallet integration through Dynamic
- Ensures secure data handling with Phala Network and Nillion

## Quick Start

1. Create a Telegram Bot:
   - Use [BotFather](https://core.telegram.org/bots/tutorial#getting-ready) to create your bot
   - Save the Bot TOKEN for later use

2. Setup the project:
   ```bash
   git clone <repository-url>
   cp .env.sample .env
   ```
   Update `.env` with:
   - Your Dynamic environment ID (`NEXT_PUBLIC_DYNAMIC_ENV_ID`)
   - Bot TOKEN from Telegram
   - Website URL as LOGIN_URL

3. Deploy the website:
   - Follow [Vercel deployment guide](https://vercel.com/docs/deployments/git#deploying-a-git-repository)
   - Or use your preferred hosting solution

4. Configure Telegram Mini App:
   - Use BotFather to [set up your Mini App](https://docs.ton.org/develop/dapps/telegram-apps/step-by-step-guide#3-set-up-bot-mini-app)
   - Add your deployed website URL

5. Run the Telegram bot:
   ```bash
   # Install ts-node if you haven't already
   npm -g i ts-node
   
   # Run the bot
   ts-node scripts/bot.ts
   ```

6. Test the integration:
   - Go to your Telegram Bot
   - Type `/start`

## Technical Architecture

The system leverages several key technologies:

- **AI Processing & Security**
  - Phala Network for Remote Attestation
  - Red Pill API for conversation analysis

- **Data Privacy**
  - Nillion for encrypted storage
  - Secure API endpoints for data access

- **Blockchain Integration**
  - Dynamic for embedded wallets
  - Multi-chain support (Starknet & EVM)

## Environment Variables

BOT_TOKEN=your_telegram_bot_token
LOGIN_URL=your_deployed_website_url


## Resources

- [Build Around the Telegram Ecosystem](https://www.dynamic.xyz/ecosystems/telegram)
- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Dynamic Documentation](https://docs.dynamic.xyz)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
