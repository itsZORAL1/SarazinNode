const { User, Group } = require('../models');
const bcrypt = require('bcryptjs');

class UserService {
    async registerAgent(userData) {
        
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        
        const user = await User.create({ 
            ...userData, 
            password: hashedPassword,
            accountStatus: 'Active' 
        });

        
        const guestGroup = await Group.findOne({ where: { name: 'TemporalGuest' } });
        if (guestGroup) {
            await user.addGroup(guestGroup);
        }

        return user;
    }

    async getAgentProfile(userId) {
        return await User.findByPk(userId, {
            attributes: { exclude: ['password'] },
            include: ['groups', 'devices']
        });
    }
}

module.exports = new UserService();