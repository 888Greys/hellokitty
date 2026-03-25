export const registerBody = String.raw`
<!-- TopNavBar (Shell) -->
<header class="bg-[#f8f9ff] flex justify-between items-center w-full px-8 py-4 fixed top-0 z-50">
<a class="text-xl font-black text-[#003d9b] tracking-tight font-headline" href="/">Samaritan ERP</a>
<div class="flex items-center gap-6">
<a class="text-slate-600 font-medium hover:text-[#003d9b] transition-colors text-sm" href="/">Support</a>
<a class="text-[#0052CC] font-bold border-b-2 border-[#0052CC] text-sm" href="/auth">Login</a>
</div>
</header>
<div class="flex flex-1 pt-16">
<!-- SideNavBar (Progress) -->
<aside class="bg-[#213145] fixed left-0 top-0 h-full w-64 flex flex-col pt-20 shadow-xl opacity-4">
<div class="px-6 mb-8">
<h2 class="text-white font-bold font-headline text-lg">Setup Progress</h2>
<p class="text-slate-400 text-xs tracking-wide font-label uppercase">Onboarding</p>
</div>
<nav class="flex flex-col gap-2 px-3">
<div class="flex items-center gap-3 bg-white/10 text-white rounded-lg px-4 py-3 border-l-4 border-[#0052CC] transition-all">
<span class="material-symbols-outlined" data-icon="domain">domain</span>
<span class="font-label text-sm">Organization</span>
</div>
<a class="flex items-center gap-3 text-slate-400 px-4 py-3 hover:bg-white/5 transition-all" href="/register/admin">
<span class="material-symbols-outlined" data-icon="person_add">person_add</span>
<span class="font-label text-sm">Admin Account</span>
</a>
<a class="flex items-center gap-3 text-slate-400 px-4 py-3 hover:bg-white/5 transition-all" href="/register/finalize">
<span class="material-symbols-outlined" data-icon="check_circle">check_circle</span>
<span class="font-label text-sm">Finalize</span>
</a>
</nav>
<div class="mt-auto p-6">
<div class="bg-white/5 rounded-xl p-4">
<p class="text-slate-400 text-[10px] uppercase font-bold mb-2">Security Standard</p>
<div class="flex gap-3">
<div class="w-8 h-8 rounded bg-white/10 flex items-center justify-center" title="SOC2 Compliant">
<span class="material-symbols-outlined text-white text-sm" data-icon="security">security</span>
</div>
<div class="w-8 h-8 rounded bg-white/10 flex items-center justify-center" title="HIPAA Compliant">
<span class="material-symbols-outlined text-white text-sm" data-icon="verified_user">verified_user</span>
</div>
</div>
</div>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="ml-64 flex-1 flex flex-col items-center justify-center p-12 bg-surface-container-low">
<div class="w-full max-w-2xl">
<!-- Header Section -->
<div class="text-center mb-10">
<h1 class="font-headline font-extrabold text-4xl text-on-background tracking-tight mb-3">Get Started with Samaritan</h1>
<p class="text-on-surface-variant text-lg">Set up your organization's secure workspace.</p>
</div>
<!-- Registration Card (Bento-style Layout) -->
<div class="grid grid-cols-12 gap-6">
<!-- Step Indicator Mobile-only (hidden on md) -->
<div class="col-span-12 md:hidden mb-4">
<div class="flex justify-between text-xs font-bold text-primary mb-2">
<span>STEP 1 OF 3</span>
<span>33% COMPLETE</span>
</div>
<div class="h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
<div class="h-full bg-primary w-1/3"></div>
</div>
</div>
<!-- Main Form Area -->
<div class="col-span-12 glass-panel p-10 rounded-xl shadow-sm border border-outline-variant/15">
<form class="space-y-8" data-register-form>
<div>
<h3 class="font-headline font-bold text-xl text-primary mb-6 flex items-center gap-2">
<span class="material-symbols-outlined" data-icon="corporate_fare">corporate_fare</span>
                                    Organization Details
                                </h3>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="space-y-2">
<label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Legal Entity Name</label>
<input class="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:ring-0 focus:border-surface-tint focus:bg-surface-container-lowest transition-all p-3 rounded-md text-sm placeholder:text-outline" name="orgName" placeholder="e.g. Acme Corp Industries" required="" type="text"/>
</div>
<div class="space-y-2">
<label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Industry Sector</label>
<select class="w-full bg-surface-container-low border-0 border-b-2 border-transparent focus:ring-0 focus:border-surface-tint focus:bg-surface-container-lowest transition-all p-3 rounded-md text-sm" name="industry">
<option>Healthcare &amp; Life Sciences</option>
<option>Financial Services</option>
<option>Manufacturing</option>
<option>Public Sector</option>
</select>
</div>
<div class="col-span-full space-y-2">
<label class="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Workspace URL</label>
<div class="flex">
<span class="inline-flex items-center px-4 rounded-l-md bg-surface-dim text-on-surface-variant text-sm font-medium">https://</span>
<input class="flex-1 bg-surface-container-low border-0 border-b-2 border-transparent focus:ring-0 focus:border-surface-tint focus:bg-surface-container-lowest transition-all p-3 text-sm" minlength="4" name="workspace" pattern="[a-zA-Z0-9-]+" placeholder="your-org" required="" type="text"/>
<span class="inline-flex items-center px-4 rounded-r-md bg-surface-dim text-on-surface-variant text-sm font-medium">.samaritan.cloud</span>
</div>
<p class="text-[10px] text-outline italic">Letters, numbers and hyphens only. Minimum 4 characters.</p>
</div>
</div>
</div>
<!-- Enterprise SSO Option -->
<div class="bg-surface-container-high/50 p-6 rounded-xl space-y-4">
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<span class="material-symbols-outlined text-primary" data-icon="hub">hub</span>
<h4 class="text-sm font-bold text-on-background">Enterprise SSO</h4>
</div>
<span class="bg-primary-fixed text-on-primary-fixed text-[10px] font-black px-2 py-0.5 rounded-full">ENFORCED</span>
</div>
<div class="grid grid-cols-2 gap-4">
<button class="flex items-center justify-center gap-2 bg-surface-container-lowest py-3 px-4 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-bright transition-all shadow-sm" type="button">
<img alt="" class="w-4 h-4" data-alt="Official Google G logo in primary brand colors on transparent background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXpR418MkV6bKNF8SzVNx4-2PxSdEtob7R5tKFn_dmBHqPK73NqkFKF3Mkt6Cc0aiG3yQl19e2cWSwr_3BEMtxTygKyKdgOYrMSk0LXczF2nohtW5wz1gXs2Cl-1jzkrIp2B8aTWmYoG1G-eufFStITCnRX1EuPvKL6J7tXeGiU1kxZ7lrim68Z3vieB7dW2DkZR7v6FFN4LByqAhzxPAt1PhF1RNrOQ60dukoDnCaO6OtDhspemLLbZtwLavBNTL_5M1pHw5t2ys"/>
                                        Google Workspace
                                    </button>
<button class="flex items-center justify-center gap-2 bg-surface-container-lowest py-3 px-4 rounded-lg text-sm font-semibold text-on-surface-variant hover:bg-surface-bright transition-all shadow-sm" type="button">
<img alt="" class="w-4 h-4" data-alt="Microsoft corporate logo featuring four colored squares arranged in a grid" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_CPgGLW5m-21HHFRiJMb0KbGU8IDMvAFRRd3_2I7yQXaLsi2L98i3viRU0__juFuRid-gjQ1qX8sA3AouC_z4eMj0OOAHupSI84OjR1ajhCWkOc2RFAO7_L-ADnkwE5pd_UMcrnFfRqRBzCLYVP-U0pkKGXY8CGyhlgtwrGs9RqeD6U-vSQRrWcEgmXEbQxAbJTCbtAja4sFoH2EyFc6Bi_QhWNHEse_umpqCTJ85roncnuerYOUhN7Qsk9_Xu_-L51Aldow3VT8"/>
                                        Azure AD / Okta
                                    </button>
</div>
</div>
<div class="flex justify-end pt-4">
<button class="btn-gradient text-white px-8 py-4 rounded-md font-bold flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20" data-register-submit type="submit">
                                    Continue to Admin Setup
                                    <span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</button>
</div>
</form>
</div>
<!-- Trust/Feature Badges Bento -->
<div class="col-span-12 grid grid-cols-3 gap-6">
<div class="bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center text-center space-y-2 border border-outline-variant/5 hover:bg-primary-fixed transition-colors">
<span class="material-symbols-outlined text-primary text-3xl" data-icon="encrypted">encrypted</span>
<span class="font-bold text-sm">256-bit AES</span>
<span class="text-[10px] text-on-surface-variant">Data at rest encryption</span>
</div>
<div class="bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center text-center space-y-2 border border-outline-variant/5 hover:bg-primary-fixed transition-colors">
<span class="material-symbols-outlined text-primary text-3xl" data-icon="cloud_done">cloud_done</span>
<span class="font-bold text-sm">99.99% Uptime</span>
<span class="text-[10px] text-on-surface-variant">Redundant global nodes</span>
</div>
<div class="bg-surface-container-lowest p-6 rounded-xl flex flex-col items-center text-center space-y-2 border border-outline-variant/5 hover:bg-primary-fixed transition-colors">
<span class="material-symbols-outlined text-primary text-3xl" data-icon="support_agent">support_agent</span>
<span class="font-bold text-sm">Priority Support</span>
<span class="text-[10px] text-on-surface-variant">24/7 technical concierge</span>
</div>
</div>
</div>
<footer class="mt-12 text-center text-outline text-xs space-y-4">
<p>By continuing, you agree to our <a class="text-primary font-bold hover:underline" href="/">Terms of Service</a> and <a class="text-primary font-bold hover:underline" href="/">Privacy Policy</a>.</p>
<div class="flex justify-center gap-8 opacity-60">
<span class="flex items-center gap-1 font-black tracking-widest text-[10px]">SOC2 TYPE II</span>
<span class="flex items-center gap-1 font-black tracking-widest text-[10px]">HIPAA COMPLIANT</span>
<span class="flex items-center gap-1 font-black tracking-widest text-[10px]">ISO 27001</span>
</div>
</footer>
</div>
</main>
</div>
<!-- Background Decoration -->
<div class="fixed top-0 right-0 -z-10 w-1/3 h-screen overflow-hidden opacity-20 pointer-events-none">
<div class="absolute -top-24 -right-24 w-96 h-96 bg-primary-container rounded-full blur-[120px]"></div>
<div class="absolute top-1/2 -right-48 w-64 h-64 bg-surface-tint rounded-full blur-[100px]"></div>
</div>
`

