const { User, Group } = require('../models');
const bcrypt = require('bcryptjs');

class UserService {
    async registerAgent(userData) {
        // 1. Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // 2. Create User
        const user = await User.create({ 
            ...userData, 
            password: hashedPassword,
            accountStatus: 'Active' // Default status
        });

        // 3. Logic: Auto-assign to 'TemporalGuest' group if no group provided
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