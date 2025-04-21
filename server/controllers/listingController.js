import { generateProof } from "../utils/shamir.js";

const addListing = async (req, res) => {
  try {
    const shard1 =
      "0x4c1200009e1d0000080300005916000070130000b9030000b41a000027160000f00c00007b0d0000d6090000e3190000e1100000b7190000970c0000c910000074100000130e000022180000ba14000098180000ef180000e51400000d1d0000231d0000ce0f0000bf1b0000071d000002110000d11600008d0b00003b070000";
    const shard2 =
      "0x55240000fe3a0000ce050000a02c000056260000a00600002f350000802b0000731900003f1a000009130000f93200001d210000a6320000471800000721000008200000b71b0000742f0000ff280000c0300000123100009c29000060390000ce390000561f000048370000b1390000b1210000c22c0000ed1600005d0e0000";

    const shardHash =
      "0x07487f6f1a3b99d81574c0e3f0640a5f2e8df23b65cb4e06cfe22465de310e43";

    const id = "3abb0d08-c383-4103-9cb8-59ff80d0c7a8";

    const proof = await generateProof({ shard1, shard2 }, id, shardHash);

    return res.json({
      success: true,
      message: "Listing added successfully",
      proof,
    });
  } catch (error) {
    console.error("Add listing error:", error);
    return res.json({
      success: false,
      message: "Failed to add listing",
      error: error.message,
    });
  }
};

export { addListing };
