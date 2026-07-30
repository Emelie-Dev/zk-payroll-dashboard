import { describe, it, expect, vi, afterEach } from "vitest";

// ── Mock Freighter API / Stellar SDK ────────────────────────────────────────
// Mirrors __tests__/network-guard.test.tsx so StellarProvider can be imported
// without touching the real Freighter extension or Soroban RPC.

vi.mock("@stellar/freighter-api", () => ({
  isConnected: vi.fn().mockResolvedValue({ isConnected: false }),
  isAllowed: vi.fn().mockResolvedValue({ isAllowed: false }),
  setAllowed: vi.fn().mockResolvedValue({ isAllowed: false }),
  getAddress: vi.fn().mockResolvedValue({ address: null, error: "not connected" }),
  getNetwork: vi
    .fn()
    .mockResolvedValue({ network: "TESTNET", networkPassphrase: "Test SDF Network ; September 2015" }),
  signTransaction: vi.fn(),
}));

vi.mock("@stellar/stellar-sdk", () => ({
  Contract: vi.fn(),
  TransactionBuilder: vi.fn(),
  BASE_FEE: "100",
}));

vi.mock("@stellar/stellar-sdk/rpc", () => ({
  Api: { isSimulationError: vi.fn().mockReturnValue(false) },
  assembleTransaction: vi.fn(),
  Server: vi.fn(),
}));

// This suite is isolated in its own file because each test calls
// vi.resetModules() to force StellarProvider's module-level EXPECTED_NETWORK
// constant to be recomputed against a different process.env value. Running
// that alongside tests that rely on a stable module registry (e.g. tests
// that mutate the real useWalletStore singleton) would make those tests
// see a different store instance than the one components resolve at render.

describe("Wallet Network Mismatch Detection: EXPECTED_NETWORK sourced from environment", () => {
  const ORIGINAL_NETWORK_ENV = process.env.NEXT_PUBLIC_STELLAR_NETWORK;

  afterEach(() => {
    if (ORIGINAL_NETWORK_ENV === undefined) {
      delete process.env.NEXT_PUBLIC_STELLAR_NETWORK;
    } else {
      process.env.NEXT_PUBLIC_STELLAR_NETWORK = ORIGINAL_NETWORK_ENV;
    }
  });

  it("reads the expected network from NEXT_PUBLIC_STELLAR_NETWORK when set to a supported value", async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "PUBLIC";

    const { EXPECTED_NETWORK } = await import("@/components/providers/StellarProvider");

    expect(EXPECTED_NETWORK).toBe("PUBLIC");
  });

  it("defaults to TESTNET when NEXT_PUBLIC_STELLAR_NETWORK is unset", async () => {
    vi.resetModules();
    delete process.env.NEXT_PUBLIC_STELLAR_NETWORK;

    const { EXPECTED_NETWORK } = await import("@/components/providers/StellarProvider");

    expect(EXPECTED_NETWORK).toBe("TESTNET");
  });

  it("defaults to TESTNET when NEXT_PUBLIC_STELLAR_NETWORK holds an unsupported value", async () => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_STELLAR_NETWORK = "DEVNET";

    const { EXPECTED_NETWORK } = await import("@/components/providers/StellarProvider");

    expect(EXPECTED_NETWORK).toBe("TESTNET");
  });
});
