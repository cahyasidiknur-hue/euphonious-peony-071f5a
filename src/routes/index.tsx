import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { login, signup, AuthError } from '@netlify/identity'
import { useIdentity } from '../lib/identity-context'
import { useState, useEffect } from 'react'
import { Landmark, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: LoginPage,
})

type Mode = 'login' | 'signup'

function LoginPage() {
  const { user, ready } = useIdentity()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (ready && user) navigate({ to: '/dashboard' })
  }, [ready, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await login(email, password)
        navigate({ to: '/dashboard' })
      } else {
        await signup(email, password, { full_name: fullName })
        setSuccess('Pendaftaran berhasil! Cek email Anda untuk konfirmasi akun.')
      }
    } catch (err) {
      if (err instanceof AuthError) {
        if (err.status === 401) setError('Email atau password salah.')
        else if (err.status === 422) setError('Email tidak valid atau password terlalu lemah (min. 8 karakter).')
        else if (err.status === 403) setError('Pendaftaran tidak diizinkan saat ini.')
        else setError(err.message || 'Terjadi kesalahan. Coba lagi.')
      } else {
        setError('Terjadi kesalahan. Coba lagi.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (!ready) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050914' }}>
      <div style={{ color: '#5d7e98' }}>Memuat...</div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, rgba(50,255,211,0.08), transparent 36%), linear-gradient(315deg, rgba(0,184,255,0.12), transparent 40%), #050914',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600,
        background: 'radial-gradient(circle, rgba(0, 184, 255, 0.18) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(50, 255, 211, 0.14) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      {/* Left panel — branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 60 }}>
          <div style={{
            width: 48, height: 48,
            background: 'linear-gradient(135deg, #32ffd3, #00b8ff 62%, #7c5cff)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 28px rgba(50, 255, 211, 0.22)',
          }}>
            <Landmark size={26} color="#03101b" />
          </div>
          <div>
            <div style={{ fontFamily: 'Rajdhani, Manrope, sans-serif', fontSize: '1.68rem', fontWeight: 700, color: '#e8fff9' }}>
              SIDIK<span style={{ color: '#32ffd3' }}>Bank</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#5d7e98', letterSpacing: '1px' }}>DIGITAL BANKING</div>
          </div>
        </div>

        <h1 style={{ fontFamily: 'Rajdhani, Manrope, sans-serif', fontSize: '3.1rem', fontWeight: 700, color: '#e8fff9', lineHeight: 1.05, marginBottom: 20 }}>
          Perbankan Digital<br />
          <span style={{ color: '#32ffd3', textShadow: '0 0 22px rgba(50,255,211,0.22)' }}>Generasi Baru</span>
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#8bb2c8', lineHeight: 1.8, maxWidth: 420 }}>
          Kelola keuangan Anda dengan aman, cepat, dan mudah. Transfer, bayar QRIS, dan pantau transaksi kapan saja.
        </p>

        {/* Feature badges */}
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { icon: '🔒', label: 'Keamanan berlapis dengan enkripsi end-to-end' },
            { icon: '⚡', label: 'Transfer real-time 24/7 tanpa antri' },
            { icon: '📊', label: 'Pantau semua transaksi dalam satu dashboard' },
          ].map(({ icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: '1.2rem' }}>{icon}</span>
              <span style={{ color: '#8bb2c8', fontSize: '0.9rem' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{
        width: 480,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
      }}>
        <div style={{
          width: '100%',
          background: 'linear-gradient(145deg, rgba(10, 24, 45, 0.92), rgba(5, 13, 28, 0.9))',
          border: '1px solid rgba(50, 255, 211, 0.24)',
          borderRadius: 18,
          padding: '40px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.42), 0 0 42px rgba(0,184,255,0.08)',
        }}>
          {/* Mode toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(3, 9, 21, 0.72)',
            borderRadius: 8,
            padding: 4,
            marginBottom: 32,
          }}>
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  background: mode === m ? 'linear-gradient(135deg, #32ffd3, #00b8ff)' : 'transparent',
                  color: mode === m ? '#03101b' : '#8bb2c8',
                  fontFamily: 'inherit',
                }}
              >
                {m === 'login' ? 'Masuk' : 'Daftar'}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#e8fff9', marginBottom: 24, marginTop: 0 }}>
            {mode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'signup' && (
              <div>
                <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>Nama Lengkap</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                  required={mode === 'signup'}
                />
              </div>
            )}
            <div>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                  minLength={8}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4a6080', display: 'flex', alignItems: 'center' }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(239, 83, 80, 0.1)', border: '1px solid rgba(239, 83, 80, 0.3)', borderRadius: 8, color: '#EF5350', fontSize: '0.85rem' }}>
                <AlertCircle size={15} />
                {error}
              </div>
            )}
            {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(50, 255, 211, 0.1)', border: '1px solid rgba(50, 255, 211, 0.3)', borderRadius: 8, color: '#32ffd3', fontSize: '0.85rem' }}>
                <CheckCircle size={15} />
                {success}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Memproses...' : mode === 'login' ? 'Masuk ke Akun' : 'Buat Akun'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#5d7e98', marginTop: 24, marginBottom: 0 }}>
            Dengan masuk, Anda menyetujui <span style={{ color: '#32ffd3' }}>Syarat & Ketentuan</span> SIDIKBank.
          </p>
        </div>
      </div>
    </div>
  )
}
