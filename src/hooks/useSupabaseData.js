import { useState, useEffect } from 'react'
import * as api from '../services/api'

// Hook para obtener estadísticas del dashboard
export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    creditosActivos: 0,
    carteraTotal: 0,
    porcentajeMora: 0,
    promotoresActivos: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await api.getDashboardStats()
        setStats(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}

// Hook para obtener datos de gráficos
export const useChartData = (chartType) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        let chartData = []

        switch (chartType) {
          case 'moraPorRango':
            chartData = await api.getMoraPorRango()
            break
          case 'distribucionCartera':
            chartData = await api.getDistribucionCartera()
            break
          case 'solicitudesAprobadas':
            chartData = await api.getSolicitudesAprobadas()
            break
          case 'mapaClientes':
            chartData = await api.getMapaClientes()
            break
          case 'tendenciaCartera':
            chartData = await api.getTendenciaCartera()
            break
          default:
            chartData = []
        }

        setData(chartData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [chartType])

  return { data, loading, error }
}

// Hook para obtener clientes en mora
export const useClientesEnMora = () => {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        setLoading(true)
        const data = await api.getClientesEnMora()
        setClientes(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchClientes()
  }, [])

  return { clientes, loading, error }
}

// Hook para obtener usuarios
export const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true)
        const data = await api.getUsuarios()
        setUsuarios(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsuarios()
  }, [])

  return { usuarios, loading, error }
}

// Hook para obtener aplicaciones
export const useAplicaciones = () => {
  const [aplicaciones, setAplicaciones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAplicaciones = async () => {
      try {
        setLoading(true)
        const data = await api.getAplicaciones()
        setAplicaciones(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAplicaciones()
  }, [])

  return { aplicaciones, loading, error }
}

// Hook para obtener expedientes
export const useExpedientes = () => {
  const [expedientes, setExpedientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        setLoading(true)
        const data = await api.getExpedientes()
        setExpedientes(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchExpedientes()
  }, [])

  return { expedientes, loading, error }
}
