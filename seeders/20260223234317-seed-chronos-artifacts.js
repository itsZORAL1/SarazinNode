'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const [vaults] = await queryInterface.sequelize.query('SELECT id FROM "Vaults" LIMIT 1;');
    const [anomalies] = await queryInterface.sequelize.query('SELECT id FROM "Anomalies" LIMIT 1;');

    const vaultId = vaults[0]?.id;
    const anomalyId = anomalies[0]?.id;

    await queryInterface.bulkInsert('Artifacts', [
      {
        name: 'Roman Digital Watch',
        serialNumber: 'ART-001-CASIO',
        originEra: '79 AD (Pompeii)',
        dangerLevel: 1,
        status: 'SECURE',
        vaultId: vaultId,
        anomalyId: anomalyId, // Linking to the detected Anomaly
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Paradox Compass',
        serialNumber: 'ART-999-OMEGA',
        originEra: 'Unknown / End of Time',
        dangerLevel: 5,
        status: 'CONTAINED',
        vaultId: vaultId,
        anomalyId: anomalyId, // High-level link
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Victorian Steam-Powered Smartphone',
        serialNumber: 'ART-042-BABBAGE',
        originEra: '1888 (London)',
        dangerLevel: 3,
        status: 'RESEARCH',
        vaultId: vaultId,
        anomalyId: anomalyId, // Research link
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Artifacts', null, {});
  }
};