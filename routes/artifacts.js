const express = require('express');
const router = express.Router();
const artifactController = require('../controllers/artifact');
const { CheckAuth } = require('../middlewares/auth');
const { CheckPermission } = require('../middlewares/perm');


router.get('/', CheckAuth, CheckPermission('artifact:read', 1), artifactController.listArtifacts);

router.get('/search', CheckAuth, CheckPermission('artifact:read', 1), artifactController.search);


router.get('/:id', CheckAuth, CheckPermission('artifact:read', 3), artifactController.getArtifactById);


router.post('/', CheckAuth, CheckPermission('artifact:write', 4), artifactController.createArtifact);
router.put('/:id', CheckAuth, CheckPermission('artifact:write', 4), artifactController.updateArtifact);


router.delete('/:id', CheckAuth, CheckPermission('artifact:delete', 5), artifactController.deleteArtifact);

module.exports = router;