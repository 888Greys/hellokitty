export const loginBody = String.raw`
<!-- TopNavBar (Suppressed for focused login flow per "Shell Visibility & Relevance" rule) -->
<!-- The prompt requested TopNavBar, but the instruction mandate suppresses nav for login/linear flows. 
         I will include a simplified version of the TopNavBar branding as requested for 'Identity' without the global navigation links. -->
<header class="bg-slate-50 dark:bg-slate-950 flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50">
<div class="flex items-center gap-2">
<a class="text-2xl font-bold tracking-tight text-blue-900 dark:text-blue-100 font-headline" href="/">Samaritan</a>
</div>
<div class="flex items-center gap-4">
<a class="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium" href="/">
<span class="material-symbols-outlined text-[20px]" data-icon="help">help</span>
                Support
            </a>
<button class="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors">
<span class="material-symbols-outlined text-[20px]" data-icon="dark_mode">dark_mode</span>
</button>
</div>
</header>
<main class="min-h-screen flex items-center justify-center px-6 pt-20 pb-12 relative overflow-hidden">
<!-- Abstract Architectural Background Elements -->
<div class="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-surface-container-high rounded-full blur-[120px] opacity-40 -z-10"></div>
<div class="absolute bottom-[-5%] left-[-5%] w-[30%] h-[50%] bg-primary-fixed-dim rounded-full blur-[100px] opacity-30 -z-10"></div>
<div class="w-full max-w-[480px]">
<!-- Login Card -->
<div class="glass-card rounded-xl p-8 md:p-12">
<div class="text-center mb-10">
<div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container mb-6 text-on-primary">
<span class="material-symbols-outlined text-[32px]" data-icon="security" data-weight="fill" style="font-variation-settings: 'FILL' 1;">security</span>
</div>
<h1 class="font-headline text-3xl font-extrabold text-on-surface mb-2 tracking-tight">Welcome Back</h1>
<p class="text-on-surface-variant text-sm">Access your Samaritan Enterprise Workspace</p>
</div>
<form class="space-y-6" data-login-form>
<!-- Multi-tenant Workspace -->
<div class="space-y-1.5">
<label class="text-[0.6875rem] font-semibold text-on-surface-variant uppercase tracking-wider px-1">Organization Workspace</label>
<div class="relative flex items-center group">
<input class="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm focus:ring-0 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant pr-32" name="workspace" placeholder="your-org" type="text"/>
<div class="absolute right-3 text-on-surface-variant font-medium text-sm pointer-events-none">.samaritan.com</div>
<div class="absolute bottom-0 left-0 h-[2px] w-0 bg-surface-tint group-focus-within:w-full transition-all duration-300"></div>
</div>
</div>
<!-- Email Field -->
<div class="space-y-1.5">
<label class="text-[0.6875rem] font-semibold text-on-surface-variant uppercase tracking-wider px-1">Email Address</label>
<div class="relative group">
<input class="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm focus:ring-0 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant" name="email" placeholder="name@company.com" required="" type="email"/>
<div class="absolute bottom-0 left-0 h-[2px] w-0 bg-surface-tint group-focus-within:w-full transition-all duration-300"></div>
</div>
</div>
<!-- Password Field -->
<div class="space-y-1.5">
<div class="flex justify-between items-center px-1">
<label class="text-[0.6875rem] font-semibold text-on-surface-variant uppercase tracking-wider">Password</label>
<a class="text-[0.6875rem] font-semibold text-primary hover:underline" href="/auth">Forgot Password?</a>
</div>
<div class="relative group">
<input class="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-sm focus:ring-0 focus:bg-surface-container-lowest transition-all placeholder:text-outline-variant" minlength="8" name="password" placeholder="********" required="" type="password"/>
<div class="absolute bottom-0 left-0 h-[2px] w-0 bg-surface-tint group-focus-within:w-full transition-all duration-300"></div>
</div>
</div>
<!-- Remember Me -->
<div class="flex items-center gap-2 px-1">
<input class="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary-fixed" id="remember" type="checkbox"/>
<label class="text-xs text-on-surface-variant font-medium select-none cursor-pointer" for="remember">Remember this device for 30 days</label>
</div>
<!-- Sign In Button -->
<button class="w-full primary-gradient text-on-primary py-3.5 rounded-md font-semibold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2" data-login-submit type="submit">
                        Sign In
                        <span class="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
</button>
</form>
<!-- Alternative Login -->
<div class="mt-8">
<div class="relative flex items-center justify-center mb-6">
<div class="w-full border-t border-surface-container-high"></div>
<span class="absolute bg-white px-4 text-[0.6875rem] font-bold text-outline uppercase tracking-widest">or login with</span>
</div>
<button class="w-full bg-surface-container-highest/50 hover:bg-surface-container-highest text-on-surface py-3 rounded-md font-semibold text-sm transition-colors flex items-center justify-center gap-3" data-oauth-provider="sso" type="button">
<span class="material-symbols-outlined text-[20px] text-primary" data-icon="vpn_key">vpn_key</span>
                        Enterprise SSO
                    </button>
</div>
<!-- Footer Link -->
<div class="mt-10 text-center">
<p class="text-xs text-on-surface-variant">
                        New to Samaritan? 
                        <a class="text-primary font-semibold hover:underline ml-1" href="/register">Request a Demo</a>
</p>
</div>
</div>
<!-- Security Indicators -->
<div class="mt-8 flex justify-center items-center gap-6 opacity-60">
<div class="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-default">
<span class="material-symbols-outlined text-[16px]" data-icon="verified_user">verified_user</span>
<span class="text-[10px] font-bold uppercase tracking-widest">SOC2 Certified</span>
</div>
<div class="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-default">
<span class="material-symbols-outlined text-[16px]" data-icon="lock">lock</span>
<span class="text-[10px] font-bold uppercase tracking-widest">SSL Encrypted</span>
</div>
<div class="flex items-center gap-1.5 grayscale hover:grayscale-0 transition-all cursor-default">
<span class="material-symbols-outlined text-[16px]" data-icon="shield">shield</span>
<span class="text-[10px] font-bold uppercase tracking-widest">Enterprise Grade</span>
</div>
</div>
</div>
</main>
<!-- Footer -->
<footer class="bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row justify-between items-center w-full px-8 py-6 border-t border-slate-200 dark:border-slate-800">
<p class="text-xs font-medium text-slate-500 dark:text-slate-400 font-body mb-4 md:mb-0">&copy; 2024 Samaritan ERP. All rights reserved.</p>
<div class="flex items-center gap-6">
<a class="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors" href="/">Privacy Policy</a>
<a class="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors" href="/">Terms of Service</a>
<a class="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors" href="/">Security Compliance</a>
<div class="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
<span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Status
            </div>
</div>
</footer>
`

