// Import the store so we can add points
import { store } from '../main.js';

export default {
    data() {
        return {
            // Replace these with your actual levels
            levels: [
                { id: 1, name: "The Forgotten Dungeon", points: 50 },
                { id: 2, name: "The Crystal Cavern", points: 75 },
                { id: 3, name: "The Dragon's Peak", points: 100 }
            ]
        }
    },
    methods: {
        beatLevel(level) {
            // Check if user is logged in
            if (!store.user) {
                alert("You must be logged in to track your progress!");
                this.$router.push('/login');
                return;
            }
            
            // Attempt to add points
            const success = store.addPoints(level.points, level.id);
            if (success) {
                alert(`You beat ${level.name}! +${level.points} points added.`);
            }
        }
    },
    template: `
        <div style="padding: 40px; max-width: 600px; margin: 0 auto; text-align: center;">
            <h1 style="font-family: 'Lexend Deca'; font-size: 32px; margin-bottom: 30px;">Larp List Levels</h1>
            
            <div v-if="store.user" style="margin-bottom: 20px; color: #2b6ef0; font-weight: bold;">
                Logged in as: <span style="background: #e6f7ff; padding: 4px 12px; border-radius: 12px;">{{ store.user.username }} ({{ store.user.points }} Points)</span>
            </div>
            <div v-else style="margin-bottom: 20px; color: #999;">
                <a href="#/login" style="color: #2b6ef0;">Login</a> to track your progress!
            </div>
            
            <div v-for="level in levels" :key="level.id" style="background: white; border: 1px solid #e0e0e0; padding: 20px; margin-bottom: 15px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="margin: 0; font-size: 18px;">{{ level.name }}</h3>
                    <span style="color: #666; font-size: 14px;">+{{ level.points }} points</span>
                </div>
                <button @click="beatLevel(level)" style="padding: 8px 20px; background: #2b6ef0; color: white; border: none; border-radius: 20px; font-weight: bold; cursor: pointer;">Beat Level</button>
            </div>
        </div>
    `
};
