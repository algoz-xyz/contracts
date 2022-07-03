const Algoz = artifacts.require("Algoz");
const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

contract("Algoz", (accounts) => {
    it("should set default owner as deployer", async () => {
        const instance = await Algoz.deployed();
        const owner = await instance.owner.call();
        assert.equal(owner, accounts[0], "deployer not set as owner");
    });

    it("should set the default merkle_root as migrations file", async () => {
        const instance = await Algoz.deployed();
        const merkle_root = await instance.merkle_root.call();
        assert.equal(merkle_root, "0x3454d3ce8d3cd97e4d0f42e72f9e277881d9759bebe0d86b0a005f7c7cfc72a1", "merkle_root not same as the one set in migrations file");
        const merkle_proof_length = await instance.merkle_proof_length.call();
        assert.equal(merkle_proof_length, 20, "merkle_proof_length not same as the one set in migrations file");
    });

    it("should check if modifier protects update_ownership", async () => {
        const instance = await Algoz.deployed();
        await truffleAssert.reverts(
            instance.update_ownership(accounts[2], { from: accounts[1] }),
            "This function is restricted to the contract's owner"
        );
    });

    it("should check if update_ownership works", async () => {
        const instance = await Algoz.deployed();
        await instance.update_ownership(accounts[2], { from: accounts[0] });
        const owner = await instance.owner.call();
        assert.equal(owner, accounts[2], "deployer not set as owner");
        await instance.update_ownership(accounts[0], { from: accounts[2] });
    });

    it("should check if modifier protects update_merkle_root", async () => {
        const instance = await Algoz.deployed();
        await truffleAssert.reverts(
            instance.update_merkle_root("0xaaaaaaae8d3cd97e4d0f42e72f9e277881d9759bebe0d86b0a005f7c7cfcaaaa", 20, { from: accounts[1] }),
            "This function is restricted to the contract's owner"
        );
    });

    it("should check if update_merkle_root works", async () => {
        const instance = await Algoz.deployed();
        let to_update = "0xaaaaaaae8d3cd97e4d0f42e72f9e277881d9759bebe0d86b0a005f7c7cfcaaaa";
        await instance.update_merkle_root(to_update, 20, { from: accounts[0] });
        assert.equal(to_update, "0xaaaaaaae8d3cd97e4d0f42e72f9e277881d9759bebe0d86b0a005f7c7cfcaaaa", "unable to update the merkle_root");
        await instance.update_merkle_root("0x3454d3ce8d3cd97e4d0f42e72f9e277881d9759bebe0d86b0a005f7c7cfc72a1", 20, { from: accounts[0] });
    });

    it("should check if invalid tokenId gets reverted", async () => {
        const instance = await Algoz.deployed();
        await truffleAssert.reverts(
            instance.validate_token("0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaca8a1e985c4cc1492c46ca47f5a6d827666", [
                "0x1ed42730f9430ad3c7e4610ddc8d666104522143682fcb3f01bdbce4ed24af0d",
                "0x23d0a951aa29ec303c414ae2bc29905a3848287a3ef5bd5799a0e2a18e0037e1",
                "0x9532741f900b107b3320161706e9719ba2b576719d5626047cb53b775afb59c0",
                "0xdd05b48cd416e5cb2f96a33b7c8644453775dd1f8bd71716016756ed9a18ca46",
                "0x96439af69b652f3d6ebe798d8d67f336fe9031d978f8d25a8c586f4c2c82d65e",
                "0x63fc056821a1d9176cde8f34a9b34aaf14580b17de8558aeca129ed9088d42d6",
                "0xc9b7d156e2771b12592e04d07199434b94fcbcfffccb7ba2b6d7df6d4fd08961",
                "0xa6660516123cd498a512ea283ae7d92c31e422f7eb7061c250c555037b51a3b5",
                "0x546c4976c705301a2cbadfa007ee577dd52eed53e875d711588716ea697e944e",
                "0x94798dbdc50a37126e5d4cbd7199ec9f99fcb02ae83998b9e40917ed6e978994",
                "0x84a5535d0f18948aa3c4319bb905f19be3f54cf9c25b827db7e7161b2808356a",
                "0xd679f490b1f0ce89c42fd1562bf9e39a29b1bda8673ec5f990891c1f0ee973d6",
                "0x325a40679c4338d426ba9bd753f84868e36da461fae51901d8b8876ae4bf617a",
                "0x3d75136137da4fc0b14424e1af0a2fd767e0c03b93462deb96e0f4e3085e1e43",
                "0x12aae775140d4dc2ae5c61c7954d52f2cfe26e1910d1dabd0fcf23e0cea6458e",
                "0xca897ffd0fa6ce21b08cfdc9b3fccea3735c8e2b703307f76e398548e6421a09",
                "0x1678a4a175ab196f3d8950089b56f6fb63ae0c7a05eee4930554ab28a34e7966",
                "0x5b8f01ae505eb9eea76dcdd83b191ea40b9493fda1e9a4f2deff148bb5188f9e",
                "0xa083676ce219b7707428e2d76e7062e4a83d751f6d664542e8f1be364a5b0046",
                "0xed5e20f75bda9cbf8ce35b4c5696145bfcb98b1e10d767c1ddd8874e88d32fdb"
            ], { from: accounts[0] })
        );
    });

    it("should check if invalid tokenId_proof gets reverted", async () => {
        const instance = await Algoz.deployed();
        await truffleAssert.reverts(
            instance.validate_token("0x1ed40d202aea50f3eb79883ebdf61ca8a1e985c4cc1492c46ca47f5a6d827666", [
                "0xaaaaaa30f9430ad3c7e4610ddc8d666104522143682fcb3f01bdbce4ed24af0d",
                "0x23d0a951aa29ec303c414ae2bc29905a3848287a3ef5bd5799a0e2a18e0037e1",
                "0x9532741f900b107b3320161706e9719ba2b576719d5626047cb53b775afb59c0",
                "0xdd05b48cd416e5cb2f96a33b7c8644453775dd1f8bd71716016756ed9a18ca46",
                "0x96439af69b652f3d6ebe798d8d67f336fe9031d978f8d25a8c586f4c2c82d65e",
                "0x63fc056821a1d9176cde8f34a9b34aaf14580b17de8558aeca129ed9088d42d6",
                "0xc9b7d156e2771b12592e04d07199434b94fcbcfffccb7ba2b6d7df6d4fd08961",
                "0xa6660516123cd498a512ea283ae7d92c31e422f7eb7061c250c555037b51a3b5",
                "0x546c4976c705301a2cbadfa007ee577dd52eed53e875d711588716ea697e944e",
                "0x94798dbdc50a37126e5d4cbd7199ec9f99fcb02ae83998b9e40917ed6e978994",
                "0x84a5535d0f18948aa3c4319bb905f19be3f54cf9c25b827db7e7161b2808356a",
                "0xd679f490b1f0ce89c42fd1562bf9e39a29b1bda8673ec5f990891c1f0ee973d6",
                "0x325a40679c4338d426ba9bd753f84868e36da461fae51901d8b8876ae4bf617a",
                "0x3d75136137da4fc0b14424e1af0a2fd767e0c03b93462deb96e0f4e3085e1e43",
                "0x12aae775140d4dc2ae5c61c7954d52f2cfe26e1910d1dabd0fcf23e0cea6458e",
                "0xca897ffd0fa6ce21b08cfdc9b3fccea3735c8e2b703307f76e398548e6421a09",
                "0x1678a4a175ab196f3d8950089b56f6fb63ae0c7a05eee4930554ab28a34e7966",
                "0x5b8f01ae505eb9eea76dcdd83b191ea40b9493fda1e9a4f2deff148bb5188f9e",
                "0xa083676ce219b7707428e2d76e7062e4a83d751f6d664542e8f1be364a5b0046",
                "0xed5e20f75bda9cbf8ce35b4c5696145bfcb98b1e10d767c1ddd8874e88d32fdb"
            ], { from: accounts[0] })
        );
    });

    it("should check if valid tokenId succeeds", async () => {
        const instance = await Algoz.deployed();
        await instance.validate_token("0x1ed40d202aea50f3eb79883ebdf61ca8a1e985c4cc1492c46ca47f5a6d827666", [
            "0x1ed42730f9430ad3c7e4610ddc8d666104522143682fcb3f01bdbce4ed24af0d",
            "0x23d0a951aa29ec303c414ae2bc29905a3848287a3ef5bd5799a0e2a18e0037e1",
            "0x9532741f900b107b3320161706e9719ba2b576719d5626047cb53b775afb59c0",
            "0xdd05b48cd416e5cb2f96a33b7c8644453775dd1f8bd71716016756ed9a18ca46",
            "0x96439af69b652f3d6ebe798d8d67f336fe9031d978f8d25a8c586f4c2c82d65e",
            "0x63fc056821a1d9176cde8f34a9b34aaf14580b17de8558aeca129ed9088d42d6",
            "0xc9b7d156e2771b12592e04d07199434b94fcbcfffccb7ba2b6d7df6d4fd08961",
            "0xa6660516123cd498a512ea283ae7d92c31e422f7eb7061c250c555037b51a3b5",
            "0x546c4976c705301a2cbadfa007ee577dd52eed53e875d711588716ea697e944e",
            "0x94798dbdc50a37126e5d4cbd7199ec9f99fcb02ae83998b9e40917ed6e978994",
            "0x84a5535d0f18948aa3c4319bb905f19be3f54cf9c25b827db7e7161b2808356a",
            "0xd679f490b1f0ce89c42fd1562bf9e39a29b1bda8673ec5f990891c1f0ee973d6",
            "0x325a40679c4338d426ba9bd753f84868e36da461fae51901d8b8876ae4bf617a",
            "0x3d75136137da4fc0b14424e1af0a2fd767e0c03b93462deb96e0f4e3085e1e43",
            "0x12aae775140d4dc2ae5c61c7954d52f2cfe26e1910d1dabd0fcf23e0cea6458e",
            "0xca897ffd0fa6ce21b08cfdc9b3fccea3735c8e2b703307f76e398548e6421a09",
            "0x1678a4a175ab196f3d8950089b56f6fb63ae0c7a05eee4930554ab28a34e7966",
            "0x5b8f01ae505eb9eea76dcdd83b191ea40b9493fda1e9a4f2deff148bb5188f9e",
            "0xa083676ce219b7707428e2d76e7062e4a83d751f6d664542e8f1be364a5b0046",
            "0xed5e20f75bda9cbf8ce35b4c5696145bfcb98b1e10d767c1ddd8874e88d32fdb"
        ], { from: accounts[0] });
    });

    it("should check if sibiling tokenId is invalid", async () => {
        const instance = await Algoz.deployed();
        await truffleAssert.reverts(
            instance.validate_token("0x1ed42730f9430ad3c7e4610ddc8d666104522143682fcb3f01bdbce4ed24af0d", [
                "0x1ed40d202aea50f3eb79883ebdf61ca8a1e985c4cc1492c46ca47f5a6d827666",
                "0x23d0a951aa29ec303c414ae2bc29905a3848287a3ef5bd5799a0e2a18e0037e1",
                "0x9532741f900b107b3320161706e9719ba2b576719d5626047cb53b775afb59c0",
                "0xdd05b48cd416e5cb2f96a33b7c8644453775dd1f8bd71716016756ed9a18ca46",
                "0x96439af69b652f3d6ebe798d8d67f336fe9031d978f8d25a8c586f4c2c82d65e",
                "0x63fc056821a1d9176cde8f34a9b34aaf14580b17de8558aeca129ed9088d42d6",
                "0xc9b7d156e2771b12592e04d07199434b94fcbcfffccb7ba2b6d7df6d4fd08961",
                "0xa6660516123cd498a512ea283ae7d92c31e422f7eb7061c250c555037b51a3b5",
                "0x546c4976c705301a2cbadfa007ee577dd52eed53e875d711588716ea697e944e",
                "0x94798dbdc50a37126e5d4cbd7199ec9f99fcb02ae83998b9e40917ed6e978994",
                "0x84a5535d0f18948aa3c4319bb905f19be3f54cf9c25b827db7e7161b2808356a",
                "0xd679f490b1f0ce89c42fd1562bf9e39a29b1bda8673ec5f990891c1f0ee973d6",
                "0x325a40679c4338d426ba9bd753f84868e36da461fae51901d8b8876ae4bf617a",
                "0x3d75136137da4fc0b14424e1af0a2fd767e0c03b93462deb96e0f4e3085e1e43",
                "0x12aae775140d4dc2ae5c61c7954d52f2cfe26e1910d1dabd0fcf23e0cea6458e",
                "0xca897ffd0fa6ce21b08cfdc9b3fccea3735c8e2b703307f76e398548e6421a09",
                "0x1678a4a175ab196f3d8950089b56f6fb63ae0c7a05eee4930554ab28a34e7966",
                "0x5b8f01ae505eb9eea76dcdd83b191ea40b9493fda1e9a4f2deff148bb5188f9e",
                "0xa083676ce219b7707428e2d76e7062e4a83d751f6d664542e8f1be364a5b0046",
                "0xed5e20f75bda9cbf8ce35b4c5696145bfcb98b1e10d767c1ddd8874e88d32fdb"
            ], { from: accounts[0] })
        );
    });

    it("should check if reused tokenId gets reverted", async () => {
        const instance = await Algoz.deployed();
        await truffleAssert.reverts(
            instance.validate_token("0x1ed40d202aea50f3eb79883ebdf61ca8a1e985c4cc1492c46ca47f5a6d827666", [
                "0x1ed42730f9430ad3c7e4610ddc8d666104522143682fcb3f01bdbce4ed24af0d",
                "0x23d0a951aa29ec303c414ae2bc29905a3848287a3ef5bd5799a0e2a18e0037e1",
                "0x9532741f900b107b3320161706e9719ba2b576719d5626047cb53b775afb59c0",
                "0xdd05b48cd416e5cb2f96a33b7c8644453775dd1f8bd71716016756ed9a18ca46",
                "0x96439af69b652f3d6ebe798d8d67f336fe9031d978f8d25a8c586f4c2c82d65e",
                "0x63fc056821a1d9176cde8f34a9b34aaf14580b17de8558aeca129ed9088d42d6",
                "0xc9b7d156e2771b12592e04d07199434b94fcbcfffccb7ba2b6d7df6d4fd08961",
                "0xa6660516123cd498a512ea283ae7d92c31e422f7eb7061c250c555037b51a3b5",
                "0x546c4976c705301a2cbadfa007ee577dd52eed53e875d711588716ea697e944e",
                "0x94798dbdc50a37126e5d4cbd7199ec9f99fcb02ae83998b9e40917ed6e978994",
                "0x84a5535d0f18948aa3c4319bb905f19be3f54cf9c25b827db7e7161b2808356a",
                "0xd679f490b1f0ce89c42fd1562bf9e39a29b1bda8673ec5f990891c1f0ee973d6",
                "0x325a40679c4338d426ba9bd753f84868e36da461fae51901d8b8876ae4bf617a",
                "0x3d75136137da4fc0b14424e1af0a2fd767e0c03b93462deb96e0f4e3085e1e43",
                "0x12aae775140d4dc2ae5c61c7954d52f2cfe26e1910d1dabd0fcf23e0cea6458e",
                "0xca897ffd0fa6ce21b08cfdc9b3fccea3735c8e2b703307f76e398548e6421a09",
                "0x1678a4a175ab196f3d8950089b56f6fb63ae0c7a05eee4930554ab28a34e7966",
                "0x5b8f01ae505eb9eea76dcdd83b191ea40b9493fda1e9a4f2deff148bb5188f9e",
                "0xa083676ce219b7707428e2d76e7062e4a83d751f6d664542e8f1be364a5b0046",
                "0xed5e20f75bda9cbf8ce35b4c5696145bfcb98b1e10d767c1ddd8874e88d32fdb"
            ], { from: accounts[0] })
        );
    });
});