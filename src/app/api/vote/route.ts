import { ActionGetResponse, ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { VotingProgram } from "../../../../voting-program/target/types/voting_program";
import { BN, Program } from "@coral-xyz/anchor";

import IDL from '../../../../voting-program/target/idl/voting_program.json';

export const OPTIONS = GET;

export async function GET(request: Request) {
    const actionMetdata: ActionGetResponse = {
        icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYXGaYUOf5kFw_UU0vepUucaxbiHst2P0YEw&s",
        title: "Vote for the president",
        description: "Vote between Trump and Biden.",
        label: "Vote",
        links: {
            actions: [
                {
                    type: "transaction",
                    label: "Vote for Trump",
                    href: "/api/vote?candidate=Trump",
                },
                {
                    type: "transaction",
                    label: "Vote for Biden",
                    href: "/api/vote?candidate=Biden",
                }
            ]
        }
    };
    return Response.json(actionMetdata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
    const url = new URL(request.url);
    const candidate = url.searchParams.get("candidate");

    if (candidate != "Trump" && candidate != "Biden") {
        return new Response("Invalid candidate", { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const connection = new Connection("http://127.0.0.1:8899", "confirmed");
    const program: Program<VotingProgram> = new Program(IDL, { connection });

    const body: ActionPostRequest = await request.json();
    let voter;

    try {
        voter = new PublicKey(body.account);
    } catch (error) {
        return new Response("Invalid account", { status: 400, headers: ACTIONS_CORS_HEADERS });
    }

    const instruction = await program.methods
        .vote(candidate, new BN(1))
        .accounts({
            signer: voter,
        })
        .instruction();

    const blockhash = await connection.getLatestBlockhash();

    const transaction = new Transaction({
        feePayer: voter,
        blockhash: blockhash.blockhash,
        lastValidBlockHeight: blockhash.lastValidBlockHeight,
    }).add(instruction);

    const response = await createPostResponse({
        fields: {
              type: "transaction",   
            transaction: transaction
        }
    });

    return Response.json(response, { headers: ACTIONS_CORS_HEADERS });

}

