'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function AuthForm({ type }: { type: 'login' | 'signup' }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (type === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error

                if (data.session) {
                    router.push('/')
                    router.refresh()
                } else {
                    alert('Check your email for the confirmation link!')
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                router.push('/')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4 pt-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold mb-2 capitalize">{type === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
                    <p className="text-muted-foreground text-sm">
                        {type === 'login' ? 'Enter your credentials to access your library' : 'Join our community of book lovers'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:ring-accent/20"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 h-12 bg-background/50 border-border/50 focus:ring-accent/20"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 text-base font-medium rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg shadow-foreground/10"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                {type === 'login' ? 'Sign In' : 'Sign Up'} <ArrowRight className="h-4 w-4" />
                            </span>
                        )}
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                        {type === 'login' ? (
                            <>
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-accent hover:underline font-medium">
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <Link href="/login" className="text-accent hover:underline font-medium">
                                    Login
                                </Link>
                            </>
                        )}
                    </div>
                </form>
            </motion.div>
        </div>
    )
}
