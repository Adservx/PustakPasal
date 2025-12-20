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
        <div className="flex items-center justify-center min-h-[80vh] px-3 sm:px-4 pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm sm:max-w-md glass-panel p-5 sm:p-6 md:p-8 rounded-2xl shadow-2xl"
            >
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-1.5 sm:mb-2 capitalize">{type === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                        {type === 'login' ? 'Enter your credentials to access your library' : 'Join our community of book lovers'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4 sm:space-y-5 md:space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="p-2.5 sm:p-3 rounded-lg bg-destructive/10 text-destructive text-xs sm:text-sm text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-3 sm:space-y-4">
                        <div className="space-y-2">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                <Input
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9 sm:pl-10 h-11 sm:h-12 bg-background/50 border-border/50 focus:ring-accent/20 text-sm sm:text-base"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-9 sm:pl-10 h-11 sm:h-12 bg-background/50 border-border/50 focus:ring-accent/20 text-sm sm:text-base"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 sm:h-12 text-sm sm:text-base font-medium rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg shadow-foreground/10"
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                {type === 'login' ? 'Sign In' : 'Sign Up'} <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </span>
                        )}
                    </Button>

                    <div className="text-center text-xs sm:text-sm text-muted-foreground">
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
