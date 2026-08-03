import routes from './routes.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    user: JSON.parse(localStorage.getItem('user')) || null, 
    
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },

    // LOGIN
    login(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(u => u.username === username && u.password === password);
        if (foundUser && !foundUser.banned) { // Check if banned
            this.user = foundUser;
            localStorage.setItem('user', JSON.stringify(foundUser));
            return true;
        } else if (foundUser && foundUser.banned) {
            alert("This account has been banned.");
            return false;
        }
        return false;
    },

    // REGISTER
    register(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.username === username)) return false;

        const newUser = { username, password, points: 0, levelsBeaten: [], banned: false };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        this.user = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
    },

    // ADD POINTS
    addPoints(pointsToAdd, levelId) {
        if (!this.user) return false;
        if (this.user.levelsBeaten.includes(levelId)) {
            alert("You've already beaten this level!");
            return false;
        }

        this.user.points += pointsToAdd;
        this.user.levelsBeaten.push(levelId);

        let allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = allUsers.findIndex(u => u.username === this.user.username);
        if (userIndex !== -1) {
            allUsers[userIndex] = this.user;
            localStorage.setItem('users', JSON.stringify(allUsers));
        }

        localStorage.setItem('user', JSON.stringify(this.user));
        return true;
    },

    // ADMIN: BAN USER
    banUser(username) {
        if (this.user.username !== "larpuk") return; // Only larpuk can ban

        let allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = allUsers.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            allUsers[userIndex].banned = true;
            localStorage.setItem('users', JSON.stringify(allUsers));
            
            // If the user is currently logged in and was just banned, force logout them
            if (this.user.username === username) {
                this.logout();
            }
            return true;
        }
        return false;
    },

    // ADMIN: UNBAN USER
    unbanUser(username) {
        if (this.user.username !== "larpuk") return; // Only larpuk can unban

        let allUsers = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = allUsers.findIndex(u => u.username === username);
        
        if (userIndex !== -1) {
            allUsers[userIndex].banned = false;
            localStorage.setItem('users', JSON.stringify(allUsers));
            return true;
        }
        return false;
    },

    logout() {
        this.user = null;
        localStorage.removeItem('user');
    }
});

// --- ADMIN PANEL COMPONENT ---
const AdminPanel = {
    data() {
        return {
            users: [],
            showPanel: false
        }
    },
    mounted() {
        this.loadUsers();
    },
    methods: {
        loadUsers() {
            this.users = JSON.parse(localStorage.getItem('users')) || [];
        },
        handleBan(username) {
            if(confirm(`Are you sure you want to ban ${username}?`)) {
                store.banUser(username);
                this.loadUsers();
            }
        },
        handleUnban(username) {
            if(confirm(`Unban ${username}?`)) {
                store.unbanUser(username);
                this.loadUsers();
            }
        }
    },
    template: `
        <div>
            <!-- Floating button only visible to larpuk -->
            <button v-if="store.user && store.user.username === 'larpuk'" @click="showPanel = !showPanel" style="
                position: fixed; 
                bottom: 20px; 
                right: 20px; 
                z-index: 999; 
                padding: 15px 20px; 
                background: #2b6ef0; 
                color: white; 
                border: none; 
                border-radius: 50px; 
                font-weight: bold; 
                font-family: 'Lexend Deca', sans-serif;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                cursor: pointer;
            ">
                Admin Panel
            </button>

            <!-- Side Panel -->
            <div v-if="showPanel" style="
                position: fixed; 
                bottom: 80px; 
                right: 20px; 
                z-index: 999; 
                width: 300px; 
                max-height: 500px; 
                background: white; 
                border-radius: 12px; 
                padding: 20px; 
                box-shadow: 0 4px 20px rgba(0,0,0,0.2);
                overflow-y: auto;
                font-family: 'Lexend Deca', sans-serif;
            ">
                <h3 style="margin: 0 0 15px 0; color: #2b6ef0;">Admin Controls</h3>
                <div v-for="user in users" :key="user.username" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 8px 0;">
                    <div>
                        <span style="font-weight: 600; font-size: 14px;">{{ user.username }}</span>
                        <span v-if="user.banned" style="margin-left: 8px; font-size: 10px; background: #ff4d4f; color: white; padding: 2px 8px; border-radius: 10px;">BANNED</span>
                    </div>
                    <button v-if="!user.banned" @click="handleBan(user.username)" style="background: #ff4d4f; color: white; border: none; padding: 4px 12px; border-radius: 12px; cursor: pointer; font-size: 12px; font-family: 'Lexend Deca', sans-serif;">Ban</button>
                    <button v-else @click="handleUnban(user.username)" style="background: #52c41a; color: white; border: none; padding: 4px 12px; border-radius: 12px; cursor: pointer; font-size: 12px; font-family: 'Lexend Deca', sans-serif;">Unban</button>
                </div>
                <button @click="showPanel = false" style="width: 100%; margin-top: 15px; padding: 8px; background: #f0f2f5; border: none; border-radius: 8px; cursor: pointer; font-family: 'Lexend Deca', sans-serif;">Close</button>
            </div>
        </div>
    `
};

