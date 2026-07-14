import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { parseBatteryCapacity, parseAutonomy } from '../../utils/vehicleDataParser';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const ChargingSimulator = ({ vehicle }) => {
  // Parse vehicle data
  const vehicleBatteryCapacity = vehicle?.Capacitebatterie ? 
    (() => {
      const parsed = parseBatteryCapacity(vehicle.Capacitebatterie);
      return parsed?.preferredValue || parsed?.usable || parsed?.gross || 60;
    })() : 60;

  const vehicleAutonomy = vehicle?.Autonomieofficielle ?
    (() => {
      const parsed = parseAutonomy(vehicle.Autonomieofficielle);
      return parsed?.average || parsed?.min || 400;
    })() : 400;

  // State management - use vehicle data as defaults
  const [batteryCapacity, setBatteryCapacity] = useState(vehicleBatteryCapacity);
  const [batteryRange, setBatteryRange] = useState([20, 80]); // [initialCharge, targetCharge]
  const [chargingType, setChargingType] = useState('home');
  const [season, setSeason] = useState('normal');
  const [carModel, setCarModel] = useState('standard');
  const [results, setResults] = useState(null);
  const [isDragging, setIsDragging] = useState(null); // 'start' or 'end' or null

  // Extract values for backward compatibility
  const initialCharge = batteryRange[0];
  const targetCharge = batteryRange[1];

  // Handle mouse events for custom slider
  const handleMouseDown = (type) => {
    setIsDragging(type);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const slider = e.currentTarget.getBoundingClientRect();
    const percent = Math.round(((e.clientX - slider.left) / slider.width) * 100 / 5) * 5;
    const clampedPercent = Math.max(0, Math.min(100, percent));
    
    if (isDragging === 'start' && clampedPercent < targetCharge - 5) {
      setBatteryRange([clampedPercent, targetCharge]);
    } else if (isDragging === 'end' && clampedPercent > initialCharge + 5) {
      setBatteryRange([initialCharge, clampedPercent]);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // Add mouse event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, initialCharge, targetCharge]);

  // Charging power configurations (kW)
  const chargingPowers = {
    home: { power: 3.7, label: 'Prise domestique (3.7 kW)' },
    wallbox: { power: 11, label: 'Wallbox (11 kW)' },
    public: { power: 22, label: 'Borne publique (22 kW)' },
    fastdc: { power: 50, label: 'Charge rapide DC (50 kW)' },
    superfast: { power: 150, label: 'Charge ultra-rapide (150 kW)' }
  };

  // Seasonal factors - using CSS variables for consistency
  const seasonalFactors = {
    winter: { factor: 1.3, label: 'Hiver (-10°C)', color: 'var(--winter-blue)' },
    cold: { factor: 1.15, label: 'Froid (0°C)', color: 'var(--cold-blue)' },
    normal: { factor: 1.0, label: 'Normal (20°C)', color: 'var(--primary-green)' },
    hot: { factor: 1.1, label: 'Chaud (35°C)', color: 'var(--hot-yellow)' }
  };

  // Car efficiency models
  const carModels = {
    efficient: { efficiency: 0.85, label: 'Efficace' },
    standard: { efficiency: 0.8, label: 'Standard' },
    performance: { efficiency: 0.75, label: 'Performant' }
  };

  // Calculate charging time and energy
  const calculateCharging = () => {
    const energyNeeded = (batteryCapacity * (targetCharge - initialCharge)) / 100;
    const maxPower = chargingPowers[chargingType].power;
    const seasonalMultiplier = seasonalFactors[season].factor;
    const efficiency = carModels[carModel].efficiency;
    
    // Effective power considering efficiency and season
    const effectivePower = maxPower * efficiency / seasonalMultiplier;
    
    // Basic charging time in hours
    let chargingTime = energyNeeded / effectivePower;
    
    // Fast charging curve simulation (reduced power at higher SOC)
    if (maxPower >= 50 && targetCharge > 70) {
      const highSocPenalty = 1 + (targetCharge - 70) * 0.02;
      chargingTime *= highSocPenalty;
    }
    
    const hours = Math.floor(chargingTime);
    const minutes = Math.round((chargingTime - hours) * 60);
    
    // Calculate cost estimation (MAD/kWh) - Moroccan Dirham prices
    const costPerKwh = chargingType === 'home' ? 1.8 : 
                     chargingType === 'wallbox' ? 1.8 :
                     chargingType === 'public' ? 3.5 : 4.5;
    const estimatedCost = energyNeeded * costPerKwh;
    
    // Calculate autonomy gained (assuming 4.5 km/kWh average)
    const autonomyGained = energyNeeded * 4.5;
    
    return {
      time: { hours, minutes, total: chargingTime },
      energy: energyNeeded,
      cost: estimatedCost,
      autonomy: autonomyGained,
      power: effectivePower
    };
  };

  // Update results when inputs change
  useEffect(() => {
    setResults(calculateCharging());
  }, [batteryCapacity, batteryRange, chargingType, season, carModel]);

  // Update battery capacity when vehicle changes
  useEffect(() => {
    setBatteryCapacity(vehicleBatteryCapacity);
  }, [vehicleBatteryCapacity]);

  // Generate charging curve data
  const generateChargingCurve = () => {
    if (!results) return null;
    
    const timePoints = [];
    const socPoints = [];
    const powerPoints = [];
    
    const totalTime = results.time.total;
    const steps = 20;
    
    for (let i = 0; i <= steps; i++) {
      const t = (totalTime * i) / steps;
      const progress = i / steps;
      let currentSoc = initialCharge + (targetCharge - initialCharge) * progress;
      
      // Power degradation for fast charging at high SOC
      let currentPower = results.power;
      if (chargingPowers[chargingType].power >= 50 && currentSoc > 70) {
        const degradation = 1 - (currentSoc - 70) * 0.015;
        currentPower *= Math.max(degradation, 0.3);
      }
      
      timePoints.push(Math.round(t * 60)); // minutes
      socPoints.push(Math.round(currentSoc));
      powerPoints.push(Math.round(currentPower));
    }
    
    return { timePoints, socPoints, powerPoints };
  };

  const curveData = generateChargingCurve();

  // Chart configurations
  const lineChartData = curveData ? {
    labels: curveData.timePoints.map(t => `${Math.floor(t/60)}h${String(t%60).padStart(2, '0')}`),
    datasets: [
      {
        label: 'État de charge (%)',
        data: curveData.socPoints,
        borderColor: 'var(--primary-green)',
        backgroundColor: 'rgba(45, 125, 50, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y'
      },
      {
        label: 'Puissance (kW)',
        data: curveData.powerPoints,
        borderColor: 'var(--eco-blue)',
        backgroundColor: 'rgba(0, 121, 107, 0.1)',
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  } : null;

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Courbe de recharge'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Temps de charge'
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'État de charge (%)'
        },
        min: 0,
        max: 100
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Puissance (kW)'
        },
        grid: {
          drawOnChartArea: false,
        },
      }
    }
  };

  // Battery visualization
  const batteryData = {
    labels: ['Charge actuelle', 'À charger', 'Capacité restante'],
    datasets: [{
      data: [
        initialCharge,
        targetCharge - initialCharge,
        100 - targetCharge
      ],
      backgroundColor: [
        'var(--chart-green-1)',
        'var(--chart-green-2)',
        'var(--chart-gray)'
      ],
      borderWidth: 0
    }]
  };

  const batteryOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'État de la batterie'
      }
    }
  };

  // Comparison chart for different charging types
  const comparisonData = {
    labels: Object.keys(chargingPowers).map(key => chargingPowers[key].label),
    datasets: [{
      label: 'Temps de charge (heures)',
      data: Object.keys(chargingPowers).map(key => {
        const tempResults = { ...results };
        const energyNeeded = (batteryCapacity * (targetCharge - initialCharge)) / 100;
        const power = chargingPowers[key].power * carModels[carModel].efficiency / seasonalFactors[season].factor;
        return energyNeeded / power;
      }),
      backgroundColor: [
        'var(--chart-red)',
        'var(--chart-orange)',
        'var(--chart-yellow)',
        'var(--chart-green-2)',
        'var(--chart-green-1)'
      ]
    }]
  };

  const comparisonOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Comparaison des temps de charge'
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Heures'
        }
      }
    }
  };

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8fffe' }}>
      <div className="container">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h1 className="display-4 fw-bold" style={{ color: '#065f46' }}>
              Simulateur de Temps de Recharge
            </h1>
            <p className="lead text-muted">
              Calculez le temps de recharge de votre véhicule électrique
            </p>
          </div>
        </div>

        <div className="row">
          {/* Configuration Panel */}
          <div className="col-lg-4 mb-4">
            <div className="card border-0 shadow-sm h-100" style={{ borderTop: '4px solid #10b981' }}>
              <div className="card-header bg-white">
                <h5 className="card-title mb-0" style={{ color: '#065f46' }}>
                  <i className="bi bi-gear-fill me-2"></i>
                  Configuration
                </h5>
              </div>
              <div className="card-body">
                {/* Vehicle Info */}
                <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#f0fdf4' }}>
                  <h6 className="fw-bold mb-2" style={{ color: '#065f46' }}>
                    {vehicle?.Brand || vehicle?.Marque} {vehicle?.FullName || vehicle?.Modele}
                  </h6>
                  <div className="small text-muted">
                    <div>Batterie: <strong>{vehicleBatteryCapacity} kWh</strong></div>
                    <div>Autonomie: <strong>{vehicleAutonomy} km</strong></div>
                  </div>
                </div>

                {/* Battery Capacity - Fixed from vehicle data */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Capacité batterie: {batteryCapacity} kWh
                  </label>
                  <div className="form-control-plaintext bg-light p-2 rounded">
                    Capacité fixée selon le véhicule sélectionné
                  </div>
                </div>

                {/* Battery Charging Range */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">
                    Plage de charge: {initialCharge}% → {targetCharge}%
                  </label>
                  
                  {/* Unified Battery Slider */}
                  <div className="position-relative mb-3" style={{ height: '80px', padding: '20px 0' }}>
                    {/* Interactive battery track with gradient background */}
                    <div 
                      className="position-relative" 
                      style={{ height: '24px', cursor: 'pointer' }}
                      onMouseDown={(e) => {
                        const slider = e.currentTarget.getBoundingClientRect();
                        const percent = Math.round(((e.clientX - slider.left) / slider.width) * 100 / 5) * 5;
                        const clampedPercent = Math.max(0, Math.min(100, percent));
                        
                        // Determine which thumb is closer
                        const distToStart = Math.abs(clampedPercent - initialCharge);
                        const distToEnd = Math.abs(clampedPercent - targetCharge);
                        
                        if (distToStart < distToEnd && clampedPercent < targetCharge - 5) {
                          setBatteryRange([clampedPercent, targetCharge]);
                          setIsDragging('start');
                        } else if (clampedPercent > initialCharge + 5) {
                          setBatteryRange([initialCharge, clampedPercent]);
                          setIsDragging('end');
                        }
                      }}
                      onMouseMove={handleMouseMove}
                    >
                      {/* Background battery track with color zones */}
                      <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '24px',
                        background: 'linear-gradient(to right, #ef4444 0%, #eab308 30%, #22c55e 50%, #22c55e 80%, #eab308 90%, #ef4444 100%)',
                        borderRadius: '12px',
                        border: '2px solid #d1d5db'
                      }}>
                        {/* Active charging range overlay */}
                        <div style={{
                          position: 'absolute',
                          left: `${initialCharge}%`,
                          width: `${targetCharge - initialCharge}%`,
                          top: '2px',
                          bottom: '2px',
                          background: 'linear-gradient(45deg, rgba(16, 185, 129, 0.9), rgba(34, 197, 94, 0.9))',
                          borderRadius: '10px',
                          border: '2px solid #ffffff',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                        }}></div>
                        
                        {/* Start thumb with enhanced styling */}
                        <div 
                          className="position-absolute"
                          style={{
                            left: `${initialCharge}%`,
                            top: '-2px',
                            width: '28px',
                            height: '28px',
                            background: isDragging === 'start' ? 'linear-gradient(135deg, #047857, #065f46)' : 'linear-gradient(135deg, #10b981, #047857)',
                            borderRadius: '50%',
                            border: '3px solid #ffffff',
                            boxShadow: isDragging === 'start' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 3px 8px rgba(0,0,0,0.25)',
                            transform: 'translateX(-50%)',
                            cursor: 'grab',
                            zIndex: isDragging === 'start' ? 10 : 5,
                            transition: isDragging ? 'none' : 'all 0.2s ease'
                          }}
                          title={`Charge initiale: ${initialCharge}%`}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleMouseDown('start');
                          }}
                        >
                          <div style={{
                            position: 'absolute',
                            top: '-35px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#10b981',
                            whiteSpace: 'nowrap',
                            background: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            border: '1px solid #e5e7eb'
                          }}>
                            {initialCharge}%
                          </div>
                        </div>
                        
                        {/* End thumb with enhanced styling */}
                        <div 
                          className="position-absolute"
                          style={{
                            left: `${targetCharge}%`,
                            top: '-2px',
                            width: '28px',
                            height: '28px',
                            background: isDragging === 'end' ? 'linear-gradient(135deg, #15803d, #166534)' : 'linear-gradient(135deg, #22c55e, #15803d)',
                            borderRadius: '50%',
                            border: '3px solid #ffffff',
                            boxShadow: isDragging === 'end' ? '0 4px 12px rgba(0,0,0,0.3)' : '0 3px 8px rgba(0,0,0,0.25)',
                            transform: 'translateX(-50%)',
                            cursor: 'grab',
                            zIndex: isDragging === 'end' ? 10 : 5,
                            transition: isDragging ? 'none' : 'all 0.2s ease'
                          }}
                          title={`Charge cible: ${targetCharge}%`}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            handleMouseDown('end');
                          }}
                        >
                          <div style={{
                            position: 'absolute',
                            top: '-35px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#22c55e',
                            whiteSpace: 'nowrap',
                            background: 'white',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            border: '1px solid #e5e7eb'
                          }}>
                            {targetCharge}%
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Percentage scale */}
                    <div className="d-flex justify-content-between mt-3 px-1">
                      <span className="small text-muted">0%</span>
                      <span className="small text-muted">25%</span>
                      <span className="small text-muted">50%</span>
                      <span className="small text-muted">75%</span>
                      <span className="small text-muted">100%</span>
                    </div>
                  </div>
                  
                  {/* Charging info summary */}
                  <div className="p-3 rounded" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="d-flex flex-column">
                          <small className="text-muted">Départ</small>
                          <strong className="text-primary fs-5">{initialCharge}%</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="d-flex flex-column">
                          <small className="text-muted">Énergie nécessaire</small>
                          <strong className="text-success fs-5">{((batteryCapacity * (targetCharge - initialCharge)) / 100).toFixed(1)} kWh</strong>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="d-flex flex-column">
                          <small className="text-muted">Arrivée</small>
                          <strong className="text-warning fs-5">{targetCharge}%</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charging Type */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Type de recharge</label>
                  <select
                    className="form-select"
                    value={chargingType}
                    onChange={(e) => setChargingType(e.target.value)}
                  >
                    {Object.entries(chargingPowers).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>

                {/* Season */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Conditions météo</label>
                  <select
                    className="form-select"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                  >
                    {Object.entries(seasonalFactors).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>

                {/* Car Model */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Type d'Usage</label>
                  <select
                    className="form-select"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                  >
                    {Object.entries(carModels).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="col-lg-8">
            {results && (
              <>
                {/* Key Results Cards */}
                <div className="row mb-4">
                  <div className="col-md-3 mb-3">
                    <div className="card text-center border-0 shadow-sm h-100" style={{ backgroundColor: '#ecfdf5' }}>
                      <div className="card-body">
                        <div className="h2 fw-bold mb-1" style={{ color: '#065f46' }}>
                          {results.time.hours}h{String(results.time.minutes).padStart(2, '0')}
                        </div>
                        <small className="text-muted">Temps de charge</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card text-center border-0 shadow-sm h-100" style={{ backgroundColor: '#f0f9ff' }}>
                      <div className="card-body">
                        <div className="h2 fw-bold mb-1" style={{ color: '#0c4a6e' }}>
                          {results.energy.toFixed(1)} kWh
                        </div>
                        <small className="text-muted">Énergie ajoutée</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card text-center border-0 shadow-sm h-100" style={{ backgroundColor: '#fefce8' }}>
                      <div className="card-body">
                        <div className="h2 fw-bold mb-1" style={{ color: '#713f12' }}>
                          {results.cost.toFixed(2)} MAD
                        </div>
                        <small className="text-muted">Coût estimé</small>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 mb-3">
                    <div className="card text-center border-0 shadow-sm h-100" style={{ backgroundColor: '#f0fdf4' }}>
                      <div className="card-body">
                        <div className="h2 fw-bold mb-1" style={{ color: '#14532d' }}>
                          {Math.round(results.autonomy)} km
                        </div>
                        <small className="text-muted">Autonomie gagnée</small>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Row */}
                <div className="row">
                  {/* Charging Curve */}
                  <div className="col-lg-8 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        {lineChartData && (
                          <Line data={lineChartData} options={lineChartOptions} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Battery Visualization */}
                  <div className="col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm h-100">
                      <div className="card-body">
                        <Doughnut data={batteryData} options={batteryOptions} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charging Options Comparison Table */}
                <div className="row">
                  <div className="col-12">
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-white">
                        <h5 className="card-title mb-0" style={{ color: '#065f46' }}>
                          <i className="bi bi-lightning-charge-fill me-2"></i>
                          Comparaison des options de recharge
                        </h5>
                      </div>
                      <div className="card-body p-0">
                        <div className="table-responsive">
                          <table className="table table-hover mb-0">
                            <thead style={{ backgroundColor: '#f8fffe' }}>
                              <tr>
                                <th className="fw-semibold text-muted small">Puissance délivrée</th>
                                <th className="fw-semibold text-muted small text-center">Type</th>
                                <th className="fw-semibold text-muted small text-center">Puissance acceptée</th>
                                <th className="fw-semibold text-muted small text-center">Temps de charge</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(chargingPowers).map(([key, powerConfig]) => {
                                const energyNeeded = (batteryCapacity * (targetCharge - initialCharge)) / 100;
                                const effectivePower = powerConfig.power * carModels[carModel].efficiency / seasonalFactors[season].factor;
                                let chargingTime = energyNeeded / effectivePower;
                                
                                // Apply fast charging penalty if applicable
                                if (powerConfig.power >= 50 && targetCharge > 70) {
                                  const highSocPenalty = 1 + (targetCharge - 70) * 0.02;
                                  chargingTime *= highSocPenalty;
                                }
                                
                                const hours = Math.floor(chargingTime);
                                const minutes = Math.round((chargingTime - hours) * 60);
                                const isSelected = chargingType === key;
                                const isDC = key === 'fastdc' || key === 'superfast';
                                
                                // Calculate progress bar width (relative to slowest option)
                                const maxTime = (energyNeeded / chargingPowers.home.power) * seasonalFactors[season].factor / carModels[carModel].efficiency;
                                const progressWidth = Math.max(5, (chargingTime / maxTime) * 100);
                                
                                return (
                                  <tr 
                                    key={key} 
                                    className={isSelected ? 'table-success' : ''}
                                    style={{ 
                                      backgroundColor: isSelected ? '#f0fdf4' : 'transparent',
                                      borderLeft: isSelected ? '4px solid #10b981' : '4px solid transparent'
                                    }}
                                  >
                                    <td className="py-3">
                                      <div className="d-flex align-items-center">
                                        <span className="fw-semibold">{powerConfig.power} kW</span>
                                        <span className="text-muted ms-2 small">
                                          ({powerConfig.power < 20 ? Math.round(powerConfig.power * 1000/230) + 'A' : 
                                             powerConfig.power < 50 ? '3x ' + Math.round(powerConfig.power * 1000/400/1.732) + 'A' :
                                             powerConfig.power + ' kW'})
                                        </span>
                                      </div>
                                    </td>
                                    <td className="text-center py-3">
                                      <span className={`badge ${isDC ? 'bg-warning' : 'bg-primary'}`}>
                                        {isDC ? 'DC' : 'AC'}
                                      </span>
                                    </td>
                                    <td className="text-center py-3">
                                      <div className="d-flex align-items-center justify-content-center">
                                        <span className="fw-bold">{effectivePower.toFixed(1)} kW</span>
                                      </div>
                                    </td>
                                    <td className="text-center py-3">
                                      <div className="d-flex align-items-center justify-content-end">
                                        <div className="progress me-3" style={{ width: '200px', height: '18px' }}>
                                          <div 
                                            className={`progress-bar ${
                                              chargingTime < 2 ? 'bg-success' :
                                              chargingTime < 8 ? 'bg-warning' : 'bg-danger'
                                            }`}
                                            style={{ width: `${progressWidth}%` }}
                                          ></div>
                                        </div>
                                        <span className="fw-bold" style={{ 
                                          color: chargingTime < 2 ? '#059669' : 
                                                 chargingTime < 8 ? '#d97706' : '#dc2626',
                                          minWidth: '70px',
                                          textAlign: 'right'
                                        }}>
                                          {hours}h{String(minutes).padStart(2, '0')}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        
                        {/* Legend */}
                        <div className="p-3 border-top" style={{ backgroundColor: '#f8fffe' }}>
                          <div className="row text-center">
                            <div className="col-md-4">
                              <small className="text-muted">
                                <i className="bi bi-check-circle me-1 text-success"></i>
                                Option sélectionnée: {chargingPowers[chargingType].label}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ backgroundColor: '#f0fdf4' }}>
              <div className="card-body">
                <h5 className="card-title" style={{ color: '#065f46' }}>
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Informations importantes
                </h5>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Les temps sont calculés selon les conditions optimales
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        La puissance diminue à partir de 70% de charge
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                        Les conditions météo affectent l'efficacité
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                        Évitez les charges à 100% au quotidien
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                        La charge rapide est plus coûteuse
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                        Les coûts varient selon le fournisseur
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChargingSimulator;
