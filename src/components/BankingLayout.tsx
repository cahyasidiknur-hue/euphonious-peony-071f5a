import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  ArrowLeftRight,
  QrCode,
  History,
  User,
  LogOut,
  Landmark,
} from 'lucide-react'
import { useIdentity } from '../lib/identity-context'
import { useNavigate } from '@tanstack/react-router'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transfer', label: 'Transfer', icon: ArrowLeftRight },
  { to: '/qris', label: 'Bayar QRIS', icon: QrCode },
  { to: '/history', label: 'Riwayat', icon: History },
  { to: '/profile', label: 'Profil', icon: User },
]

export function BankingLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useIdentity()
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050914' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'linear-gradient(180deg, rgba(7, 18, 36, 0.98), rgba(4, 9, 22, 0.98))',
        borderRight: '1px solid rgba(50, 255, 211, 0.18)',
        boxShadow: '18px 0 70px rgba(0, 0, 0, 0.28)',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 0 24px',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(50, 255, 211, 0.14)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #32ffd3, #00b8ff 62%, #7c5cff)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(50, 255, 211, 0.22)',
            }}>
              <Landmark size={20} color="#03101b" />
            </div>
            <div>
              <div style={{ fontFamily: 'Rajdhani, Manrope, sans-serif', fontSize: '1.24rem', fontWeight: 700, color: '#e8fff9' }}>SIDIK<span style={{ color: '#32ffd3' }}>Bank</span></div>
              <div style={{ fontSize: '0.7rem', color: '#5d7e98', letterSpacing: '0.5px' }}>DIGITAL BANKING</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-link${currentPath === to || currentPath.startsWith(to + '/') ? ' active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(50, 255, 211, 0.14)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #00b8ff, #32ffd3)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: 700, color: '#03101b',
            }}>
              {(user?.name || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e8fff9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#5d7e98', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email}
              </div>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link" style={{ color: '#EF5350', width: '100%' }}>
            <LogOut size={16} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 260, flex: 1, minHeight: '100vh', background: 'radial-gradient(circle at top right, rgba(0, 184, 255, 0.12), transparent 34%), #050914' }}>
        {children}
      </main>
    </div>
  )
}
