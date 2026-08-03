import routes from './routes.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    user: JSON.parse(localStorage.getItem('user')) || null, 
    
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },

    login(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = users.find(u => u.username === username && u.password === password);
        if (foundUser) {
            this.user = foundUser;
            localStorage.setItem('user', JSON.stringify(foundUser));
            return true;
        }
        return false;
    },

    register(username, password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.find(u => u.username === username)) return false;

        const newUser = { username, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        this.user = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
    },

    logout() {
        this.user = null;
        localStorage.removeItem('user');
    }
});

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

// --- PROFILE POPUP COMPONENT ---
const ProfilePopup = {
    data() {
        return {
            isVisible: false
        }
    },
    methods: {
        open() {
            this.isVisible = true;
        },
        close() {
            this.isVisible = false;
        },
        doLogout() {
            store.logout();
            this.isVisible = false;
            this.$router.push('/');
        }
    },
    template: `
        <div v-if="isVisible" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center;" @click.self="close">
            <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); min-width: 280px; text-align: center; position: relative; font-family: 'Lexend Deca', sans-serif;">
                
                <button @click="close" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 22px; cursor: pointer; color: #999;">&times;</button>
                
                <div style="width: 80px; height: 80px; background: #2b6ef0; color: white; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 32px; font-weight: 700; margin: 0 auto 15px auto;">
                    {{ store.user.username.charAt(0).toUpperCase() }}
                </div>
                
                <h2 style="font-size: 22px; margin: 0 0 5px 0; color: #1a1a1a;">{{ store.user.username }}</h2>
                <p style="font-size: 14px; color: #666; margin: 0 0 20px 0;">Logged in successfully</p>
                
                <button @click="doLogout" style="padding: 8px 20px; background: #ff4d4f; color: white; border: none; border-radius: 6px; font-weight: 700; font-family: 'Lexend Deca', sans-serif; cursor: pointer; font-size: 14px;">Logout</button>
                <button @click="close" style="padding: 8px 20px; background: #f0f2f5; color: #333; border: none; border-radius: 6px; font-weight: 700; font-family: 'Lexend Deca', sans-serif; cursor: pointer; font-size: 14px; margin-left: 10px;">Close</button>
                
            </div>
        </div>
    `
};

// --- MAIN APP SETUP ---
const app = Vue.createApp({
    data: () => ({ store }),
    components: { ProfilePopup }
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
