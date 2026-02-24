const { Artifact, Vault, User, AuditLog } = require("../models");

async function listArtifacts(req, res) {
    try {
        // Pentest Logic: Only show artifacts within the user's clearance level
        const userClearance = req.user.clearance || 0;
        
        const artifacts = await Artifact.findAll({
            where: {
                dangerLevel: {
                    [require('sequelize').Op.lte]: userClearance // Only artifacts <= user level
                }
            },
            include: [{ model: Vault, as: 'vault' }] 
        });
        
        res.status(200).json(artifacts);
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
}

async function createArtifact(req, res) {
    try {
        // Create the artifact
        const artifact = await Artifact.create(req.body);

        // Security Requirement: Log the creation of new high-risk items
        await AuditLog.create({
            userId: req.user.id,
            action: 'CREATE_ARTIFACT',
            targetId: `ARTIFACT_${artifact.id}`,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(201).json(artifact);
    } catch (error) { 
        res.status(400).json({ message: error.message }); 
    }
}

async function getArtifactById(req, res) {
    try {
        const artifact = await Artifact.findByPk(req.params.id, {
            include: [{ model: Vault, as: 'vault' }]
        });

        if (!artifact) return res.status(404).json({ message: "Artifact missing from timeline" });

        // Vertical Security Check: Ensure user hasn't bypassed middleware to see higher danger items
        if (artifact.dangerLevel > req.user.clearance) {
            return res.status(403).json({ message: "ACCESS DENIED: Item danger level exceeds your clearance." });
        }

        res.status(200).json(artifact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



async function updateArtifact(req, res) {
    try {
        const { id } = req.params;
        const artifact = await Artifact.findByPk(id);

        if (!artifact) return res.status(404).json({ message: "Artifact not found." });

        // Security Check: Only allow if user clearance >= current artifact danger level
        if (req.user.clearance < artifact.dangerLevel) {
            return res.status(403).json({ message: "Insufficient clearance to modify this object." });
        }

        await artifact.update(req.body);
        
        res.status(200).json({ message: "Artifact sequestered successfully.", artifact });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = { listArtifacts, createArtifact, getArtifactById , updateArtifact };