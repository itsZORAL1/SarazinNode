const express = require('express');
const router = express.Router();
const artifactController = require('../controllers/artifact');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');

// Every Agent can see basic artifacts (Level 1)
router.get('/', CheckAuth, CheckPermission('artifact:read', 1), artifactController.listArtifacts);

// Only Level 3 Agents can see specific details of classified objects
router.get('/:id', CheckAuth, CheckPermission('artifact:read', 3), artifactController.getArtifactById);

// Only High-Level Archivists (Level 4) can register new artifacts
router.post('/', CheckAuth, CheckPermission('artifact:write', 4), artifactController.createArtifact);
router.put('/:id', CheckAuth, CheckPermission('artifact:write', 4), artifactController.updateArtifact);

router.delete('/:id', CheckAuth, CheckPermission('artifact:delete', 5), artifactController.deleteArtifact);

module.exports = router;