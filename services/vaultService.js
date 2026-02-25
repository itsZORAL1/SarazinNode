const { Vault, Artifact } = require('../models');

class VaultService {
    async findOptimalVault(dangerLevel) {
        // Logic: Level 5 items MUST go to "Lead-Lined" vaults
        const vaults = await Vault.findAll();
        
        const bestVault = vaults.find(v => {
            if (dangerLevel >= 4) return v.securityProtocol.includes('Lead-Lined');
            return v.currentLoad < v.maxCapacity;
        });

        if (!bestVault) throw new Error("No secure vaults available for this danger level.");
        return bestVault;
    }
}
module.exports = new VaultService();