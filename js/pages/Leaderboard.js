export default {
    data() {
        return {
            allUsers: []
        }
    },
    mounted() {
        this.updateLeaderboard();
    },
    methods: {
        updateLeaderboard() {
            this.allUsers = JSON.parse(localStorage.getItem('users')) || [];
            this.allUsers.sort((a, b) => b.points - a.points);
        }
    },
    template: `
        <div style="padding: 40px; max-width: 600px; margin: 0 auto; text-align: center;">
            <h1 style="font-family: 'Lexend Deca'; font-size: 32px; margin-bottom: 30px;">Leaderboard</h1>
            
            <div style="background: white; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
                <div style="display: flex; justify-content: space-between; background: #2b6ef0; color: white; padding: 15px 20px; font-weight: bold;">
                    <span>Player</span>
                    <span>Points</span>
                </div>
                
                <div v-for="(user, index) in allUsers" :key="user.username" style="display: flex; justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid #f0f0f0;">
                    <div>
                        <span style="font-weight: bold; color: #999; margin-right: 10px;">#{{ index + 1 }}</span>
                        <span style="font-weight: 600;">{{ user.username }}</span>
                    </div>
                    <span style="font-weight: bold; color: #2b6ef0;">{{ user.points }}</span>
                </div>

                <div v-if="allUsers.length === 0" style="padding: 40px; color: #999;">
                    No players registered yet.
                </div>
            </div>
        </div>
    `
};
