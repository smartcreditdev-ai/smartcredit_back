import React from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  CreditCard,
  RefreshCw
} from 'lucide-react';

const CreditStatsOverview = ({ 
  totalClients = 0,
  totalPortfolio = 0,
  activeCredits = 0,
  pendingApplications = 0,
  overdueCredits = 0,
  approvedThisMonth = 0,
  prospects = 0,
  renewalsPending = 0,
  aplicaciones = [],
  clientesEnMora = []
  }) => {
  // Calcular indicadores de rendimiento basados en datos reales
  const performanceMetrics = React.useMemo(() => {
    if (!aplicaciones || aplicaciones.length === 0) {
      return {
        tasaAprobacion: 0,
        tiempoPromedioAprobacion: 0,
        tasaMora: 0
      };
    }

    // Calcular tasa de aprobación
    const totalAplicaciones = aplicaciones.length;
    const aplicacionesAprobadas = aplicaciones.filter(app => app.estado === 'Aprobado').length;
    const aplicacionesRechazadas = aplicaciones.filter(app => app.estado === 'Rechazado').length;
    const aplicacionesEvaluadas = aplicacionesAprobadas + aplicacionesRechazadas;
    
    // Solo calcular tasa si hay aplicaciones evaluadas
    const tasaAprobacion = aplicacionesEvaluadas > 0 ? (aplicacionesAprobadas / aplicacionesEvaluadas) * 100 : 0;

    // Calcular tiempo promedio de aprobación basado en fechas reales
    const aplicacionesConFecha = aplicaciones.filter(app => 
      app.fecha_solicitud && app.fecha_aprobacion && app.estado === 'Aprobado'
    );
    
    let tiempoPromedioAprobacion = 0;
    if (aplicacionesConFecha.length > 0) {
      const tiemposAprobacion = aplicacionesConFecha.map(app => {
        const fechaSolicitud = new Date(app.fecha_solicitud);
        const fechaAprobacion = new Date(app.fecha_aprobacion);
        const dias = (fechaAprobacion - fechaSolicitud) / (1000 * 60 * 60 * 24);
        return Math.max(0, dias); // Evitar valores negativos
      });
      tiempoPromedioAprobacion = tiemposAprobacion.reduce((sum, tiempo) => sum + tiempo, 0) / tiemposAprobacion.length;
    }

    // Calcular tasa de mora basada en cartera activa
    const carteraActiva = aplicaciones.filter(app => app.estado === 'Aprobado');
    const montoTotalCartera = carteraActiva.reduce((sum, app) => sum + (parseFloat(app.monto) || 0), 0);
    const montoEnMora = clientesEnMora?.reduce((sum, cliente) => sum + (parseFloat(cliente.monto) || 0), 0) || 0;
    
    const tasaMora = montoTotalCartera > 0 ? (montoEnMora / montoTotalCartera) * 100 : 0;

    return {
      tasaAprobacion: Math.round(tasaAprobacion * 10) / 10,
      tiempoPromedioAprobacion: Math.round(tiempoPromedioAprobacion * 10) / 10,
      tasaMora: Math.round(tasaMora * 10) / 10
    };
  }, [aplicaciones, clientesEnMora]);

  // Calcular cambios realistas basados en datos
  const calculateChanges = React.useMemo(() => {
    if (!aplicaciones || aplicaciones.length === 0) {
      return {
        totalClientsChange: '0%',
        portfolioChange: '0%',
        activeCreditsChange: '0',
        pendingChange: '0',
        overdueChange: '0',
        approvedChange: '0%',
        prospectsChange: '0',
        renewalsChange: '0'
      };
    }

    // Calcular cambios basados en fechas (último mes vs mes anterior)
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);

    // Aplicaciones del último mes
    const aplicacionesLastMonth = aplicaciones.filter(app => {
      const fecha = new Date(app.fecha_solicitud);
      return fecha >= lastMonth && fecha < now;
    });

    // Aplicaciones del mes anterior
    const aplicacionesTwoMonthsAgo = aplicaciones.filter(app => {
      const fecha = new Date(app.fecha_solicitud);
      return fecha >= twoMonthsAgo && fecha < lastMonth;
    });

    // Calcular cambios
    const totalClientsChange = aplicacionesTwoMonthsAgo.length > 0 
      ? Math.round(((aplicacionesLastMonth.length - aplicacionesTwoMonthsAgo.length) / aplicacionesTwoMonthsAgo.length) * 100)
      : 0;

    const portfolioLastMonth = aplicacionesLastMonth.reduce((sum, app) => sum + (parseFloat(app.monto) || 0), 0);
    const portfolioTwoMonthsAgo = aplicacionesTwoMonthsAgo.reduce((sum, app) => sum + (parseFloat(app.monto) || 0), 0);
    const portfolioChange = portfolioTwoMonthsAgo > 0 
      ? Math.round(((portfolioLastMonth - portfolioTwoMonthsAgo) / portfolioTwoMonthsAgo) * 100)
      : 0;

    const activeCreditsLastMonth = aplicacionesLastMonth.filter(app => app.estado === 'Aprobado').length;
    const activeCreditsTwoMonthsAgo = aplicacionesTwoMonthsAgo.filter(app => app.estado === 'Aprobado').length;
    const activeCreditsChange = activeCreditsLastMonth - activeCreditsTwoMonthsAgo;

    const pendingLastMonth = aplicacionesLastMonth.filter(app => app.estado === 'Pendiente' || app.estado === 'En revisión').length;
    const pendingTwoMonthsAgo = aplicacionesTwoMonthsAgo.filter(app => app.estado === 'Pendiente' || app.estado === 'En revisión').length;
    const pendingChange = pendingLastMonth - pendingTwoMonthsAgo;

    const overdueChange = clientesEnMora?.length || 0; // Simplificado por ahora

    const approvedChange = aplicacionesTwoMonthsAgo.length > 0 
      ? Math.round(((activeCreditsLastMonth - activeCreditsTwoMonthsAgo) / aplicacionesTwoMonthsAgo.length) * 100)
      : 0;

    return {
      totalClientsChange: `${totalClientsChange >= 0 ? '+' : ''}${totalClientsChange}%`,
      portfolioChange: `${portfolioChange >= 0 ? '+' : ''}${portfolioChange}%`,
      activeCreditsChange: `${activeCreditsChange >= 0 ? '+' : ''}${activeCreditsChange}`,
      pendingChange: `${pendingChange >= 0 ? '+' : ''}${pendingChange}`,
      overdueChange: `${overdueChange >= 0 ? '+' : ''}${overdueChange}`,
      approvedChange: `${approvedChange >= 0 ? '+' : ''}${approvedChange}%`,
      prospectsChange: '+0', // Simplificado
      renewalsChange: '+0' // Simplificado
    };
  }, [aplicaciones, clientesEnMora]);

  const stats = [
    {
      title: 'Total Clientes',
      value: totalClients.toLocaleString(),
      change: calculateChanges.totalClientsChange,
      icon: Users,
      color: 'blue',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Cartera Total',
      value: `$${totalPortfolio.toLocaleString()}`,
      change: calculateChanges.portfolioChange,
      icon: DollarSign,
      color: 'green',
      bgColor: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Créditos Activos',
      value: activeCredits.toLocaleString(),
      change: calculateChanges.activeCreditsChange,
      icon: CreditCard,
      color: 'purple',
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Solicitudes Pendientes',
      value: pendingApplications.toLocaleString(),
      change: calculateChanges.pendingChange,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'En Mora',
      value: overdueCredits.toLocaleString(),
      change: calculateChanges.overdueChange,
      icon: AlertTriangle,
      color: 'red',
      bgColor: 'bg-red-500',
      textColor: 'text-red-600'
    },
    {
      title: 'Aprobados Este Mes',
      value: approvedThisMonth.toLocaleString(),
      change: calculateChanges.approvedChange,
      icon: CheckCircle,
      color: 'emerald',
      bgColor: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Prospectos',
      value: prospects.toLocaleString(),
      change: calculateChanges.prospectsChange,
      icon: Users,
      color: 'indigo',
      bgColor: 'bg-indigo-500',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Renovaciones Pendientes',
      value: renewalsPending.toLocaleString(),
      change: calculateChanges.renewalsChange,
      icon: RefreshCw,
      color: 'orange',
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Resumen General de Créditos</h2>
          <p className="text-sm text-gray-600 mt-1">Estadísticas consolidadas del sistema</p>
        </div>
        <div className="text-sm text-gray-500">
          Última actualización: {new Date().toLocaleString('es-ES')}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.bgColor} mb-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs font-medium text-gray-600">{stat.title}</div>
              <div className={`text-xs font-medium ${
                stat.change.startsWith('+') 
                  ? stat.textColor 
                  : stat.change.startsWith('-') 
                    ? 'text-red-600' 
                    : 'text-gray-600'
              }`}>
                {stat.change} vs mes anterior
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicadores de Rendimiento */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              performanceMetrics.tasaAprobacion > 0 ? 'text-green-600' : 'text-gray-400'
            }`}>
              {performanceMetrics.tasaAprobacion > 0 ? `${performanceMetrics.tasaAprobacion}%` : 'Sin datos'}
            </div>
            <div className="text-sm text-gray-600">Tasa de Aprobación</div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceMetrics.tasaAprobacion > 0 ? 'Aprobadas vs Evaluadas' : 'No hay aplicaciones evaluadas'}
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              performanceMetrics.tiempoPromedioAprobacion > 0 ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {performanceMetrics.tiempoPromedioAprobacion > 0 ? `${performanceMetrics.tiempoPromedioAprobacion} días` : 'Sin datos'}
            </div>
            <div className="text-sm text-gray-600">Tiempo Promedio de Aprobación</div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceMetrics.tiempoPromedioAprobacion > 0 ? 'Basado en fechas reales' : 'No hay aprobaciones con fechas'}
            </div>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              performanceMetrics.tasaMora > 0 ? 'text-purple-600' : 'text-gray-400'
            }`}>
              {performanceMetrics.tasaMora > 0 ? `${performanceMetrics.tasaMora}%` : 'Sin datos'}
            </div>
            <div className="text-sm text-gray-600">Tasa de Mora</div>
            <div className="text-xs text-gray-500 mt-1">
              {performanceMetrics.tasaMora > 0 ? 'Monto en mora vs Cartera activa' : 'No hay cartera activa'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditStatsOverview;
