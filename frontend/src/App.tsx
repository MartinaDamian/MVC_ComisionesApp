import { useState, useEffect } from 'react'
import axios from 'axios'
import { Sparkles, Calendar, DollarSign, Users, FileText, Calculator, Heart, Award } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/MiniCore'

interface Vendedor {
  id: number
  nombre: string
}

interface Regla {
  id: number
  montoMinimo: number
  porcentaje: number
}

interface Venta {
  id: number
  fechaVenta: string
  monto: number
  vendedorId: number
  vendedorNombre: string
  reglaId: number
  reglaMontoMinimo: number
  reglaPorcentaje: number
}

interface ComisionResultado {
  vendedorId: number
  vendedorNombre: string
  comisionCalculada: number
}

export default function App() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([])
  const [reglas, setReglas] = useState<Regla[]>([])
  const [ventas, setVentas] = useState<Venta[]>([])

  const [fechaInicio, setFechaInicio] = useState<string>('2025-05-01')
  const [fechaFin, setFechaFin] = useState<string>('2025-06-30')
  const [resultados, setResultados] = useState<ComisionResultado[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [calculado, setCalculado] = useState<boolean>(false)

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [vendedoresRes, reglasRes, ventasRes] = await Promise.all([
        axios.get<Vendedor[]>(`${API_BASE_URL}/vendedores`),
        axios.get<Regla[]>(`${API_BASE_URL}/reglas`),
        axios.get<Venta[]>(`${API_BASE_URL}/ventas`)
      ])
      setVendedores(vendedoresRes.data)
      setReglas(reglasRes.data)
      setVentas(ventasRes.data)
      setError(null)
    } catch (err) {
      console.error('Error al cargar datos del backend:', err)
      setError('No se pudo conectar con el servidor. Asegúrate de que el Backend API esté ejecutándose.')
    } finally {
      setLoading(false)
    }
  }

  const handleCalcularComisiones = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fechaInicio || !fechaFin) {
      setError('Por favor selecciona la fecha de inicio y fin.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const response = await axios.get<ComisionResultado[]>(`${API_BASE_URL}/calcular-comisiones`, {
        params: {
          fechaInicio,
          fechaFin
        }
      })
      setResultados(response.data)
      setCalculado(true)
    } catch (err) {
      console.error('Error al calcular comisiones:', err)
      setError('Ocurrió un error al calcular las comisiones. Revisa las fechas ingresadas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF0F5] text-[#4A3B4E] p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header / Title */}
        <header className="text-center py-6 cute-card bg-gradient-to-r from-pink-100 via-pink-50 to-pink-100 border-pink-200 relative overflow-hidden">
          <div className="absolute top-2 left-4 text-pink-300">
            <Heart className="w-6 h-6 fill-pink-200" />
          </div>
          <div className="absolute bottom-2 right-4 text-pink-300">
            <Sparkles className="w-6 h-6 text-pink-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#D87093] flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
            Sistema de Cálculo de Comisiones
            <Heart className="w-6 h-6 text-pink-400 fill-pink-300" />
          </h1>
          <p className="text-pink-600 font-medium mt-2">
            MiniCore App - Gestión bonita y precisa de vendedores y comisiones 🎀
          </p>
        </header>

        {error && (
          <div className="bg-rose-100 border-2 border-rose-300 text-rose-700 px-6 py-4 rounded-2xl shadow-sm text-center font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* 1. SECCIÓN: TABLAS BASE */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-xl font-bold text-[#C71585]">
            <Users className="w-6 h-6 text-pink-500" />
            <h2>1. Tablas Base del Sistema</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Tabla Vendedores */}
            <div className="cute-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-pink-700 flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-400" />
                Vendedores
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-pink-100 text-pink-600">
                      <th className="py-2 px-3">ID</th>
                      <th className="py-2 px-3">Nombre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendedores.map((v) => (
                      <tr key={v.id} className="border-b border-pink-50 hover:bg-pink-50/50">
                        <td className="py-2 px-3 font-semibold text-pink-400">#{v.id}</td>
                        <td className="py-2 px-3 font-medium text-gray-700">{v.nombre}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabla Reglas */}
            <div className="cute-card p-6 space-y-4">
              <h3 className="text-lg font-bold text-pink-700 flex items-center gap-2">
                <FileText className="w-5 h-5 text-pink-400" />
                Reglas de Comisión
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-pink-100 text-pink-600">
                      <th className="py-2 px-3">ID</th>
                      <th className="py-2 px-3">Monto Mínimo</th>
                      <th className="py-2 px-3">Porcentaje</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reglas.map((r) => (
                      <tr key={r.id} className="border-b border-pink-50 hover:bg-pink-50/50">
                        <td className="py-2 px-3 font-semibold text-pink-400">#{r.id}</td>
                        <td className="py-2 px-3 font-medium text-gray-700">${r.montoMinimo.toFixed(2)}</td>
                        <td className="py-2 px-3">
                          <span className="cute-badge">{(r.porcentaje * 100).toFixed(0)}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Tabla Ventas */}
          <div className="cute-card p-6 space-y-4">
            <h3 className="text-lg font-bold text-pink-700 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-pink-400" />
              Registro de Ventas
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-pink-100 text-pink-600">
                    <th className="py-2.5 px-4">ID</th>
                    <th className="py-2.5 px-4">Fecha Venta</th>
                    <th className="py-2.5 px-4">Monto</th>
                    <th className="py-2.5 px-4">Vendedor</th>
                    <th className="py-2.5 px-4">Regla Asociada</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((v) => (
                    <tr key={v.id} className="border-b border-pink-50 hover:bg-pink-50/50">
                      <td className="py-2.5 px-4 font-semibold text-pink-400">#{v.id}</td>
                      <td className="py-2.5 px-4 font-medium text-gray-600">
                        {new Date(v.fechaVenta).toISOString().split('T')[0]}
                      </td>
                      <td className="py-2.5 px-4 font-bold text-pink-700">${v.monto.toFixed(2)}</td>
                      <td className="py-2.5 px-4 font-medium text-gray-800">{v.vendedorNombre}</td>
                      <td className="py-2.5 px-4">
                        <span className="bg-pink-100 text-pink-800 text-xs px-2.5 py-1 rounded-full font-medium">
                          Regla #{v.reglaId} (Min ${v.reglaMontoMinimo} -&gt; {(v.reglaPorcentaje * 100)}%)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </section>

        {/* 2. SECCIÓN: FILTRO DE CONSULTA */}
        <section className="cute-card p-6 space-y-4 bg-gradient-to-br from-white via-pink-50/30 to-pink-100/20">
          <div className="flex items-center gap-2 text-xl font-bold text-[#C71585]">
            <Calendar className="w-6 h-6 text-pink-500" />
            <h2>2. Consulta y Filtro de Fechas</h2>
          </div>

          <form onSubmit={handleCalcularComisiones} className="flex flex-col sm:flex-row items-end gap-4 pt-2">
            <div className="flex-1 w-full space-y-2">
              <label className="block text-sm font-bold text-pink-700">
                📅 Fecha Inicio
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="cute-input w-full"
                required
              />
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="block text-sm font-bold text-pink-700">
                📅 Fecha Fin
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="cute-input w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="cute-button flex items-center justify-center gap-2 w-full sm:w-auto text-base"
            >
              <Calculator className="w-5 h-5" />
              {loading ? 'Calculando...' : 'Calcular Comisiones'}
            </button>
          </form>
        </section>

        {/* 3. SECCIÓN: RESULTADOS DE COMISIONES */}
        <section className="cute-card p-6 space-y-4 border-2 border-pink-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold text-[#C71585]">
              <Award className="w-6 h-6 text-pink-500" />
              <h2>3. Resultados de Comisiones Calculadas</h2>
            </div>
            {calculado && (
              <span className="cute-badge bg-pink-200 text-pink-800">
                Filtrado: {fechaInicio} al {fechaFin}
              </span>
            )}
          </div>

          {!calculado && !loading && (
            <div className="text-center py-8 text-pink-400 font-medium">
              Selecciona un rango de fechas y haz clic en <strong>"Calcular Comisiones"</strong> para ver los resultados ✨
            </div>
          )}

          {calculado && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-pink-200 text-pink-700 bg-pink-50/50">
                    <th className="py-3 px-4 font-bold">Vendedor</th>
                    <th className="py-3 px-4 font-bold text-right">Comisión Calculada ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((res) => (
                    <tr key={res.vendedorId} className="border-b border-pink-100 hover:bg-pink-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-800 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-400 inline-block"></span>
                        {res.vendedorNombre}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-lg font-extrabold text-pink-600 bg-pink-100 px-3 py-1 rounded-xl">
                          ${res.comisionCalculada.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="text-center text-xs text-pink-400 pt-4">
          MVC ComisionesApp - Realizado con ❤️ ASP.NET Core 8.0 & React Vite Tailwind
        </footer>

      </div>
    </div>
  )
}
