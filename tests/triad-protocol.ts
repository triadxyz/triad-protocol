import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TriadProtocol } from "../target/types/triad_protocol";

describe("triad-protocol", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TriadProtocol as Program<TriadProtocol>;

  it("Is initialized!", async () => {});
});
