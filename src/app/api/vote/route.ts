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
                    label: "Vote for Crunchy",
                    href: "/api/vote?candidate=Trump",
                },
                {
                    type: "transaction",
                    label: "Vote for Smooth",
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

// import { NextRequest, NextResponse } from "next/server"
// import {ActionGetResponse, ACTIONS_CORS_HEADERS} from "@solana/actions"
// import { headers } from "next/headers";
// import { request } from "http";

// export const OPTIONS=GET;

// export async function GET(request:NextRequest){
//     const actionMetadata:ActionGetResponse={
//         icon:"https://cdn.britannica.com/69/234469-050-B883797B/Rottweiler-dog.jpg",
//         title:"do you like rottweiler",
//         description:"choose your favourite pet",
//         label:"Vote App",
//         links:{
//             actions:[
//                 {
//                     type: "transaction", 
//                     label:"vote for dog",
//                     href:"/api/vote?candidate=dog"
//                 },
//                 {
//                     type: "transaction", 
//                     label:"vote for cat",
//                     href:"/api/vote?candidate=cat"
//                 }
//             ]
//         }
//     };
//     return Response.json(actionMetadata,{headers:ACTIONS_CORS_HEADERS});
// }

// export async function POST(req:NextRequest) {
//     const url=new URL(req.url);
//     const url_param=url.searchParams.get("candidate");

//     if(url_param!=="dog" && url_param!=="cat"){
//         return new Response("invalid candidate",{status:400,headers:ACTIONS_CORS_HEADERS})
//     }
// }