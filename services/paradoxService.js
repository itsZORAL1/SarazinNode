const { Anomaly, Artifact, Vault } = require('../models');

class ParadoxService {
    async triggerParadoxCheck(vaultId) {
        const roll = Math.random() * 100;
        
        
        if (roll < 5) {
            const vault = await Vault.findByPk(vaultId);
            if (!vault.securityProtocol.includes('Quantum')) {
                return await Anomaly.create({
                    type: 'Temporal Leak',
                    location: vault.locationName,
                    severity: 3,
                    status: 'OPEN',
                    timelineId: 1 
                });
            }
        }
        return null;
    }
}
module.exports = new ParadoxService();