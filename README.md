# 🗳️ Decentralized Voting Program (Solana + Anchor)

A decentralized voting application built on the Solana blockchain using **Anchor framework**.  
Users can vote on predefined candidates, and votes are stored on-chain securely and transparently.  
This project also includes a **Next.js frontend with Solana Actions** for an easy Blink-style voting UI.

---

## 📌 Features
- Built with **Solana Program Library (SPL)** and **Anchor**.
- Smart contract to handle:
  - Candidate initialization.
  - Casting votes.
  - Preventing double voting.
- **Next.js API routes** to expose Solana Actions (`/api/vote`) for seamless integration with wallets and blinks.


---

## 📂 Project Structure
voting-program/
├── programs/ # Anchor Rust program
│ └── voting/ # Voting smart contract logic
├── target/ # IDL & build artifacts
├── app/ # Next.js frontend
│ └── api/vote/ # Solana Action endpoints (GET, POST)
├── Anchor.toml # Anchor config
├── package.json
└── README.md



## 🚀 Getting Started

### Prerequisites
- [Rust](https://www.rust-lang.org/tools/install)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.18+ recommended)
- [Anchor CLI](https://book.anchor-lang.com/getting_started/installation.html)
- Node.js (v18+)

### 1. Clone Repo
```bash
git clone https://github.com/Deva-2002/decentralized-voting-app.git
cd decentralized-voting-app
2. Build & Deploy Program
Start a local Solana validator:
solana-test-validator
In another terminal, build and deploy the program:


anchor build
anchor deploy
This generates the IDL inside target/idl/voting.json.

3. Setup Frontend
Install dependencies:


cd app
npm install
Run the frontend locally:

bash
Copy
Edit
npm run dev
Now visit:


http://localhost:3000
🔗 Solana Action Endpoints
GET /api/vote → Returns metadata for the Blink Action.

POST /api/vote?candidate=<CANDIDATE> → Creates a transaction to cast a vote.

Example:


https://dial.to/?action=solana-action:https://localhost:3000/api/vote
🛠️ Tech Stack
Solana (on-chain program)

Anchor (IDL, Program API)

Next.js (frontend + API routes)

@solana/web3.js for transaction building

@solana/actions for Blink integration

📜 License
MIT License © 2025 Deva Krishna S J








Ask ChatGPT





ChatGPT can mak

```shell
pnpm create solana-dapp@latest -t gh:solana-foundation/templates/templates/voting
```

#### Install Dependencies

```shell
pnpm install
```

#### Start the web app

```shell
pnpm dev
```
