const { Artifact, Vault, IncidentReport, AuditLog } = require('../models');

class ContainmentService {
    async checkVaultIntegrity(vaultId) {
        const vault = await Vault.findByPk(vaultId, {
            include: [{ model: Artifact, as: 'artifacts' }]
        });

        if (!vault) throw new Error("Vault not found.");

        const artifactCount = vault.artifacts.length;
        const overCapacity = artifactCount > vault.maxCapacity;
        
        
        const dangerousArtifacts = vault.artifacts.filter(a => a.dangerLevel > 4);

        if (overCapacity || dangerousArtifacts.length > 0) {
           
            const report = await IncidentReport.create({
                vaultId: vault.id,
                title: "CONTAINMENT INSTABILITY DETECTED",
                description: overCapacity 
                    ? `Vault at ${vault.locationName} exceeded capacity (${artifactCount}/${vault.maxCapacity}).`
                    : `High-threat artifacts detected in Low-Security Vault.`,
                severity: "HIGH",
                status: "OPEN"
            });

           
            await AuditLog.create({
                action: 'SECURITY_ALERT',
                targetId: `VAULT_${vault.id}`,
                details: `Incident #${report.id}: Containment integrity at ${vault.locationName} is COMPROMISED.`,
                ipAddress: 'SYSTEM_INTERNAL'
            });

            return { status: "CRITICAL", report };
        }

        return { status: "SECURE", message: "All artifacts stabilized." };
    }
}

module.exports = new ContainmentService();