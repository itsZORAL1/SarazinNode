const { User, Group, Permission } = require('../models');

const getUserScopes = async (userId) => {
    const user = await User.findByPk(userId, {
        include: [{
            model: Group,
            as: 'groups',
            include: [{
                model: Permission,
                as: 'permissions',
                attributes: ['scope']
            }]
        }]
    });

    if (!user || !user.groups) return [];


    const scopes = user.groups.flatMap(group => 
        group.permissions.map(p => p.scope)
    );

  
    return [...new Set(scopes)];
};

module.exports = { getUserScopes };