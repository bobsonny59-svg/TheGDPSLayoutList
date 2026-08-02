import routes from './routes.js';

export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
});

// --- NEW: Login and Register Components ---
const Login = {
    template: `
        <div style="display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 80px); padding: 20px; background: #f0f2f5;">
            <div style="background: white; width: 100%; max-width: 400px; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center;">
                <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 30px; color: #1a1a1a; font-family: 'Lexend Deca', sans-serif;">Login</h1>
                <input type="text" placeholder="Username" style="width: 100%; padding: 14px 16px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 15px; font-family: 'Lexend Deca', sans-serif; margin-bottom: 16px; outline: none; background: #fafafa; box-sizing: border-box;">
                <input type="password" placeholder="Password" style="width: 100%; padding: 14px 16px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 15px; font-family: 'Lexend Deca', sans-serif; margin-bottom: 16px; outline: none; background: #fafafa; box-sizing: border-box;">
                <button style="width: 100%; padding: 14px; background: #2b6ef0; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; font-family: 'Lexend Deca', sans-serif; cursor: pointer; margin-top: 10px;">Login</button>
                <a href="#/register" style="display: block; margin-top: 20px; font-size: 14px; color: #666; text-decoration: none; font-family: 'Lexend Deca', sans-serif;">Don't have an account? <span style="color: #2b6ef0; font-weight: 600;">Register</span></a>
            </div>
        </div>
    `
};

const Register = {
    template: `
        <div style="display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 80px); padding: 20px; background: #f0f2f5;">
            <div style="background: white; width: 100%; max-width: 400px; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center;">
                <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 30px; color: #1a1a1a; font-family: 'Lexend Deca', sans-serif;">Register</h1>
                <input type="text" placeholder="Username" style="width: 100%; padding: 14px 16px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 15px; font-family: 'Lexend Deca', sans-serif; margin-bottom: 16px; outline: none; background: #fafafa; box-sizing: border-box;">
                <input type="password" placeholder="Password" style="width: 100%; padding: 14px 16px; border: 1px solid #e0e0e0; border-radius: 8px; font-size: 15px; font-family: 'Lexend Deca', sans-serif; margin-bottom: 16px; outline: none; background: #fafafa; box-sizing: border-box;">
                <button style="width: 100%; padding: 14px; background: #2b6ef0; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: 700; font-family: 'Lexend Deca', sans-serif; cursor: pointer; margin-top: 10px;">Register</button>
                <a href="#/login" style="display: block; margin-top: 20px; font-size: 14px; color: #666; text-decoration: none; font-family: 'Lexend Deca', sans-serif;">Already have an account? <span style="color: #2b6ef0; font-weight: 600;">Login</span></a>
            </div>
        </div>
    `
};

const app = Vue.createApp({
    data: () => ({ store }),
});

// --- NEW: We add the Login and Register routes before the imported routes ---
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        ...routes // This spreads your existing routes (List, Leaderboard, etc.) back in!
    ],
});

app.use(router);

app.mount('#app');
