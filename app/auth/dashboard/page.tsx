'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import withAuth from '../../hoc/withAuth'
import { ChevronDown, User, LogOut, Home, Users, FolderOpen, Package, ShoppingCart, BarChart } from 'lucide-react'
import { UserData } from '../../types/UserData';

const sidebarItems = [
  { name: 'Panel de control', icon: Home },
  { name: 'Accesos', icon: Users },
  { name: 'Categorías', icon: FolderOpen },
  { name: 'Productos', icon: Package },
  { name: 'Media', icon: Package },
  { name: 'Ventas', icon: ShoppingCart },
  { name: 'Reportes de Ventas', icon: BarChart },
]

const summaryCards = [
  { title: 'Usuarios', count: 4, color: 'bg-green-500' },
  { title: 'Categorías', count: 4, color: 'bg-orange-500' },
  { title: 'Productos', count: 12, color: 'bg-blue-500' },
  { title: 'Salidas', count: 13, color: 'bg-yellow-500' },
]

const highFlowProducts = [
  { title: 'Tornillo hexagonal 8mm x 45mm', totalSales: 4, totalQuantity: 17 },
  { title: 'Tornillo Phillips2 80mm', totalSales: 1, totalQuantity: 15 },
  { title: 'Filtro de gasolina', totalSales: 1, totalQuantity: 10 },
  { title: 'Tornillo Phillips1 80mm', totalSales: 1, totalQuantity: 10 },
  { title: 'Tornillo Phillips1 70mm', totalSales: 1, totalQuantity: 10 },
]

const latestSales = [
  { id: 1, product: 'Tornillo hexagonal 8mm x 45mm', date: '2020-06-11 02:28:05', quantity: 6 },
  { id: 2, product: 'Tornillo Phillips1 70mm', date: '2020-06-11 00:00:00', quantity: 6 },
  { id: 3, product: 'Filtro de gasolina', date: '2020-06-11 00:00:00', quantity: 6 },
  { id: 4, product: 'Tornillo Phillips1 90mm', date: '2020-06-10 00:00:00', quantity: 6 },
  { id: 5, product: 'Tornillo hexagonal 10mm x 50mm', date: '2020-06-09 00:00:00', quantity: 6 },
]

const recentlyAddedProducts = [
  { name: 'Tornillo Phillips1 80mm', category: 'Tornillos', price: '$3' },
  { name: 'Tornillo Phillips3 80mm', category: 'Tornillos', price: '$3' },
  { name: 'Tornillo Phillips2 90mm', category: 'Tornillos', price: '$3' },
  { name: 'Tornillo Phillips2 80mm', category: 'Tornillos', price: '$4' },
  { name: 'Tornillo Phillips2 70mm', category: 'Tornillos', price: '$4' },
]

interface DashboardProps {
  user: UserData;
  // otras props si las hay
}

function Dashboard({ user }: DashboardProps) {
  const [activePage, setActivePage] = useState('Panel de control')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token')

    if (token) {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.error('Error al hacer logout en el backend:', error)
      }
    }

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    sessionStorage.removeItem('access_token')
    sessionStorage.removeItem('refresh_token')

    router.push('/auth/login')
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800">
        <div className="p-4">
          <h1 className="text-white text-2xl font-bold">BUSINESS ASSISTANT V1.0.1</h1>
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 ${
                activePage === item.name ? 'bg-gray-700' : ''
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <item.icon className="h-6 w-6 mr-3" />
              {item.name}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Image src="/placeholder.svg" alt="Logo" width={32} height={32} />
              <span className="text-xl font-semibold">Dashboard</span>
            </div>
            <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <span>{user.name}</span>
              <ChevronDown className="w-4 h-4" />
            </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-600 flex items-center w-full text-left"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="flex-1 overflow-y-auto p-6">
          <header className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-100">El asistente virtual para tu negocio. By Yoel.</h2>
            <p className="text-sm text-gray-400">12/06/2020 11:37 am</p>
          </header>

          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-4">
            {summaryCards.map((card) => (
              <div key={card.title} className={`p-4 rounded-lg shadow-md ${card.color}`}>
                <div className="text-2xl font-bold text-white">{card.count}</div>
                <div className="text-white">{card.title}</div>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
            {/* High flow products */}
            <div className="p-4 bg-gray-800 rounded-lg shadow-md lg:col-span-2">
              <h3 className="text-xl font-semibold mb-4">PRODUCTOS DE MAYOR FLUJO</h3>
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2">Título</th>
                    <th className="pb-2">Total de salidas</th>
                    <th className="pb-2">Cantidad total</th>
                  </tr>
                </thead>
                <tbody>
                  {highFlowProducts.map((product) => (
                    <tr key={product.title} className="border-t border-gray-700">
                      <td className="py-2">{product.title}</td>
                      <td className="py-2">{product.totalSales}</td>
                      <td className="py-2">{product.totalQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Latest sales */}
            <div className="p-4 bg-gray-800 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">ÚLTIMAS SALIDAS</h3>
              <table className="w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Producto</th>
                    <th className="pb-2">Fecha</th>
                    <th className="pb-2">Salidas totales</th>
                  </tr>
                </thead>
                <tbody>
                  {latestSales.map((sale) => (
                    <tr key={sale.id} className="border-t border-gray-700">
                      <td className="py-2">{sale.id}</td>
                      <td className="py-2">{sale.product}</td>
                      <td className="py-2">{sale.date}</td>
                      <td className="py-2">{sale.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Recently added products */}
            <div className="p-4 bg-gray-800 rounded-lg shadow-md lg:col-span-3">
              <h3 className="text-xl font-semibold mb-4">PRODUCTOS RECIENTEMENTE AÑADIDOS</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {recentlyAddedProducts.map((product) => (
                  <div key={product.name} className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">{product.name}</span>
                      <span className="text-sm font-bold text-green-400">{product.price}</span>
                    </div>
                    <div className="text-xs text-gray-400">{product.category}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default withAuth(Dashboard)
