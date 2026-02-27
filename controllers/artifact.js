const ArtifactService = require('../services/artifactService');


async function listArtifacts(req, res) {
    try {
        const userClearance = req.user.clearanceLevel || 0;
        const artifacts = await ArtifactService.getArtifactsForUser(userClearance);
        res.status(200).json(artifacts);
    } catch (error) { 
        res.status(500).json({ message: error.message }); 
    }
}


async function createArtifact(req, res) {
    try {
        const artifact = await ArtifactService.ingestArtifact(
            req.body, 
            req.user, 
            req.ip, 
            req.headers['user-agent']
        );
        res.status(201).json(artifact);
    } catch (error) { 
        res.status(400).json({ message: error.message }); 
    }
}


async function search(req, res) {
    try {
        
        const results = await ArtifactService.searchArtifacts(req.query);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function getArtifactById(req, res) {
    try {
        const artifact = await ArtifactService.getById(req.params.id);
        if (!artifact) return res.status(404).json({ message: "Artifact missing from timeline" });

        
        if (artifact.dangerLevel > req.user.clearanceLevel) {
            return res.status(403).json({ message: "ACCESS DENIED: Item danger level exceeds your clearance." });
        }
        res.status(200).json(artifact);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function deleteArtifact(req, res) {
    try {
        
        if (req.user.clearanceLevel < 5) {
            return res.status(403).json({ message: "CRITICAL: Level 5 clearance required for timeline erasure." });
        }
        const deleted = await ArtifactService.removeArtifact(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Artifact not found." });
        
        res.status(200).json({ message: "Artifact has been successfully erased from the Archive." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function updateArtifact(req, res) {
    try {
        const artifact = await ArtifactService.getById(req.params.id);
        if (!artifact) return res.status(404).json({ message: "Artifact not found." });

        if (req.user.clearanceLevel < artifact.dangerLevel) {
            return res.status(403).json({ message: "Insufficient clearance to modify this object." });
        }

        await artifact.update(req.body);
        res.status(200).json({ message: "Artifact sequestered successfully.", artifact });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { 
    listArtifacts, 
    createArtifact, 
    getArtifactById, 
    deleteArtifact, 
    updateArtifact ,
    search
};