// --- LOGIN COMPONENT ---
const Login = {
    data() { return { username: '', password: '', error: '' } },
    methods: {
        handleLogin() {
            if (!this.username || !this.password) {
                this.error = "Please fill in all fields.";
                return;
            }
            if (store.login(this.username, this.password)) {
                this.error = '';
                this.$router.push('/');
            } else {
                this.error = "Invalid username or password.";
            }
        }
    },
    template: `
        <div style="display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 80px); padding: 20px; background: #f0f2f5;">
            <div style="background: white; width: 100%; max-width: 400px; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center;">
                <h1 style="font-family: 'Lexend Deca'; font-size: 28px; margin-bottom: 30px;">Login</h1>
                <div v-if="error" style="color: #ff4d4f; background: #fff2f0; border: 1px solid #ffccc7; padding: 10px; border-radius: 8px; margin-bottom: 16px;">{{ error }}</div>
                <input v-model="username" type="text" placeholder="Username" style="width: 100%; padding: 14px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 16px; box-sizing: border-box;">
                <input v-model="password" type="password" placeholder="Password" style="width: 100%; padding: 14px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 16px; box-sizing: border-box;">
                <button @click="handleLogin" style="width: 100%; padding: 14px; background: #2b6ef0; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer;">Login</button>
                <a href="#/register" style="display: block; margin-top: 20px; color: #666; text-decoration: none;">Don't have an account? <span style="color: #2b6ef0; font-weight: 600;">Register</span></a>
            </div>
        </div>
    `
};

// --- REGISTER COMPONENT ---
const Register = {
    data() { return { username: '', password: '', error: '', success: '' } },
    methods: {
        handleRegister() {
            if (!this.username || !this.password) {
                this.error = "Please fill in all fields.";
                return;
            }
            if (store.register(this.username, this.password)) {
                this.error = '';
                this.success = "Account created! Logging you in...";
                setTimeout(() => this.$router.push('/'), 1000);
            } else {
                this.error = "Username already taken.";
            }
        }
    },
    template: `
        <div style="display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 80px); padding: 20px; background: #f0f2f5;">
            <div style="background: white; width: 100%; max-width: 400px; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center;">
                <h1 style="font-family: 'Lexend Deca'; font-size: 28px; margin-bottom: 30px;">Register</h1>
                <div v-if="error" style="color: #ff4d4f; background: #fff2f0; border: 1px solid #ffccc7; padding: 10px; border-radius: 8px; margin-bottom: 16px;">{{ error }}</div>
                <div v-if="success" style="color: #52c41a; background: #f6ffed; border: 1px solid #b7eb8f; padding: 10px; border-radius: 8px; margin-bottom: 16px;">{{ success }}</div>
                <input v-model="username" type="text" placeholder="Username" style="width: 100%; padding: 14px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 16px; box-sizing: border-box;">
                <input v-model="password" type="password" placeholder="Password" style="width: 100%; padding: 14px; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 16px; box-sizing: border-box;">
                <button @click="handleRegister" style="width: 100%; padding: 14px; background: #2b6ef0; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer;">Register</button>
                <a href="#/login" style="display: block; margin-top: 20px; color: #666; text-decoration: none;">Already have an account? <span style="color: #2b6ef0; font-weight: 600;">Login</span></a>
            </div>
        </div>
    `
};

// --- ROUTER SETUP ---
const app = Vue.createApp({
    data: () => ({ store }),
    components: { AdminPanel } // Register the admin panel
});

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        ...routes,
        { path: '/login', component: Login },
        { path: '/register', component: Register }
    ],
});

app.use(router);
app.mount('#app');
