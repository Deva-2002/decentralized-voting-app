import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VotingProgram } from "../target/types/voting_program";
import { BN } from "bn.js";
import { expect } from "chai";

describe("voting-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.votingProgram as Program<VotingProgram>;

  it("initialize poll", async () => {
    // Add your test here.
    const tx = await program.methods.initializePoll(
      new BN(1),
      "this is a testing string",
      new BN(0),
      new BN(1855630645)
    ).rpc();
    console.log("Your transaction signature", tx);

    const [pdaAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("poll"),
      new anchor.BN(1).toArrayLike(Buffer, 'le', 8)
      ],
      program.programId
    )

    const pda_account = await program.account.poll.fetch(pdaAddress);
    console.log(pda_account);

    expect(pda_account.pollId.toNumber()).is.equal(1);
    expect(pda_account.description).is.equal("this is a testing string");
  });

  it('initialize candidate', async () => {
    const tx1 = await program.methods.initializeCandidate(
      "testing candidate 1",
      new BN(1)
    ).rpc();
    console.log("Your transaction signature", tx1);

    const tx2 = await program.methods.initializeCandidate(
      "testing candidate 2",
      new BN(1)
    ).rpc();
    console.log("Your transaction signature", tx2);

    const [candidate1Address] = anchor.web3.PublicKey.findProgramAddressSync([
      Buffer.from("testing candidate 1"),
      new anchor.BN(1).toArrayLike(Buffer, 'le', 8)
    ], program.programId)

    const candidate1 = await program.account.candidateAccount.fetch(candidate1Address);
    // console.log(candidate1);
    expect(candidate1.candidateName).is.equal("testing candidate 1");
    expect(candidate1.candidateVote.toNumber()).is.equal(0);

    const [candidate2Address] = anchor.web3.PublicKey.findProgramAddressSync([
      Buffer.from("testing candidate 2"),
      new anchor.BN(1).toArrayLike(Buffer, 'le', 8)
    ], program.programId)

    const candidate2 = await program.account.candidateAccount.fetch(candidate2Address);
    // console.log(candidate2);

     expect(candidate2.candidateName).is.equal("testing candidate 2");
    expect(candidate2.candidateVote.toNumber()).is.equal(0);
  })

  it('voting',async()=>{
    const tx1=await program.methods.vote(
      "testing candidate 1",
      new anchor.BN(1)
    ).rpc();

    const tx2=await program.methods.vote(
      "testing candidate 1",
      new anchor.BN(1)
    ).rpc();


    const [candidate1Address] = anchor.web3.PublicKey.findProgramAddressSync([
      Buffer.from("testing candidate 1"),
      new anchor.BN(1).toArrayLike(Buffer, 'le', 8)
    ], program.programId)

    const candidate1 = await program.account.candidateAccount.fetch(candidate1Address);
    // console.log(candidate1);
    expect(candidate1.candidateName).is.equal("testing candidate 1");
    expect(candidate1.candidateVote.toNumber()).is.equal(2);
  }
)

});

