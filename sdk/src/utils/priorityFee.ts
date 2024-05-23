import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

export async function getPriorityFeeEstimate(priorityLevel, transaction, RPC_URL) {
 const response = await fetch(RPC_URL, {
   method: "POST",
   headers: { "Content-Type": "application/json" },
   body: JSON.stringify({
     jsonrpc: "2.0",
     id: "1",
     method: "getPriorityFeeEstimate",
     params: [
       {
         transaction: bs58.encode(transaction.serialize()), // Pass the serialized transaction in Base58
         options: { priorityLevel: priorityLevel },
       },
     ],
   }),
 });

 const data = await response.json();
 console.log(
   "Fee in function for",
   priorityLevel,
   " :",
   data.result.priorityFeeEstimate
 );
 return data.result;
}