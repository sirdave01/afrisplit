# AfriSplit

AfriSplit is a mobile-first group expense app for African social spending. It keeps a clear record of who paid, calculates each person's exact share, and gives group members a simple way to settle up with Pollar.

The project is being built for the Pollar hackathon: **build something real that moves money**. AfriSplit focuses on a familiar use case first, while leaving room for an Africa-to-Latin-America payment corridor later.

## Problems And Solutions

- **Unclear group expenses:** AfriSplit records expenses and shows each person's exact balance.
- **Difficult small collections:** A member can use **Pay my share** instead of exchanging bank details in the group chat.
- **Crypto complexity:** Pollar can handle wallets, social login, gas sponsorship, and payment rails behind a simple user action.
- **African social spending patterns:** The product is designed around group hangs, contributions, mobile-first use, and local payment habits.
- **Africa-Latin America transfers:** The same payment foundation can connect African funding or cash-out rails to Pollar's live Bolivian BOB ramp.

## How It Works

1. Create a group for a meal, trip, event, or shared contribution.
2. Add the people who took part.
3. Record expenses and who paid them.
4. AfriSplit calculates balances and each person's share.
5. A member selects **Pay my share** and completes the Pollar payment flow without needing to understand wallets or gas.

## Pollar Integration

AfriSplit uses the Pollar SDK packages included in this project:

- `@pollar/core` for payment and wallet functionality.
- `@pollar/react` for integrating the flow into the Next.js interface.

The intended settlement flow is non-custodial: AfriSplit tracks the expense and amount due, while Pollar handles the payment experience. The app should never store users' private keys or custody their funds.

### Flagship Corridor Extension

The next corridor-focused version can support:

1. A user in an African country chooses a local funding or cash-out method, such as mobile money, bank transfer, P2P, or an agent.
2. That amount is connected to Pollar's payment infrastructure.
3. The recipient lands in Bolivia through Pollar's BOB ramp.

For the hackathon, the African-side rail can be a sandbox or documented semi-manual flow. The important product boundary is explicit: AfriSplit handles the group payment experience, and Pollar connects the value movement.

## Tech Stack

- Next.js 16 with the App Router
- React 19 and TypeScript
- MongoDB with Mongoose for groups, members, and expenses
- Pollar Core and React SDKs
- Tailwind CSS

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local`:

   ```bash
   MONGODB_URI=mongodb://127.0.0.1:27017/afrisplit
   ```

   Use a MongoDB Atlas connection string instead when running against a hosted database. Add the Pollar credentials required by the environment when the payment flow is enabled; keep secrets in `.env.local` and never commit them.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Useful Scripts

```bash
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Create a production build
npm run start    # Serve the production build
```

## Current Status

The project currently contains the Next.js app structure, Pollar dependencies, MongoDB connection layer, and the initial product routes/components. The expense, group, user, and payment workflows are the next implementation steps for the hackathon demo.

## Responsible Money Movement

AfriSplit is a hackathon prototype. Payment availability, KYC requirements, supported African rails, exchange rates, fees, and settlement timing must be confirmed with Pollar before production use. Test with sandbox or small controlled amounts only.
