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

const app = Vue.createApp({
    data: () => ({ store }),
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
