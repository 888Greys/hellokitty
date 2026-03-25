export const landingBody = String.raw`
<!-- TopNavBar -->
<nav class="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm dark:shadow-none docked full-width top-0 sticky z-50">
<div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
<div class="text-2xl font-bold tracking-tight text-blue-900 dark:text-blue-50">Samaritan System</div>
<div class="hidden md:flex items-center space-x-8">
<a class="text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-600 transition-colors" href="/">Home</a>
<a class="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors" href="#features">Features</a>
<a class="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors" href="#pricing">Pricing</a>
<a class="text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors" href="/auth">Login</a>
<a class="bg-primary-container text-white px-5 py-2.5 rounded-md font-semibold hover:opacity-90 active:scale-95 transition-all duration-200" href="/register">Get Started</a>
</div>
<button class="md:hidden text-slate-600">
<span class="material-symbols-outlined">menu</span>
</button>
</div>
</nav>
<main>
<!-- Hero Section -->
<section class="relative pt-20 pb-32 overflow-hidden">
<div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
<div class="z-10">
<span class="inline-block px-4 py-1.5 rounded-full bg-surface-container-high text-primary font-bold text-xs uppercase tracking-widest mb-6">Enterprise OS v4.0</span>
<h1 class="text-5xl lg:text-7xl font-extrabold text-on-surface leading-[1.1] mb-6 tracking-tight">
                        The Digital Curator for Your <span class="text-surface-tint">Enterprise OS</span>
</h1>
<p class="text-lg text-on-surface-variant leading-relaxed max-w-xl mb-10">
                        A unified, multi-tenant ERP and CRM platform for modern organizations. Managing HR, Sales, Projects, and Invoicing in one secure cloud workspace.
                    </p>
<div class="flex flex-wrap gap-4">
<a class="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-md font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" href="/register">
                            Request Enterprise Demo
                        </a>
<a class="px-8 py-4 bg-surface-container-highest text-on-surface rounded-md font-bold text-lg hover:bg-surface-dim transition-all" href="#features">
                            View Features
                        </a>
</div>
</div>
<div class="relative">
<div class="absolute -top-20 -right-20 w-96 h-96 bg-primary-fixed/30 blur-3xl rounded-full"></div>
<div class="relative rounded-xl overflow-hidden border-8 border-surface-container-lowest shadow-2xl transform lg:rotate-2 lg:hover:rotate-0 transition-transform duration-700">
<img alt="Executive Dashboard Mockup" class="w-full h-auto object-cover" data-alt="Modern high-density executive dashboard interface with blue accents showing financial charts, user growth metrics, and progress bars on a clean white layout" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBF2KuzDrp4B62WDM7pcQhz2vZVUu6OOep1bNP1SuhtPVgL6G8tmJopQOmytzHRSfux7fcIufNAAlymPK_WD-kr8tY662jDcnThs_L4qE9WW5BUpftzncnUKv8c3dY3rUJORuh5cfKxrMyj5MJki1tGvfQUn7V42KPDfmBxvZwsQe_C2SP7r63rNIcc_Y7LrQNMt1c1I6yoIZqdDk-TDknV-yJgKFRtiKfbNaQvtdn53BodQhtPD72Ke5TP95TNNVA-ZJvu_Fg1UaI"/>
</div>
</div>
</div>
</section>
<!-- Features Bento Grid -->
<section class="py-24 bg-surface-container-low" id="features">
<div class="max-w-7xl mx-auto px-6">
<div class="mb-16">
<h2 class="text-3xl font-bold text-on-surface mb-4">Core Orchestration Modules</h2>
<p class="text-on-surface-variant max-w-2xl">Replace fragmented legacy tools with a high-density, editorial-grade interface designed for operational clarity.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-6">
<!-- HR & Payroll -->
<div class="md:col-span-8 bg-surface-container-lowest p-8 rounded-xl group transition-all hover:bg-surface-bright">
<div class="flex flex-col h-full">
<div class="flex items-center gap-4 mb-6">
<div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
<span class="material-symbols-outlined">groups</span>
</div>
<div>
<h3 class="text-xl font-bold">HR &amp; Payroll</h3>
<p class="text-sm text-on-surface-variant">Workforce Management</p>
</div>
</div>
<p class="text-on-surface-variant mb-8 max-w-md">Optimize your workforce performance and automate pay slips with intelligent multi-tenant payroll cycles and performance tracking.</p>
<div class="mt-auto overflow-hidden rounded-lg border border-outline-variant/20">
<img alt="HR Interface" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Detailed digital payroll interface showing employee list, automated tax calculations, and secure direct deposit status indicators" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrBikgyF6cQcwRVHqQMZG6tV8iru_rgA_MMLpLDKkAPKvzJJEwI-8XqujpkvNu6WnNbobw3ifW9-gn0zLwzsmEcIVNVeqYd70YYO_uJtbh90yyFDHQ4-BuwyDJ3gCRkojrfDhhaRJR0QgJHh6Hroo5R9alT7dA4my-7iRXbpd7KxWdDmarHzvND9ObmI3YFqSrYJdVTXvBhk03a5Kz2qs_4hF9UT4EQbqoD7MZSDeapQFrJ09x4fcf3dFxwamiS37LjWB-GQEAKtg"/>
</div>
</div>
</div>
<!-- Sales & CRM -->
<div class="md:col-span-4 bg-inverse-surface text-white p-8 rounded-xl flex flex-col justify-between">
<div>
<div class="w-12 h-12 rounded-lg bg-primary-fixed/20 flex items-center justify-center text-primary-fixed mb-6">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">insights</span>
</div>
<h3 class="text-xl font-bold mb-3">Sales &amp; CRM</h3>
<p class="text-on-primary-container/80 text-sm">Visual lead pipelines and real-time revenue analytics across global branches.</p>
</div>
<div class="mt-8">
<div class="flex items-end gap-2 mb-2">
<div class="w-2 h-8 bg-primary-fixed rounded-full"></div>
<div class="w-2 h-12 bg-primary-fixed rounded-full"></div>
<div class="w-2 h-20 bg-primary-fixed rounded-full"></div>
<div class="w-2 h-14 bg-primary-fixed rounded-full"></div>
<div class="w-2 h-24 bg-surface-tint rounded-full"></div>
</div>
<div class="text-2xl font-bold">+$124.5k</div>
<div class="text-xs opacity-60 uppercase tracking-widest">This Quarter</div>
</div>
</div>
<!-- PM -->
<div class="md:col-span-5 bg-surface-container-high p-8 rounded-xl">
<div class="w-12 h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center text-primary mb-6 shadow-sm">
<span class="material-symbols-outlined">account_tree</span>
</div>
<h3 class="text-xl font-bold mb-3">Project Management</h3>
<p class="text-on-surface-variant mb-6">Agile Kanban boards and high-fidelity Gantt charts for complex multi-stage deployments.</p>
<div class="space-y-3">
<div class="bg-surface-container-lowest p-3 rounded-lg flex items-center justify-between shadow-sm">
<span class="text-xs font-bold text-on-surface">Cloud Migration Phase 2</span>
<span class="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">In Progress</span>
</div>
<div class="bg-surface-container-lowest p-3 rounded-lg flex items-center justify-between shadow-sm">
<span class="text-xs font-bold text-on-surface">Security Audit Redesign</span>
<span class="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">Pending</span>
</div>
</div>
</div>
<!-- Invoicing -->
<div class="md:col-span-7 bg-surface-container-lowest p-8 rounded-xl border border-outline-variant/10 shadow-sm relative overflow-hidden group">
<div class="relative z-10 grid grid-cols-2 gap-8 h-full">
<div>
<div class="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary mb-6">
<span class="material-symbols-outlined">receipt_long</span>
</div>
<h3 class="text-xl font-bold mb-3">Invoicing &amp; Finance</h3>
<p class="text-on-surface-variant">Overdue tracking and automated multi-currency billing for global operations.</p>
</div>
<div class="relative">
<div class="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-lowest z-10 pointer-events-none"></div>
<div class="space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
<div class="p-2 bg-surface-container-low rounded border border-outline-variant/20 text-[10px] opacity-60">#INV-9902: $4,500.00</div>
<div class="p-2 bg-surface-container-low rounded border border-outline-variant/20 text-[10px] opacity-80">#INV-9903: $12,200.00</div>
<div class="p-2 bg-primary-container/10 rounded border border-primary/20 text-[10px] font-bold text-primary">#INV-9904: $2,400.00</div>
<div class="p-2 bg-surface-container-low rounded border border-outline-variant/20 text-[10px] opacity-60">#INV-9905: $8,900.00</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
<!-- Security & Compliance Section -->
<section class="py-24 bg-surface">
<div class="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
<div class="lg:w-1/2">
<img alt="Security Illustration" class="rounded-xl shadow-2xl" data-alt="Abstract secure network connection with digital nodes and glowing blue links on a dark tech-inspired background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHD4zz1vkwvjo2zcPjjxuQH06tt2r-r08EBosvfXRCD0PUFjGEusORbmx6zGYWr35Am5LkHP6RINeOtkJCcanQ9Q5dFUufkg2HntqShtSnaWjRGJCM8AdMkJ2sT4Q2F-MJZdIGT-6L7dJ-7GpzTQPeeFzPHx6ye-U9MZqgnrwI9ig8qSR595P9AgyDR0e3Bx5hbQDjDtJDXmIEatVI1JVytJo_fFcAUKhsZmEUUW9cLDSh34BLf533t_TMYgKggn3Xy0SXk3hZ5Xg"/>
</div>
<div class="lg:w-1/2">
<div class="flex items-center gap-3 mb-6">
<div class="w-1 h-8 bg-surface-tint"></div>
<h2 class="text-3xl font-bold">Uncompromising Security</h2>
</div>
<p class="text-lg text-on-surface-variant mb-10">
                        The Samaritan System is built on a foundation of cryptographic trust. We provide military-grade data protection to ensure your organization remains compliant and resilient.
                    </p>
<div class="grid grid-cols-2 gap-8">
<div>
<div class="text-primary flex items-center gap-2 mb-2">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">verified_user</span>
<span class="font-bold">SOC2 Certified</span>
</div>
<p class="text-sm text-on-surface-variant">Continuous monitoring and annual external audits.</p>
</div>
<div>
<div class="text-primary flex items-center gap-2 mb-2">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">lock_person</span>
<span class="font-bold">Granular RBAC</span>
</div>
<p class="text-sm text-on-surface-variant">Role-based access control down to the individual field.</p>
</div>
<div>
<div class="text-primary flex items-center gap-2 mb-2">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">medical_information</span>
<span class="font-bold">HIPAA Compliant</span>
</div>
<p class="text-sm text-on-surface-variant">Secure health data management for medical tenants.</p>
</div>
<div>
<div class="text-primary flex items-center gap-2 mb-2">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">cloud_done</span>
<span class="font-bold">99.9% Uptime</span>
</div>
<p class="text-sm text-on-surface-variant">SLA-backed performance on multi-region AWS cloud.</p>
</div>
</div>
</div>
</div>
</section>
<!-- CTA Section -->
<section class="py-24 bg-primary text-white text-center relative overflow-hidden" id="pricing">
<div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container to-transparent opacity-50"></div>
<div class="max-w-4xl mx-auto px-6 relative z-10">
<h2 class="text-4xl lg:text-5xl font-extrabold mb-6">Ready to Orchestrate Your Enterprise?</h2>
<p class="text-xl text-primary-fixed mb-12 opacity-90">Join 2,500+ global organizations using Samaritan System to automate complexity and focus on growth.</p>
<div class="flex flex-col sm:flex-row gap-4 justify-center">
<a class="px-10 py-5 bg-white text-primary rounded-md font-bold text-lg hover:bg-primary-fixed transition-all" href="/register">Start 14-Day Free Trial</a>
<a class="px-10 py-5 bg-primary-container border-2 border-primary-fixed/30 rounded-md font-bold text-lg hover:bg-white/10 transition-all" href="/auth">Contact Sales Team</a>
</div>
</div>
</section>
</main>
<!-- Footer -->
<footer class="bg-slate-50 dark:bg-slate-950 full-width py-12 tonal-shift bg-slate-100 dark:bg-slate-900">
<div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
<div>
<div class="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">Samaritan System</div>
<p class="text-slate-500 dark:text-slate-400 text-sm max-w-sm">&copy; 2024 Samaritan System. All rights reserved. Defining the architectural flow of modern enterprise data.</p>
</div>
<div class="flex flex-wrap md:justify-end gap-6">
<a class="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-all" href="/">Privacy Policy</a>
<a class="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-all" href="/">Terms of Service</a>
<a class="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-all" href="/">Security</a>
<a class="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-all" href="/auth">Contact Sales</a>
</div>
</div>
</footer>
`

