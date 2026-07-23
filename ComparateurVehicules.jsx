import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Table, Modal, Spinner, Pagination } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchElectricVehicles } from '../store/slices/vehiclesSlice'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import StarRating from '../components/UI/StarRating'
import ImageWithFallback from '../components/UI/ImageWithFallback'
import { formatMAD } from '../utils/helpers'
import { toast } from 'react-toastify'
import missingImage from '../assets/images/missing.png'

const ComparateurVehicules = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // State management
  const { loading, error } = useSelector(state => state.vehicles || {})
  const [searchVehicles, setSearchVehicles] = useState([]) // Vehicles for search/modal
  const [searchPagination, setSearchPagination] = useState({})
  const [searchLoading, setSearchLoading] = useState(false)
  const [allBrands, setAllBrands] = useState([])
  const [selectedVehicles, setSelectedVehicles] = useState([])
  const [searchInput, setSearchInput] = useState('') // What user is typing
  const [searchTerm, setSearchTerm] = useState('') // What we actually search for
  const [brandFilter, setBrandFilter] = useState('')
  const [showVehicleModal, setShowVehicleModal] = useState(false)
  const [showComparisonHelp, setShowComparisonHelp] = useState(false)
  
  // Pagination for vehicle selection modal
  const [currentModalPage, setCurrentModalPage] = useState(1)
  const VEHICLES_PER_MODAL_PAGE = 12

  // Fetch vehicles for the modal based on search and filters
  const fetchModalVehicles = async (page = 1, search = '', brand = '') => {
    setSearchLoading(true)
    try {
      const params = {
        page,
        pageSize: VEHICLES_PER_MODAL_PAGE,
        sortBy: 'name',
        search: search || '',
        // Only include filters if they have values
        ...(brand && { brands: [brand] }),
        // No restrictive price filter to get maximum search results
        priceRange: [0, 10000000] // Very wide range
      }

      console.log('� Searching vehicles with params:', params)
      
      // Dispatch to get search results
      const result = await dispatch(fetchElectricVehicles(params))
      
      if (result.payload) {
        const vehiclesData = result.payload.data || []
        const paginationData = result.payload.meta?.pagination || {}
        
        console.log('📊 Search results:', vehiclesData.length, 'vehicles found, pagination:', paginationData)
        
        setSearchVehicles(vehiclesData)
        setSearchPagination(paginationData)
      }
    } catch (error) {
      console.error('Error fetching modal vehicles:', error)
      toast.error('Erreur lors du chargement des véhicules')
    } finally {
      setSearchLoading(false)
    }
  }

  // Fetch initial data for filters (brands)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch multiple pages to get all available brands
        const results = await Promise.all([
          dispatch(fetchElectricVehicles({ page: 1, pageSize: 100, sortBy: 'name' })),
          dispatch(fetchElectricVehicles({ page: 2, pageSize: 100, sortBy: 'name' })),
          dispatch(fetchElectricVehicles({ page: 3, pageSize: 100, sortBy: 'name' })),
          dispatch(fetchElectricVehicles({ page: 4, pageSize: 100, sortBy: 'name' })),
          dispatch(fetchElectricVehicles({ page: 5, pageSize: 100, sortBy: 'name' }))
        ])
        
        // Combine all vehicles to get comprehensive brand list
        const allVehicles = results.flatMap(result => result.payload?.data || [])
        const brands = [...new Set(allVehicles.map(v => v.Brand || v.Marque).filter(Boolean))].sort()
        
        console.log('📋 Found brands from', allVehicles.length, 'vehicles:', brands)
        setAllBrands(brands)
      } catch (error) {
        console.error('Error fetching initial data:', error)
      }
    }
    
    fetchInitialData()
  }, [dispatch])

  // Fetch vehicles when modal opens or filters change
  useEffect(() => {
    if (showVehicleModal) {
      fetchModalVehicles(currentModalPage, searchTerm, brandFilter)
    }
  }, [showVehicleModal, currentModalPage, searchTerm, brandFilter])

  // Filter available vehicles for selection (from search results)
  const getFilteredVehicles = () => {
    if (!searchVehicles || !Array.isArray(searchVehicles)) return []
    
    // Filter out already selected vehicles
    return searchVehicles.filter(vehicle => 
      !selectedVehicles.some(selected => selected.id === vehicle.id)
    )
  }

  // Get paginated vehicles for modal (using API pagination)
  const getPaginatedVehicles = () => {
    return {
      vehicles: getFilteredVehicles(),
      totalVehicles: searchPagination.total || 0,
      totalPages: searchPagination.pageCount || 1,
      currentPage: searchPagination.page || 1
    }
  }

  // Add vehicle to comparison
  const addToComparison = (vehicle) => {
    if (selectedVehicles.length >= 4) {
      toast.warning('Vous ne pouvez comparer que 4 véhicules maximum')
      return
    }
    
    if (!selectedVehicles.some(v => v.id === vehicle.id)) {
      setSelectedVehicles([...selectedVehicles, vehicle])
      const vehicleName = vehicle.FullName || vehicle.Modele || 'Véhicule'
      toast.success(`${vehicleName} ajouté à la comparaison`)
    }
  }

  // Remove vehicle from comparison
  const removeFromComparison = (vehicleId) => {
    setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicleId))
    toast.info('Véhicule retiré de la comparaison')
  }

  // Clear all comparisons
  const clearComparison = () => {
    setSelectedVehicles([])
    toast.info('Comparaison effacée')
  }

  // Handle modal show/hide
  const handleShowVehicleModal = () => {
    setCurrentModalPage(1) // Reset to first page when opening modal
    setSearchInput('') // Clear search input
    setSearchTerm('') // Clear search term
    setBrandFilter('') // Clear brand filter
    setShowVehicleModal(true)
  }

  const handleCloseVehicleModal = () => {
    setShowVehicleModal(false)
  }

  // Handle modal page change
  const handleModalPageChange = (page) => {
    setCurrentModalPage(page)
  }

  // Handle search input changes (just update the input field)
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  // Handle search submission (Enter key or explicit search)
  const handleSearchSubmit = (e) => {
    if (e) {
      e.preventDefault()
    }
    setCurrentModalPage(1) // Reset to first page
    
    // Only update search term if there's actual content, otherwise clear it
    if (searchInput.trim()) {
      setSearchTerm(searchInput.trim())
    } else {
      setSearchTerm('') // Clear search filter if input is empty
    }
  }

  // Handle Enter key in search input
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e)
    }
  }

  // Reset modal page when filters change
  const handleFilterChange = (type, value) => {
    setCurrentModalPage(1) // Reset to first page when filters change
    
    if (type === 'search') {
      setSearchTerm(value)
    } else if (type === 'brand') {
      setBrandFilter(value)
    }
    // Note: useEffect will trigger the API call when state changes
  }

  // Get unique brands for filter
  const getBrands = () => {
    return allBrands
  }

  // Get comparison features specific to vehicles
  const getComparisonFeatures = () => {
    if (selectedVehicles.length === 0) return []
    
    const features = new Set()
    
    selectedVehicles.forEach(vehicle => {
      // Basic features
      features.add('name')
      features.add('brand')
      features.add('category')
      features.add('rating')
      features.add('price')
      features.add('status')
      
      // Vehicle-specific features
      if (vehicle.Autonomieofficielle || vehicle.range) features.add('autonomy')
      if (vehicle.Accelerationde0a100kmh || vehicle.acceleration) features.add('acceleration')
      if (vehicle.Vitessemaxi || vehicle.topSpeed) features.add('topSpeed')
      if (vehicle.Puissancemaxi || vehicle.power) features.add('power')
      if (vehicle.Capacitedebatterie || vehicle.batteryCapacity) features.add('batteryCapacity')
      if (vehicle.Tempsderechargerapide || vehicle.fastCharging) features.add('fastCharging')
      if (vehicle.Consommation || vehicle.consumption) features.add('consumption')
      if (vehicle.Typederecharge || vehicle.chargingType) features.add('chargingType')
      if (vehicle.Nombredeplace || vehicle.seats) features.add('seats')
      if (vehicle.Volumedecoffre || vehicle.trunkVolume) features.add('trunkVolume')
      if (vehicle.Longueur || vehicle.length) features.add('length')
      if (vehicle.Largeur || vehicle.width) features.add('width')
      if (vehicle.Hauteur || vehicle.height) features.add('height')
      if (vehicle.Poids || vehicle.weight) features.add('weight')
      if (vehicle.Transmissiond || vehicle.transmission) features.add('transmission')
      if (vehicle.Garantie || vehicle.warranty) features.add('warranty')
    })
    
    return Array.from(features)
  }

  // Get feature value for a vehicle
  const getFeatureValue = (vehicle, feature) => {
    switch (feature) {
      case 'name':
        return vehicle.FullName || `${vehicle.Brand || vehicle.Marque} ${vehicle.Modele}` || 'N/A'
      case 'brand':
        return vehicle.Brand || vehicle.Marque || 'N/A'
      case 'category':
        return vehicle.Categorie || vehicle.category || 'N/A'
      case 'rating':
        return vehicle.rating || (Math.random() > 0.3 ? 5 : 4)
      case 'price':
        return vehicle.prix ? formatMAD(parseInt(vehicle.prix)) : 'Prix sur demande'
      case 'status':
        return vehicle.etat || vehicle.status || 'N/A'
      case 'autonomy':
        return vehicle.Autonomieofficielle || vehicle.range || 'N/A'
      case 'acceleration':
        return vehicle.Accelerationde0a100kmh || vehicle.acceleration || 'N/A'
      case 'topSpeed':
        return vehicle.Vitessemaxi || vehicle.topSpeed || 'N/A'
      case 'power':
        return vehicle.Puissancemaxi || vehicle.power || 'N/A'
      case 'batteryCapacity':
        return vehicle.Capacitedebatterie || vehicle.batteryCapacity || 'N/A'
      case 'fastCharging':
        return vehicle.Tempsderechargerapide || vehicle.fastCharging || 'N/A'
      case 'consumption':
        return vehicle.Consommation || vehicle.consumption || 'N/A'
      case 'chargingType':
        return vehicle.Typederecharge || vehicle.chargingType || 'N/A'
      case 'seats':
        return vehicle.Nombredeplace || vehicle.seats || 'N/A'
      case 'trunkVolume':
        return vehicle.Volumedecoffre || vehicle.trunkVolume || 'N/A'
      case 'length':
        return vehicle.Longueur || vehicle.length || 'N/A'
      case 'width':
        return vehicle.Largeur || vehicle.width || 'N/A'
      case 'height':
        return vehicle.Hauteur || vehicle.height || 'N/A'
      case 'weight':
        return vehicle.Poids || vehicle.weight || 'N/A'
      case 'transmission':
        return vehicle.Transmissiond || vehicle.transmission || 'N/A'
      case 'warranty':
        return vehicle.Garantie || vehicle.warranty || 'N/A'
      default:
        return 'N/A'
    }
  }

  // Get feature display name
  const getFeatureName = (feature) => {
    const featureNames = {
      'name': 'Nom du véhicule',
      'brand': 'Marque',
      'category': 'Catégorie',
      'rating': 'Note',
      'price': 'Prix',
      'status': 'Statut',
      'autonomy': 'Autonomie officielle',
      'acceleration': 'Accélération 0-100 km/h',
      'topSpeed': 'Vitesse maximale',
      'power': 'Puissance maximale',
      'batteryCapacity': 'Capacité de batterie',
      'fastCharging': 'Temps de recharge rapide',
      'consumption': 'Consommation',
      'chargingType': 'Type de recharge',
      'seats': 'Nombre de places',
      'trunkVolume': 'Volume de coffre',
      'length': 'Longueur',
      'width': 'Largeur',
      'height': 'Hauteur',
      'weight': 'Poids',
      'transmission': 'Transmission',
      'warranty': 'Garantie'
    }
    
    return featureNames[feature] || feature
  }

  // Format price for display
  const formatPrice = (vehicle) => {
    if (vehicle.prix) {
      return formatMAD(parseInt(vehicle.prix))
    }
    return 'Prix sur demande'
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Erreur lors du chargement des véhicules : {error}
        </Alert>
      </Container>
    )
  }

  return (
    <div className="py-5">
      <Container>
        {/* Header */}
        <Row className="mb-5">
          <Col>
            <div className="text-center">
              <h1 className="display-4 mb-3">
                <i className="bi bi-car-front text-primary me-3"></i>
                Comparateur de Véhicules Électriques
              </h1>
              <p className="lead text-muted mb-4">
                Comparez jusqu'à 4 véhicules électriques côte à côte pour trouver le véhicule idéal
                {searchPagination.total > 0 && (
                  <span className="d-block small mt-1">
                    {searchPagination.total} véhicules disponibles pour comparaison
                  </span>
                )}
              </p>
              
              {/* Help Button */}
              <Button 
                variant="outline-info" 
                size="sm"
                onClick={() => setShowComparisonHelp(true)}
              >
                <i className="bi bi-question-circle me-2"></i>
                Comment utiliser le comparateur ?
              </Button>
            </div>
          </Col>
        </Row>

        {/* Selected Vehicles Summary */}
        {selectedVehicles.length > 0 && (
          <Row className="mb-4">
            <Col>
              <Card className="border-primary">
                <Card.Header className="bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-clipboard-check me-2"></i>
                      Véhicules sélectionnés ({selectedVehicles.length}/4)
                    </h5>
                    <Button 
                      variant="outline-light" 
                      size="sm"
                      onClick={clearComparison}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Effacer tout
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {selectedVehicles.map(vehicle => (
                      <Col md={3} key={vehicle.id} className="mb-3">
                        <div className="text-center">
                          <div className="position-relative mb-2">
                            <ImageWithFallback
                              src={vehicle.image || missingImage}
                              alt={vehicle.FullName || vehicle.Modele}
                              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                              className="border rounded"
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 rounded-circle"
                              style={{ width: '24px', height: '24px', padding: '0' }}
                              onClick={() => removeFromComparison(vehicle.id)}
                            >
                              <i className="bi bi-x" style={{ fontSize: '12px' }}></i>
                            </Button>
                          </div>
                          <small className="fw-bold">{vehicle.FullName || `${vehicle.Brand || vehicle.Marque} ${vehicle.Modele}`}</small>
                        </div>
                      </Col>
                    ))}
                    
                    {/* Add more vehicles button */}
                    {selectedVehicles.length < 4 && (
                      <Col md={3} className="mb-3">
                        <div className="text-center">
                          <Button
                            variant="outline-primary"
                            style={{ width: '80px', height: '80px' }}
                            className="border-2 border-dashed"
                            onClick={handleShowVehicleModal}
                          >
                            <i className="bi bi-plus-lg"></i>
                          </Button>
                          <br />
                          <small className="text-muted">Ajouter un véhicule</small>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Add Vehicles Section */}
        {selectedVehicles.length === 0 && (
          <Row className="mb-5">
            <Col>
              <Card className="text-center border-2 border-dashed border-primary">
                <Card.Body className="py-5">
                  <i className="bi bi-plus-circle text-primary" style={{ fontSize: '4rem' }}></i>
                  <h4 className="mt-3 mb-3">Commencez votre comparaison</h4>
                  <p className="text-muted mb-4">
                    Sélectionnez des véhicules électriques à comparer pour voir leurs différences côte à côte
                  </p>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={handleShowVehicleModal}
                  >
                    <i className="bi bi-search me-2"></i>
                    Choisir des véhicules
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Comparison Table */}
        {selectedVehicles.length > 1 && (
          <Row>
            <Col>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">
                    <i className="bi bi-table me-2"></i>
                    Tableau de comparaison
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table striped bordered hover className="mb-0">
                      <thead className="table-dark">
                        <tr>
                          <th style={{ width: '200px' }}>Caractéristiques</th>
                          {selectedVehicles.map(vehicle => (
                            <th key={vehicle.id} className="text-center" style={{ minWidth: '200px' }}>
                              <div className="mb-2">
                                <ImageWithFallback
                                  src={vehicle.image || missingImage}
                                  alt={vehicle.FullName || vehicle.Modele}
                                  style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                  className="border rounded"
                                />
                              </div>
                              <div className="fw-bold">{vehicle.FullName || `${vehicle.Brand || vehicle.Marque} ${vehicle.Modele}`}</div>
                              <Badge 
                                bg={vehicle.etat === 'Commercialisé' ? 'success' : 'warning'}
                                className="mt-1"
                              >
                                {vehicle.etat || vehicle.status || 'N/A'}
                              </Badge>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {getComparisonFeatures().map(feature => (
                          <tr key={feature}>
                            <td className="fw-bold bg-light">
                              {getFeatureName(feature)}
                            </td>
                            {selectedVehicles.map(vehicle => (
                              <td key={`${vehicle.id}-${feature}`} className="text-center">
                                {feature === 'rating' ? (
                                  <StarRating 
                                    rating={getFeatureValue(vehicle, feature)} 
                                    size="sm"
                                    showValue={true}
                                  />
                                ) : feature === 'price' ? (
                                  <span className="fw-bold text-primary">
                                    {getFeatureValue(vehicle, feature)}
                                  </span>
                                ) : feature === 'status' ? (
                                  <Badge 
                                    bg={vehicle.etat === 'Commercialisé' ? 'success' : 'warning'}
                                  >
                                    {getFeatureValue(vehicle, feature)}
                                  </Badge>
                                ) : (
                                  getFeatureValue(vehicle, feature)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                        
                        {/* Action buttons row */}
                        <tr className="table-secondary">
                          <td className="fw-bold">Actions</td>
                          {selectedVehicles.map(vehicle => (
                            <td key={`${vehicle.id}-actions`} className="text-center">
                              <div className="d-grid gap-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => navigate(`/vehicule-electrique/${vehicle.documentId || vehicle.id}`)}
                                >
                                  <i className="bi bi-eye me-1"></i>
                                  Voir détails
                                </Button>
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => navigate('/contact')}
                                >
                                  <i className="bi bi-envelope me-1"></i>
                                  Demander info
                                </Button>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  onClick={() => navigate('/contact')}
                                >
                                  <i className="bi bi-calendar-check me-1"></i>
                                  Essai
                                </Button>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Quick Add More Vehicles */}
        {selectedVehicles.length > 0 && selectedVehicles.length < 4 && (
          <Row className="mt-4">
            <Col>
              <Card className="bg-light">
                <Card.Body className="text-center">
                  <h6 className="mb-3">Ajouter plus de véhicules à comparer</h6>
                  <Button 
                    variant="outline-primary"
                    onClick={handleShowVehicleModal}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Ajouter un véhicule ({selectedVehicles.length}/4)
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Vehicle Selection Modal */}
        <Modal 
          show={showVehicleModal} 
          onHide={handleCloseVehicleModal}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-search me-2"></i>
              Sélectionner des véhicules à comparer
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Search and Filter */}
            <Row className="mb-4">
              <Col md={6}>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Rechercher par nom ou marque..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleSearchKeyDown}
                  />
                  <Button 
                    variant="outline-primary" 
                    className="ms-2"
                    onClick={handleSearchSubmit}
                    disabled={searchLoading}
                  >
                    <i className="bi bi-search"></i>
                  </Button>
                </div>
              </Col>
              <Col md={3}>
                <Form.Select
                  value={brandFilter}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                >
                  <option value="">Toutes les marques</option>
                  {getBrands().map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Button 
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchInput('')
                    setSearchTerm('')
                    setBrandFilter('')
                    setCurrentModalPage(1)
                  }}
                  disabled={searchLoading}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Effacer
                </Button>
              </Col>
            </Row>
            
            {/* Available Vehicles Grid */}
            {searchLoading ? (
              <div className="text-center py-4">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Chargement des véhicules...</span>
                </Spinner>
                <p className="mt-2 text-muted">Chargement des véhicules disponibles...</p>
              </div>
            ) : (
              <>
                {/* Results info */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <small className="text-muted">
                    {(() => {
                      const { vehicles, totalVehicles, totalPages } = getPaginatedVehicles()
                      if (totalVehicles === 0) return 'Aucun véhicule trouvé'
                      
                      const startIndex = (currentModalPage - 1) * VEHICLES_PER_MODAL_PAGE + 1
                      const endIndex = Math.min(currentModalPage * VEHICLES_PER_MODAL_PAGE, totalVehicles)
                      
                      return `${startIndex}-${endIndex} sur ${totalVehicles} véhicules`
                    })()}
                  </small>
                  <small className="text-muted">
                    Page {currentModalPage} de {getPaginatedVehicles().totalPages || 1}
                  </small>
                </div>
                
                <Row>
                  {getPaginatedVehicles().vehicles.map(vehicle => (
                <Col md={4} lg={3} key={vehicle.id} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm">
                    <div style={{ height: '150px', overflow: 'hidden' }}>
                      <ImageWithFallback
                        src={vehicle.image || missingImage}
                        alt={vehicle.FullName || vehicle.Modele}
                        className="card-img-top"
                        style={{ height: '150px', objectFit: 'contain', padding: '10px' }}
                      />
                    </div>
                    <Card.Body className="p-3">
                      <Card.Title className="h6 mb-2">{vehicle.FullName || `${vehicle.Brand || vehicle.Marque} ${vehicle.Modele}`}</Card.Title>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="secondary" className="small">{vehicle.Brand || vehicle.Marque}</Badge>
                        <Badge 
                          bg={vehicle.etat === 'Commercialisé' ? 'success' : 'warning'}
                          className="small"
                        >
                          {vehicle.etat || vehicle.status || 'N/A'}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <StarRating 
                          rating={vehicle.rating || (Math.random() > 0.3 ? 5 : 4)} 
                          size="sm"
                          showValue={false}
                        />
                      </div>
                      {vehicle.Autonomieofficielle && (
                        <div className="mb-2">
                          <small className="text-muted">
                            <i className="bi bi-battery-charging me-1"></i>
                            {vehicle.Autonomieofficielle}
                          </small>
                        </div>
                      )}
                      <div className="fw-bold text-primary mb-3">
                        {formatPrice(vehicle)}
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-100"
                        onClick={() => addToComparison(vehicle)}
                        disabled={selectedVehicles.length >= 4}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Comparer
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
                </Row>
                
                {/* Pagination */}
                {(() => {
                  const { totalPages } = getPaginatedVehicles()
                  if (totalPages <= 1) return null
                  
                  return (
                    <div className="d-flex justify-content-center mt-4">
                      <Pagination size="sm">
                        <Pagination.First 
                          onClick={() => handleModalPageChange(1)}
                          disabled={currentModalPage === 1}
                        />
                        <Pagination.Prev 
                          onClick={() => handleModalPageChange(currentModalPage - 1)}
                          disabled={currentModalPage === 1}
                        />
                        
                        {/* Page numbers - show max 5 pages in modal */}
                        {(() => {
                          const maxPagesToShow = 5
                          const pages = []
                          let startPage = Math.max(1, currentModalPage - Math.floor(maxPagesToShow / 2))
                          let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)
                          
                          // Adjust start if we're near the end
                          if (endPage - startPage + 1 < maxPagesToShow) {
                            startPage = Math.max(1, endPage - maxPagesToShow + 1)
                          }
                          
                          // Add page numbers
                          for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                              <Pagination.Item
                                key={i}
                                active={i === currentModalPage}
                                onClick={() => handleModalPageChange(i)}
                              >
                                {i}
                              </Pagination.Item>
                            )
                          }
                          
                          return pages
                        })()}
                        
                        <Pagination.Next 
                          onClick={() => handleModalPageChange(currentModalPage + 1)}
                          disabled={currentModalPage === totalPages}
                        />
                        <Pagination.Last 
                          onClick={() => handleModalPageChange(totalPages)}
                          disabled={currentModalPage === totalPages}
                        />
                      </Pagination>
                    </div>
                  )
                })()}
              </>
            )}
            
            {!searchLoading && getPaginatedVehicles().totalVehicles === 0 && (
              <div className="text-center py-4">
                <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3 text-muted">Aucun véhicule trouvé</h5>
                <p className="text-muted">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseVehicleModal}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Help Modal */}
        <Modal 
          show={showComparisonHelp} 
          onHide={() => setShowComparisonHelp(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-question-circle me-2"></i>
              Guide d'utilisation du comparateur de véhicules
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <h6><i className="bi bi-1-circle text-primary me-2"></i>Sélection des véhicules</h6>
                <p className="small text-muted mb-3">
                  Cliquez sur "Choisir des véhicules" pour ouvrir le catalogue. 
                  Vous pouvez sélectionner jusqu'à 4 véhicules électriques à comparer.
                </p>
                
                <h6><i className="bi bi-2-circle text-primary me-2"></i>Recherche et filtrage</h6>
                <p className="small text-muted mb-3">
                  Utilisez la barre de recherche et les filtres par marque et catégorie 
                  pour trouver rapidement les véhicules qui vous intéressent.
                </p>
              </div>
              <div className="col-md-6">
                <h6><i className="bi bi-3-circle text-primary me-2"></i>Comparaison détaillée</h6>
                <p className="small text-muted mb-3">
                  Le tableau de comparaison affiche toutes les caractéristiques 
                  techniques côte à côte : autonomie, accélération, puissance, etc.
                </p>
                
                <h6><i className="bi bi-4-circle text-primary me-2"></i>Actions directes</h6>
                <p className="small text-muted mb-3">
                  Depuis la comparaison, vous pouvez voir les détails complets, 
                  demander des informations ou planifier un essai.
                </p>
              </div>
            </div>
            
            <Alert variant="info" className="mt-3">
              <i className="bi bi-lightbulb me-2"></i>
              <strong>Conseil :</strong> Pour une comparaison optimale, 
              sélectionnez des véhicules de la même catégorie (citadine, berline, SUV, etc.).
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => setShowComparisonHelp(false)}>
              Compris !
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  )
}

export default ComparateurVehicules
