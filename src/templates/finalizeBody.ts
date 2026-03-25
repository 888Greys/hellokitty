export const finalizeBody = String.raw`
<!-- Left Side Navigation (SideNavBar) -->
<aside class="fixed left-0 top-0 h-full z-40 flex flex-col bg-[#213145] dark:bg-[#0b1c30] docked left-0 h-full w-64 shadow-xl dark:shadow-none">
<div class="p-8">
<h1 class="text-xl font-bold text-white tracking-tight">Samaritan ERP</h1>
<p class="text-slate-400 text-[0.6875rem] font-medium mt-1">Workspace Setup</p>
</div>
<nav class="flex-1 px-4 space-y-2 mt-4">
<!-- Organization - Completed -->
<a class="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 hover:bg-white/10 transition-colors duration-200" href="/register">
<span class="material-symbols-outlined text-primary-fixed" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-[0.875rem] font-medium">Organization</span>
</a>
<!-- Admin Account - Completed -->
<a class="flex items-center gap-3 text-slate-400 hover:text-white px-4 py-3 hover:bg-white/10 transition-colors duration-200" href="/register/admin">
<span class="material-symbols-outlined text-primary-fixed" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="text-[0.875rem] font-medium">Admin Account</span>
</a>
<!-- Finalize - Active State -->
<a class="flex items-center gap-3 bg-white/20 text-white rounded-lg px-4 py-3 border-l-4 border-[#0052CC] transition-colors duration-200" href="/register/finalize">
<span class="material-symbols-outlined" data-icon="verified">verified</span>
<span class="text-[0.875rem] font-medium">Finalize</span>
</a>
</nav>
<div class="p-6 mt-auto">
<div class="bg-white/5 rounded-xl p-4">
<div class="flex items-center gap-3 mb-3">
<img alt="Organization Logo Placeholder" class="w-8 h-8 rounded-full border border-white/10" data-alt="minimalist modern geometric logo in white and blue circle icon representing a technology firm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_EBT9RZXDaTHpZ0hOGJ0GqHssQOl0deEhD17g7vsFeVjPW3NgdiZDMhTe3vPQ6KOdNd3Q1LkRWJCurZ2ywbTIgSOWpptSYSKlBy6zZ37sY_vbtzuxKkpRuQYb466nX00mbzXFzoRwuzSC91MyonTaZ6fVMsBIzTzczFwtwBCZpQWF52BSTBywH-kOwQWp3McblRlRC2j9iumHDJuPYOIRYcmDImPt1dcu5Rg12QpRG8O1J8_cH1HP_pfFt-1lPO8emvBlfwp_Yko"/>
<div class="overflow-hidden">
<p class="text-white text-xs font-bold truncate">Nexus Global</p>
<p class="text-slate-500 text-[0.625rem]">Setup 85% complete</p>
</div>
</div>
<div class="w-full bg-white/10 h-1 rounded-full overflow-hidden">
<div class="bg-[#0052CC] h-full w-[85%]"></div>
</div>
</div>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="ml-64 min-h-screen flex flex-col">
<!-- Top Navigation (TopNavBar) -->
<header class="flex justify-between items-center h-16 px-8 w-full bg-[#f8f9ff] dark:bg-[#0b1c30]">
<div class="flex items-center gap-4">
<h2 class="text-lg font-bold text-[#213145] dark:text-white tracking-tight">Onboarding</h2>
<span class="text-slate-300">/</span>
<span class="text-[#0052CC] font-bold text-sm">Deployment Preparation</span>
</div>
<div class="flex items-center gap-4">
<button class="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full p-2 transition-opacity">
<span class="material-symbols-outlined text-slate-500" data-icon="help_outline">help_outline</span>
</button>
<button class="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full p-2 transition-opacity">
<span class="material-symbols-outlined text-slate-500" data-icon="notifications">notifications</span>
</button>
<div class="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden cursor-pointer ml-2">
<img alt="User Avatar" data-alt="professional headshot of a young business administrator with a friendly expression in soft studio lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoyB_FcGH-iaNBEiqUTg2ORRKQzy6VT2Rurte4gq9dh7YH-AW0l50VCDzAjybAYovN60hkE93zAzlCxUl2cjBOZs0PxYqlYOI8Puf-Kro5rTjaHua0XbzLAamUZXc-VqoweTcrlQYNT7_sDczma7lAtHhty1YUJ4ComCpQqVpztUKXVM_-mW47Qpj6VS-nNUOevKivcOtAc59xMo_CjPXquUNtvqRh66JKKJ4Q35wuKK-1FZP0UHrKXLEVqDQdB_SEThWR-MphwtI"/>
</div>
</div>
</header>
<!-- Content Area -->
<section class="p-12 max-w-6xl w-full mx-auto">
<!-- Hero Header -->
<div class="mb-12">
<h1 class="text-4xl font-extrabold text-on-surface tracking-tight mb-3">Finalize Your Workspace</h1>
<p class="text-secondary text-lg font-medium opacity-80">Review your configuration and choose your starting modules.</p>
</div>
<div class="grid grid-cols-12 gap-8">
<!-- Summary Card (Bento Left) -->
<div class="col-span-12 lg:col-span-5 flex flex-col gap-6">
<div class="bg-surface-container-lowest p-8 rounded-xl shadow-[0_40px_40px_-15px_rgba(11,28,48,0.04)] backdrop-blur-md bg-opacity-80">
<h3 class="text-on-surface font-bold text-xl mb-6 flex items-center gap-2">
<span class="material-symbols-outlined text-primary" data-icon="assignment">assignment</span>
                            Configuration Summary
                        </h3>
<div class="space-y-6">
<div class="flex flex-col gap-1">
<span class="text-[0.6875rem] font-bold text-primary uppercase tracking-wider">Organization Name</span>
<p class="text-on-surface font-semibold text-lg">Nexus Global Systems</p>
</div>
<div class="flex flex-col gap-1">
<span class="text-[0.6875rem] font-bold text-primary uppercase tracking-wider">Workspace URL</span>
<p class="text-on-surface font-semibold">nexus-global.samaritan.cloud</p>
</div>
<div class="flex flex-col gap-1">
<span class="text-[0.6875rem] font-bold text-primary uppercase tracking-wider">Admin Email</span>
<p class="text-on-surface font-semibold">admin@nexusglobal.io</p>
</div>
</div>
<a class="mt-8 text-sm font-bold text-primary hover:underline flex items-center gap-1" href="/register">
<span class="material-symbols-outlined text-sm" data-icon="edit">edit</span>
                            Change Details
                        </a>
</div>
<!-- Security Badge -->
<div class="bg-surface-container-high p-6 rounded-xl flex items-center justify-between">
<div class="flex items-center gap-4">
<div class="w-12 h-12 rounded-full bg-white flex items-center justify-center">
<span class="material-symbols-outlined text-primary" data-icon="security" style="font-variation-settings: 'FILL' 1;">security</span>
</div>
<div>
<p class="text-sm font-bold text-on-surface">Enterprise Encryption</p>
<p class="text-[0.6875rem] text-secondary">All data encrypted via AES-256</p>
</div>
</div>
</div>
</div>
<!-- Module Selection (Bento Right) -->
<div class="col-span-12 lg:col-span-7">
<div class="bg-surface-container-low p-8 rounded-xl">
<div class="flex justify-between items-end mb-8">
<div>
<h3 class="text-on-surface font-bold text-xl">Select Starting Modules</h3>
<p class="text-secondary text-sm">Choose at least one to begin deployment.</p>
</div>
<span class="text-[0.6875rem] font-bold text-primary bg-primary-fixed px-3 py-1 rounded-full">RECOMMENDED</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<!-- Module Card: HR -->
<div class="group cursor-pointer bg-surface-container-lowest p-5 rounded-xl border-2 border-transparent hover:border-primary transition-all duration-300" data-module-card="hr">
<div class="flex justify-between items-start mb-4">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined" data-icon="groups">groups</span>
</div>
<div class="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:border-primary">
<span class="material-symbols-outlined text-white text-[12px] opacity-0 group-hover:opacity-100" data-icon="check">check</span>
</div>
</div>
<h4 class="font-bold text-on-surface mb-1">Human Resources</h4>
<p class="text-[0.75rem] text-secondary leading-relaxed">Payroll, performance tracking, and employee management.</p>
</div>
<!-- Module Card: Sales -->
<div class="group cursor-pointer bg-surface-container-lowest p-5 rounded-xl border-2 border-primary transition-all duration-300" data-module-card="sales">
<div class="flex justify-between items-start mb-4">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined" data-icon="trending_up">trending_up</span>
</div>
<div class="w-5 h-5 rounded-full bg-primary border-2 border-primary flex items-center justify-center">
<span class="material-symbols-outlined text-white text-[12px]" data-icon="check">check</span>
</div>
</div>
<h4 class="font-bold text-on-surface mb-1">Sales &amp; CRM</h4>
<p class="text-[0.75rem] text-secondary leading-relaxed">Pipeline management, lead scoring, and automated reporting.</p>
</div>
<!-- Module Card: Projects -->
<div class="group cursor-pointer bg-surface-container-lowest p-5 rounded-xl border-2 border-transparent hover:border-primary transition-all duration-300" data-module-card="projects">
<div class="flex justify-between items-start mb-4">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined" data-icon="account_tree">account_tree</span>
</div>
<div class="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:border-primary">
<span class="material-symbols-outlined text-white text-[12px] opacity-0 group-hover:opacity-100" data-icon="check">check</span>
</div>
</div>
<h4 class="font-bold text-on-surface mb-1">Project Management</h4>
<p class="text-[0.75rem] text-secondary leading-relaxed">Kanban boards, resource planning, and time-tracking.</p>
</div>
<!-- Module Card: Invoicing -->
<div class="group cursor-pointer bg-surface-container-lowest p-5 rounded-xl border-2 border-transparent hover:border-primary transition-all duration-300" data-module-card="invoicing">
<div class="flex justify-between items-start mb-4">
<div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
<span class="material-symbols-outlined" data-icon="receipt_long">receipt_long</span>
</div>
<div class="w-5 h-5 rounded-full border-2 border-outline-variant flex items-center justify-center group-hover:bg-primary group-hover:border-primary">
<span class="material-symbols-outlined text-white text-[12px] opacity-0 group-hover:opacity-100" data-icon="check">check</span>
</div>
</div>
<h4 class="font-bold text-on-surface mb-1">Invoicing</h4>
<p class="text-[0.75rem] text-secondary leading-relaxed">Automated billing, expense tracking, and tax compliance.</p>
</div>
</div>
</div>
</div>
</div>
<!-- Deployment Action -->
<div class="mt-12 flex flex-col items-center gap-8 bg-white/40 p-12 rounded-2xl">
<div class="text-center">
<p class="text-on-surface text-lg mb-2">Ready to launch <span class="font-bold">Nexus Global Systems</span>?</p>
<p class="text-secondary text-sm">Deployment typically takes less than 2 minutes.</p>
</div>
<button class="px-10 py-5 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex items-center gap-3" data-deploy-workspace type="button">
<span class="material-symbols-outlined" data-icon="rocket_launch">rocket_launch</span>
                    Deploy My Workspace
                </button>
<!-- Trust Indicators Footer -->
<div class="flex items-center gap-12 pt-8 border-t border-outline-variant w-full justify-center">
<div class="flex items-center gap-2 opacity-60">
<span class="material-symbols-outlined text-lg" data-icon="verified_user">verified_user</span>
<span class="text-[0.6875rem] font-bold uppercase tracking-widest">SOC2 TYPE II</span>
</div>
<div class="flex items-center gap-2 opacity-60">
<span class="material-symbols-outlined text-lg" data-icon="health_and_safety">health_and_safety</span>
<span class="text-[0.6875rem] font-bold uppercase tracking-widest">HIPAA COMPLIANT</span>
</div>
<div class="flex items-center gap-2 opacity-60">
<span class="material-symbols-outlined text-lg" data-icon="lock">lock</span>
<span class="text-[0.6875rem] font-bold uppercase tracking-widest">AES-256 BANK-GRADE</span>
</div>
</div>
</div>
</section>
</main>
`

