import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader as Loader2, Lock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

const adminEmail = import.meta.env.VITE_ADMIN_EMAIL ?? ''
const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? ''
const isDev = import.meta.env.DEV

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(adminEmail)
  const [password, setPassword] = useState(adminPassword)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="size-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-sidebar-foreground">Dar Nour</h1>
          <p className="text-sm text-sidebar-foreground/60 mt-1">Espace Administration</p>
        </div>

        <form onSubmit={handleLogin} className="bg-sidebar-accent rounded-2xl p-6 border border-sidebar-border space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-sidebar-foreground mb-1.5 block">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@darnour.ma"
              className="rounded-xl bg-sidebar border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-sidebar-foreground mb-1.5 block">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="rounded-xl bg-sidebar border-sidebar-border text-sidebar-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive">
              <Lock className="size-3.5 shrink-0" /> {error}
            </div>
          )}

          {isDev && adminEmail && adminPassword && (
            <div className="rounded-2xl border border-border bg-secondary p-3 text-xs text-muted-foreground mb-2">
              Test admin credentials:
              <div className="mt-1 font-semibold text-foreground">{adminEmail}</div>
              <div className="font-semibold text-foreground">{adminPassword}</div>
            </div>
          )}

          <Button type="submit" className="w-full rounded-xl shadow-md" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Lock className="size-4 mr-2" />}
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  )
}
