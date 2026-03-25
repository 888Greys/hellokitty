export const adminBody = String.raw`
<!-- SideNavBar (Shared Component) -->
<aside class="fixed left-0 top-0 h-full flex flex-col py-8 px-6 bg-[#213145] dark:bg-slate-950 h-screen w-72 flex-shrink-0 shadow-xl dark:shadow-none transition-all duration-200 ease-in-out z-50">
<div class="mb-10 flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white shadow-lg">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">business_center</span>
</div>
<div>
<h1 class="font-['Manrope'] font-bold tracking-tight text-white text-2xl font-black">Samaritan</h1>
<p class="text-xs text-slate-400 font-medium tracking-wider uppercase">Enterprise ERP</p>
</div>
</div>
<nav class="flex-grow space-y-2">
<!-- Step 1: Organization -->
<a class="group flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white transition-colors hover:bg-white/10 cursor-pointer" href="/register">
<span class="material-symbols-outlined" data-icon="business">business</span>
<span class="font-['Manrope'] font-bold tracking-tight">Organization</span>
<span class="ml-auto material-symbols-outlined text-sm text-primary-fixed-dim" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</a>
<!-- Step 2: Admin Account (ACTIVE) -->
<a class="group flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-lg border-l-4 border-[#0052CC] text-white font-semibold shadow-inner" href="/register/admin">
<span class="material-symbols-outlined" data-icon="admin_panel_settings" style="font-variation-settings: 'FILL' 1;">admin_panel_settings</span>
<span class="font-['Manrope'] font-bold tracking-tight">Admin Account</span>
</a>
<!-- Step 3: Finalize -->
<a class="group flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:text-white transition-colors hover:bg-white/10" href="/register/finalize">
<span class="material-symbols-outlined" data-icon="verified">verified</span>
<span class="font-['Manrope'] font-bold tracking-tight">Finalize</span>
</a>
</nav>
<div class="mt-auto pt-6 border-t border-white/10">
<div class="flex items-center gap-3 px-2">
<div class="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
<img class="w-full h-full object-cover" data-alt="professional portrait of a male executive in a blue suit with soft office lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAeTUB2Ahr3Mi0h62hjr0cTs-SyHTlFF8vGX7dyoLQMP7uxMq-NJlO87UglNBdUt8spPL8teixGa-xNsUVnIqC0-6v4vVa8ORslpkn1BTOUMjAOvwbLRuK3R67mxlWsxga8HvX85tnLqbH03xBXWf2QWIE7cV8luFDFSgO9jL1hfoMD1DyyC52R2nS7-sFwpqZnVQXRNEV_naVB_VeVk_iMVgPzhjBAAP8ZTI2H3zdTcxWh3cTsXmTbZ8GW5PV7HhBg_K4_oRnn6I"/>
</div>
<div class="overflow-hidden">
<p class="text-sm font-semibold text-white truncate">Setup Assistant</p>
<p class="text-[10px] text-slate-400 uppercase tracking-tighter">Onboarding Mode</p>
</div>
</div>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="flex-grow ml-72 min-h-screen bg-surface flex flex-col">
<!-- TopNavBar (Shared Component - Shell Only) -->
<header class="flex justify-end items-center w-full px-12 h-16 bg-[#f8f9ff] dark:bg-slate-900 border-b border-[#eff4ff] dark:border-slate-800">
<div class="flex items-center gap-6">
<div class="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer hover:text-[#0052CC] transition-colors">
<span class="material-symbols-outlined text-[20px]" data-icon="help_outline">help_outline</span>
<span class="font-['Inter'] text-sm font-medium">Support</span>
</div>
<div class="relative cursor-pointer hover:text-[#0052CC] transition-colors">
<span class="material-symbols-outlined text-[20px]" data-icon="notifications">notifications</span>
<span class="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
</div>
</div>
</header>
<!-- Centered Form Area -->
<section class="flex-grow flex items-center justify-center p-12 bg-surface-container-low overflow-y-auto">
<div class="max-w-2xl w-full">
<!-- Header Section -->
<div class="text-center mb-10">
<h2 class="font-headline text-3xl font-extrabold text-on-background tracking-tight mb-2">Set Up Your Admin Account</h2>
<p class="font-body text-on-surface-variant max-w-md mx-auto">Create the primary administrative identity for your Samaritan Enterprise ERP instance.</p>
</div>
<!-- Main Form Card -->
<div class="bg-surface-container-lowest rounded-xl shadow-xl shadow-on-surface/5 p-10 relative overflow-hidden">
<!-- Subtle Glass Accent -->
<div class="absolute top-0 left-0 w-full h-1 bg-gradient-primary"></div>
<form class="space-y-6" data-admin-form>
<div class="grid grid-cols-2 gap-6">
<!-- Full Name -->
<div class="col-span-2 md:col-span-1">
<label class="block font-label text-[0.6875rem] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Full Name</label>
<input class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-0 focus:bg-white border-b-2 border-transparent focus:border-surface-tint transition-all placeholder:text-outline-variant" name="fullName" placeholder="e.g. Alexander Pierce" required="" type="text"/>
</div>
<!-- Work Email -->
<div class="col-span-2 md:col-span-1">
<label class="block font-label text-[0.6875rem] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Work Email</label>
<input class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-0 focus:bg-white border-b-2 border-transparent focus:border-surface-tint transition-all placeholder:text-outline-variant" name="email" placeholder="alexander@company.com" required="" type="email"/>
</div>
</div>
<!-- Role/Job Title -->
<div>
<label class="block font-label text-[0.6875rem] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Role / Job Title</label>
<div class="relative">
<input class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-0 focus:bg-white border-b-2 border-transparent focus:border-surface-tint transition-all placeholder:text-outline-variant" name="role" placeholder="Systems Administrator" required="" type="text"/>
<span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant">work</span>
</div>
</div>
<!-- Password -->
<div>
<label class="block font-label text-[0.6875rem] font-bold uppercase tracking-wider text-on-surface-variant mb-2">Secure Password</label>
<div class="relative">
<input class="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-on-surface focus:ring-0 focus:bg-white border-b-2 border-transparent focus:border-surface-tint transition-all placeholder:text-outline-variant" minlength="8" name="password" placeholder="************" required="" type="password"/>
<button class="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary" type="button">
<span class="material-symbols-outlined">visibility</span>
</button>
</div>
<!-- Password Strength Indicator -->
<div class="mt-3">
<div class="flex justify-between items-center mb-1">
<span class="font-label text-[10px] text-on-surface-variant">Security Strength</span>
<span class="font-label text-[10px] text-primary font-bold">STRONG</span>
</div>
<div class="h-1 w-full bg-surface-container-high rounded-full overflow-hidden flex gap-0.5">
<div class="h-full bg-primary-container w-1/4 rounded-full"></div>
<div class="h-full bg-primary-container w-1/4 rounded-full"></div>
<div class="h-full bg-primary-container w-1/4 rounded-full"></div>
<div class="h-full bg-surface-dim w-1/4 rounded-full"></div>
</div>
</div>
</div>
<!-- Terms -->
<div class="flex items-start gap-3 py-2">
<input class="mt-1 rounded border-outline-variant text-primary focus:ring-primary h-4 w-4" id="admin-terms" name="terms" required="" type="checkbox"/>
<p class="font-body text-xs text-on-surface-variant leading-relaxed">
                                I agree to the <a class="text-primary font-semibold hover:underline" href="/">Terms of Service</a> and <a class="text-primary font-semibold hover:underline" href="/">Privacy Policy</a> regarding administrative data handling.
                            </p>
</div>
<!-- Action Button -->
<div class="pt-4">
<button class="w-full bg-gradient-primary text-white font-headline font-bold py-4 rounded-lg shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group" data-admin-submit type="submit">
                                Continue to Finalize
                                <span class="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
</button>
</div>
</form>
</div>
<!-- Security Badges Footer -->
<footer class="mt-12 flex items-center justify-center gap-8 opacity-60">
<div class="flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full grayscale hover:grayscale-0 transition-all cursor-default">
<span class="material-symbols-outlined text-primary text-lg" style="font-variation-settings: 'FILL' 1;">verified_user</span>
<span class="font-label font-bold text-xs text-on-surface tracking-widest">SOC2 TYPE II</span>
</div>
<div class="flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full grayscale hover:grayscale-0 transition-all cursor-default">
<span class="material-symbols-outlined text-primary text-lg" style="font-variation-settings: 'FILL' 1;">health_and_safety</span>
<span class="font-label font-bold text-xs text-on-surface tracking-widest">HIPAA COMPLIANT</span>
</div>
<div class="flex items-center gap-2 bg-surface-container-highest px-4 py-2 rounded-full grayscale hover:grayscale-0 transition-all cursor-default">
<span class="material-symbols-outlined text-primary text-lg" style="font-variation-settings: 'FILL' 1;">enhanced_encryption</span>
<span class="font-label font-bold text-xs text-on-surface tracking-widest">AES-256 BIT</span>
</div>
</footer>
</div>
</section>
</main>
<!-- Decorative Canvas Elements -->
<div class="fixed top-0 right-0 p-12 -z-10 opacity-20 pointer-events-none">
<svg fill="none" height="400" viewbox="0 0 400 400" width="400" xmlns="http://www.w3.org/2000/svg">
<circle cx="200" cy="200" r="180" stroke="url(#paint0_linear)" stroke-dasharray="2 10" stroke-width="40"></circle>
<defs>
<lineargradient gradientunits="userSpaceOnUse" id="paint0_linear" x1="200" x2="200" y1="20" y2="380">
<stop stop-color="#0052CC"></stop>
<stop offset="1" stop-color="#0052CC" stop-opacity="0"></stop>
</lineargradient>
</defs>
</svg>
</div>
`

