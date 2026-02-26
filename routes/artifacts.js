const express = require('express');
const router = express.Router();
const artifactController = require('../controllers/artifact');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');

// 1. List All
router.get('/', CheckAuth, CheckPermission('artifact:read', 1), artifactController.listArtifacts);

// 2. Search (ONLY KEEP THIS ONE - IT HANDLES THE REQ/RES CORRECTLY)
router.get('/search', CheckAuth, CheckPermission('artifact:read', 1), artifactController.search);

// 3. Get By ID
router.get('/:id', CheckAuth, CheckPermission('artifact:read', 3), artifactController.getArtifactById);

// 4. Write/Update
router.post('/', CheckAuth, CheckPermission('artifact:write', 4), artifactController.createArtifact);
router.put('/:id', CheckAuth, CheckPermission('artifact:write', 4), artifactController.updateArtifact);

// 5. Delete
router.delete('/:id', CheckAuth, CheckPermission('artifact:delete', 5), artifactController.deleteArtifact);

module.exports = router;