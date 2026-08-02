import routes from './routes.js';

// --- STORE (Global App State) ---
export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    user: JSON.parse(localStorage.getItem('user')) || null, // Stores logged in user
    
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },

    // LOGIN FUNCTION
    login(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(u => u.username === username && u.password === password);
        
        if (foundUser) {
            this.user = foundUser;
            localStorage.setItem('user', JSON.stringify(foundUser));
            return true; // Success
        }
        return false; // Failed
    },

    // REGISTER FUNCTION
    register(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // Prevent duplicate usernames
        if (users.find(u => u.username === username)) {
            return false; 
        }

        const newUser = { username, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Auto-login after registering
        this.user = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
    },

    // LOGOUT FUNCTION
    logout() {
        this.user = null;
        localStorage.removeItem('user');
    }
});

// --- LOGIN COMPONENT ---
const Login = {
    data() {
        return {
            username: '',
            password: '',
            error: ''
        }
    },
    methods: {
        handleLogin() {
            if (!this.username || !this.password) {
                this.error = "Please fill in all fields.";
                return;
            }
            const success = store.login(this.username, this.password);
            if (success) {
                this.error = '';
                this.$router.push('/'); // Redirect to home page
            } else {
                this.error = "Invalid username or password.";
            }
        }
    },
    template: `
        <div style="display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 80px); padding: 20px; background: #f0f2f5;">
            <div style="background: white; width: 100%; max-width: 400px; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center;">
                <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 30px; color: #1a1a1a; font-family: 'Lexend Deca', sans-serif;">Login</h1>
                
                <div v-if="error" style="color: #ff4d4f; background: #fff2f0; border: 1px solid #ffccc7; padding: 10px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">{{ error }}</div>
                
                <input v-model="username" type="text" placeholder="Username" style="width: 100%; padding: 14px 16px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 15px; font-family: 'Lexend Deca', sans-serif; margin-bottom: 16px; outline: none; background: #fafafa; box-sizing: border-box;">
                <input v-model="password" type="password" placeholder="Password" style="width: 100%; padding: 14px 16px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 15px; font-family: 'Lexend Deca', sans-serif; margin-bottom: 16px; outline: none; background: #fafafa; box-sizing: border-box;">
                
                <button @click="handleLogin" style="width: 100%; padding: 14px; background: #2b6ef0; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; font-family: 'Lexend Deca', sans-serif; cursor: pointer; margin-top: 10px;">Login</button>
                <a href="#/register" style="display: block; margin-top: 20px; font-size: 14px; color: #666; text-decoration: none; font-family: 'Lexend Deca', sans-serif;">Don't have an account? <span style="color: #2b6ef0; font-weight: 600;">Register</span></a>
            </div>
        </div>
    `
};

// --- REGISTER COMPONENT ---
const Register = {
    data() {
        return {
            username: '',
            password: '',
            error: '',
            success: ''
        }
    },
    methods: {
        handleRegister() {
            if (!this.username || !this.password) {
                this.error = "Please fill in all fields.";
                return;
            }
            const success = store.register(this.username, this.password);
            if (success) {
                this.error = '';
                this.success = "Account created! Logging you in...";
                setTimeout(() => {
                    this.$router.push('/'); // Redirect to home page after 1 second
                }, 1000);
            } else {
                this.error = "Username already taken. Please choose another.";
            }
        }
    },
    template: `
        <div style="display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 80px); padding: 20px; background: #f0f2f5;">
            <div style="background: white; width: 100%; max-width: 400px; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center;">
                <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 30px; color: #1a1a1a; font-family: 'Lexend Deca', sans-serif;">Register</h1>
                
                <div v-if="error" style="color: #ff4d4f; background: #fff2f0; border: 1px solid #ffccc7; padding: 10px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">{{ error }}</div>
                <div v-if="success" style="color: #52c41a; background: #f6ffed; border: 1px solid #b7eb8f; padding: 10px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">{{ success }}</div>
                
                <input v-model="username" type="text" placeholder="Username" style="width: 100%; padding: 14px 16px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 15px; font-family: 'Lexend Deca', sans-serif; margin-bottom: 16px; outline: none; background: #fafafa; box-sizing: border-box;">
                <input v-model="password" type="password" placeholder="Password" style="width: 100%; padding: 14px 16px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 15px; font-family: 'Lexend Deca', sans-serif; margin-bottom: 16px; outline: none; background: #fafafa; box-sizing: border-box;">
                
                <button @click="handleRegister" style="width: 100%; padding: 14px; background: #2b6ef0; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; font-family: 'Lexend Deca', sans-serif; cursor: pointer; margin-top: 10px;">Register</button>
                <a href="#/login" style="display: block; margin-top: 20px; font-size: 14px; color: #666; text-decoration: none; font-family: 'Lexend Deca', sans-serif;">Already have an account? <span style="color: #2b6ef0; font-weight: 600;">Login</span></a>
            </div>
        </div>
    `
};

const app = Vue.createApp({
    data: () => ({ store }),
});

// --- ROUTER ---
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        ...routes 
    ],
});

app.use(router);
app.mount('#app');
