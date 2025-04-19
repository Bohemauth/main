const chains = {
  data: [
    {
      name: "coston2",
      chainId: 114,
      rpcUrl: "https://coston2-api.flare.network/ext/C/rpc",
    },
  ],

  getChain: (name) => {
    return chains.data.find((chain) => chain.name === name);
  },
};

export default chains;
