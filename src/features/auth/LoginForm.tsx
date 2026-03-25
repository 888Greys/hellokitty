import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { useAuthStore } from '../../stores/auth'
import { useUiStore } from '../../stores/ui'

const loginSchema = z.object({
  email: z.email('Enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

type LoginValues = z.infer<typeof loginSchema>

const providerTokens: Record<'google' | 'github', string> = {
  google: 'oauth-google-demo-jwt-token',
  github: 'oauth-github-demo-jwt-token',
}

export function LoginForm() {
  const loginWithJwt = useAuthStore((state) => state.loginWithJwt)
  const pushNotification = useUiStore((state) => state.pushNotification)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginValues) => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    loginWithJwt(`jwt-${crypto.randomUUID()}`, {
      email: values.email,
      provider: 'password',
    })
    pushNotification({
      title: 'Authentication successful',
      message: `Signed in as ${values.email}`,
    })
    toast.success('Logged in with JWT')
  }

  const handleOAuth = (provider: 'google' | 'github') => {
    loginWithJwt(providerTokens[provider], {
      email: `${provider}.user@company.com`,
      provider,
    })
    pushNotification({
      title: 'OAuth sign-in',
      message: `Signed in with ${provider}`,
    })
    toast.success(`OAuth login with ${provider}`)
  }

  return (
    <div className="space-y-4 rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
      <h2 className="font-headline text-2xl font-bold text-onSurface">Authentication</h2>
      <p className="text-sm text-onSurfaceVariant">JWT login with OAuth provider shortcuts.</p>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-semibold text-onSurface">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring"
            placeholder="ops@samaritan.io"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-semibold text-onSurface">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm outline-none ring-primary/30 focus:ring"
            placeholder="********"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-primaryContainer px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in with JWT'}
        </button>
      </form>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleOAuth('google')}
          className="rounded-md border border-blue-200 bg-surfaceContainerLow px-4 py-2 text-sm font-semibold text-onSurface"
        >
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => handleOAuth('github')}
          className="rounded-md border border-blue-200 bg-surfaceContainerLow px-4 py-2 text-sm font-semibold text-onSurface"
        >
          Continue with GitHub
        </button>
      </div>
    </div>
  )
}
