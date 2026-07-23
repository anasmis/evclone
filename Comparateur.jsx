import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Form, Badge, Alert, Table, Modal } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../store/slices/cartSlice'
import { addToWishlist } from '../store/slices/wishlistSlice'
import { getProducts } from '../services/productsAPI'
import LoadingSpinner from '../components/Common/LoadingSpinner'
import StarRating from '../components/UI/StarRating'
import ImageWithFallback from '../components/UI/ImageWithFallback'
import { formatMAD } from '../utils/helpers'
import { toast } from 'react-toastify'

const Comparateur = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector(state => state.auth)
  
  // State management
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showProductModal, setShowProductModal] = useState(false)
  const [availableProducts, setAvailableProducts] = useState([])
  const [showComparisonHelp, setShowComparisonHelp] = useState(false)

  // Fetch all products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const result = await getProducts({ limit: 1000 })
        setAvailableProducts(result.data.products || [])
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des produits')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])

  // Filter available products for selection
  const getFilteredProducts = () => {
    return availableProducts.filter(product => {
      const matchesSearch = searchTerm === '' || 
                           (product.name || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (product.brand || '')?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === '' || 
                             (product.category || '').toLowerCase() === categoryFilter.toLowerCase()
      
      // Don't show already selected products
      const notSelected = !selectedProducts.some(selected => selected.id === product.id)
      
      return matchesSearch && matchesCategory && notSelected
    })
  }

  // Add product to comparison
  const addToComparison = (product) => {
    if (selectedProducts.length >= 4) {
      toast.warning('Vous ne pouvez comparer que 4 produits maximum')
      return
    }
    
    if (!selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product])
      toast.success(`${product.name} ajouté à la comparaison`)
    }
  }

  // Remove product from comparison
  const removeFromComparison = (productId) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId))
    toast.info('Produit retiré de la comparaison')
  }

  // Clear all comparisons
  const clearComparison = () => {
    setSelectedProducts([])
    toast.info('Comparaison effacée')
  }

  // Get unique categories for filter
  const getCategories = () => {
    const categories = [...new Set(availableProducts.map(p => p.category).filter(Boolean))]
    return categories
  }

  // Get comparison features
  const getComparisonFeatures = () => {
    if (selectedProducts.length === 0) return []
    
    const features = new Set()
    
    selectedProducts.forEach(product => {
      // Basic features
      features.add('name')
      features.add('price')
      features.add('brand')
      features.add('category')
      features.add('rating')
      features.add('description')
      
      // Specifications
      if (product.specifications) {
        Object.keys(product.specifications).forEach(spec => {
          features.add(`specifications.${spec}`)
        })
      }
      
      // Other product properties
      if (product.power) features.add('power')
      if (product.voltage) features.add('voltage')
      if (product.current) features.add('current')
      if (product.dimensions) features.add('dimensions')
      if (product.weight) features.add('weight')
      if (product.warranty) features.add('warranty')
      if (product.connectivity) features.add('connectivity')
      if (product.features) features.add('features')
    })
    
    return Array.from(features)
  }

  // Get feature value for a product
  const getFeatureValue = (product, feature) => {
    if (feature.includes('.')) {
      const [parent, child] = feature.split('.')
      return product[parent]?.[child] || 'N/A'
    }
    
    switch (feature) {
      case 'name':
        return product.name || 'N/A'
      case 'price':
        return product.price ? formatMAD(product.price) : 'Prix sur demande'
      case 'brand':
        return product.brand || 'N/A'
      case 'category':
        return product.category || 'N/A'
      case 'rating':
        return product.rating || (Math.random() > 0.3 ? 5 : 4)
      case 'description':
        return product.description ? 
          (product.description.length > 100 ? 
            `${product.description.substring(0, 100)}...` : 
            product.description
          ) : 'N/A'
      case 'features':
        return product.features ? product.features.slice(0, 3).join(', ') : 'N/A'
      default:
        return product[feature] || 'N/A'
    }
  }

  // Get feature display name
  const getFeatureName = (feature) => {
    const featureNames = {
      'name': 'Nom du produit',
      'price': 'Prix',
      'brand': 'Marque',
      'category': 'Catégorie',
      'rating': 'Note',
      'description': 'Description',
      'power': 'Puissance',
      'voltage': 'Tension',
      'current': 'Courant',
      'dimensions': 'Dimensions',
      'weight': 'Poids',
      'warranty': 'Garantie',
      'connectivity': 'Connectivité',
      'features': 'Fonctionnalités principales',
      'specifications.power': 'Puissance de charge',
      'specifications.protection': 'Indice de protection',
      'specifications.connectivity': 'Connectivité',
      'specifications.cable': 'Câble',
      'specifications.dimensions': 'Dimensions du boîtier',
      'specifications.weight': 'Poids',
      'specifications.temperature': 'Température supportée',
      'specifications.display': 'Écran/Display',
      'specifications.nfc': 'Lecteur NFC',
      'specifications.smartCharging': 'Smart charging',
      'specifications.warranty': 'Garantie fournisseur',
      'specifications.origin': 'Origine fournisseur'
    }
    
    return featureNames[feature] || feature.replace('specifications.', '').replace(/([A-Z])/g, ' $1').toLowerCase()
  }

  // Handle add to cart from comparison
  const handleAddToCart = (product) => {
    dispatch(addToCart({
      id: product.documentId || product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    }))
    toast.success(`${product.name} ajouté au panier !`)
  }

  // Handle add to wishlist from comparison
  const handleAddToWishlist = (product) => {
    if (!isAuthenticated) {
      navigate('/connexion')
      return
    }
    
    dispatch(addToWishlist({
      id: product.documentId || product.id,
      name: product.name,
      price: product.price,
      image: product.image
    }))
    toast.success(`${product.name} ajouté aux favoris !`)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          Erreur lors du chargement des produits : {error}
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
                <i className="bi bi-arrow-left-right text-primary me-3"></i>
                Comparateur de Produits
              </h1>
              <p className="lead text-muted mb-4">
                Comparez jusqu'à 4 produits côte à côte pour faire le meilleur choix
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

        {/* Selected Products Summary */}
        {selectedProducts.length > 0 && (
          <Row className="mb-4">
            <Col>
              <Card className="border-primary">
                <Card.Header className="bg-primary text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-clipboard-check me-2"></i>
                      Produits sélectionnés ({selectedProducts.length}/4)
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
                    {selectedProducts.map(product => (
                      <Col md={3} key={product.id} className="mb-3">
                        <div className="text-center">
                          <div className="position-relative mb-2">
                            <ImageWithFallback
                              src={product.image}
                              alt={product.name}
                              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                              className="border rounded"
                            />
                            <Button
                              variant="danger"
                              size="sm"
                              className="position-absolute top-0 end-0 rounded-circle"
                              style={{ width: '24px', height: '24px', padding: '0' }}
                              onClick={() => removeFromComparison(product.id)}
                            >
                              <i className="bi bi-x" style={{ fontSize: '12px' }}></i>
                            </Button>
                          </div>
                          <small className="fw-bold">{product.name}</small>
                        </div>
                      </Col>
                    ))}
                    
                    {/* Add more products button */}
                    {selectedProducts.length < 4 && (
                      <Col md={3} className="mb-3">
                        <div className="text-center">
                          <Button
                            variant="outline-primary"
                            style={{ width: '80px', height: '80px' }}
                            className="border-2 border-dashed"
                            onClick={() => setShowProductModal(true)}
                          >
                            <i className="bi bi-plus-lg"></i>
                          </Button>
                          <br />
                          <small className="text-muted">Ajouter un produit</small>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Add Products Section */}
        {selectedProducts.length === 0 && (
          <Row className="mb-5">
            <Col>
              <Card className="text-center border-2 border-dashed border-primary">
                <Card.Body className="py-5">
                  <i className="bi bi-plus-circle text-primary" style={{ fontSize: '4rem' }}></i>
                  <h4 className="mt-3 mb-3">Commencez votre comparaison</h4>
                  <p className="text-muted mb-4">
                    Sélectionnez des produits à comparer pour voir leurs différences côte à côte
                  </p>
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => setShowProductModal(true)}
                  >
                    <i className="bi bi-search me-2"></i>
                    Choisir des produits
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Comparison Table */}
        {selectedProducts.length > 1 && (
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
                          {selectedProducts.map(product => (
                            <th key={product.id} className="text-center" style={{ minWidth: '200px' }}>
                              <div className="mb-2">
                                <ImageWithFallback
                                  src={product.image}
                                  alt={product.name}
                                  style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                  className="border rounded"
                                />
                              </div>
                              <div className="fw-bold">{product.name}</div>
                              <Badge 
                                bg={product.category === 'residential' ? 'primary' : 'secondary'}
                                className="mt-1"
                              >
                                {product.category}
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
                            {selectedProducts.map(product => (
                              <td key={`${product.id}-${feature}`} className="text-center">
                                {feature === 'rating' ? (
                                  <StarRating 
                                    rating={getFeatureValue(product, feature)} 
                                    size="sm"
                                    showValue={true}
                                  />
                                ) : feature === 'price' ? (
                                  <span className="fw-bold text-primary">
                                    {getFeatureValue(product, feature)}
                                  </span>
                                ) : (
                                  getFeatureValue(product, feature)
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                        
                        {/* Action buttons row */}
                        <tr className="table-secondary">
                          <td className="fw-bold">Actions</td>
                          {selectedProducts.map(product => (
                            <td key={`${product.id}-actions`} className="text-center">
                              <div className="d-grid gap-2">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleAddToCart(product)}
                                >
                                  <i className="bi bi-cart-plus me-1"></i>
                                  Panier
                                </Button>
                                <Button
                                  variant="outline-secondary"
                                  size="sm"
                                  onClick={() => handleAddToWishlist(product)}
                                >
                                  <i className="bi bi-heart me-1"></i>
                                  Favoris
                                </Button>
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => navigate(`/produit/${product.documentId || product.id}`)}
                                >
                                  <i className="bi bi-eye me-1"></i>
                                  Détails
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

        {/* Quick Add More Products */}
        {selectedProducts.length > 0 && selectedProducts.length < 4 && (
          <Row className="mt-4">
            <Col>
              <Card className="bg-light">
                <Card.Body className="text-center">
                  <h6 className="mb-3">Ajouter plus de produits à comparer</h6>
                  <Button 
                    variant="outline-primary"
                    onClick={() => setShowProductModal(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Ajouter un produit ({selectedProducts.length}/4)
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Product Selection Modal */}
        <Modal 
          show={showProductModal} 
          onHide={() => setShowProductModal(false)}
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-search me-2"></i>
              Sélectionner des produits à comparer
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Search and Filter */}
            <Row className="mb-4">
              <Col md={8}>
                <Form.Control
                  type="text"
                  placeholder="Rechercher par nom ou marque..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col md={4}>
                <Form.Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  {getCategories().map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            
            {/* Available Products Grid */}
            <Row>
              {getFilteredProducts().slice(0, 12).map(product => (
                <Col md={4} lg={3} key={product.id} className="mb-3">
                  <Card className="h-100 border-0 shadow-sm">
                    <div style={{ height: '150px', overflow: 'hidden' }}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="card-img-top"
                        style={{ height: '150px', objectFit: 'contain', padding: '10px' }}
                      />
                    </div>
                    <Card.Body className="p-3">
                      <Card.Title className="h6 mb-2">{product.name}</Card.Title>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <Badge bg="secondary" className="small">{product.brand}</Badge>
                        <Badge 
                          bg={product.category === 'residential' ? 'primary' : 'secondary'}
                          className="small"
                        >
                          {product.category}
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <StarRating 
                          rating={product.rating || (Math.random() > 0.3 ? 5 : 4)} 
                          size="sm"
                          showValue={false}
                        />
                      </div>
                      <div className="fw-bold text-primary mb-3">
                        {product.price ? formatMAD(product.price) : 'Prix sur demande'}
                      </div>
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-100"
                        onClick={() => addToComparison(product)}
                        disabled={selectedProducts.length >= 4}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Comparer
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            
            {getFilteredProducts().length === 0 && (
              <div className="text-center py-4">
                <i className="bi bi-search text-muted" style={{ fontSize: '3rem' }}></i>
                <h5 className="mt-3 text-muted">Aucun produit trouvé</h5>
                <p className="text-muted">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProductModal(false)}>
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
              Guide d'utilisation du comparateur
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <h6><i className="bi bi-1-circle text-primary me-2"></i>Sélection des produits</h6>
                <p className="small text-muted mb-3">
                  Cliquez sur "Choisir des produits" pour ouvrir le catalogue. 
                  Vous pouvez sélectionner jusqu'à 4 produits à comparer.
                </p>
                
                <h6><i className="bi bi-2-circle text-primary me-2"></i>Recherche et filtrage</h6>
                <p className="small text-muted mb-3">
                  Utilisez la barre de recherche et les filtres par catégorie 
                  pour trouver rapidement les produits qui vous intéressent.
                </p>
              </div>
              <div className="col-md-6">
                <h6><i className="bi bi-3-circle text-primary me-2"></i>Comparaison détaillée</h6>
                <p className="small text-muted mb-3">
                  Le tableau de comparaison affiche toutes les caractéristiques 
                  techniques côte à côte pour faciliter votre choix.
                </p>
                
                <h6><i className="bi bi-4-circle text-primary me-2"></i>Actions directes</h6>
                <p className="small text-muted mb-3">
                  Depuis la comparaison, vous pouvez directement ajouter au panier, 
                  aux favoris ou voir les détails complets.
                </p>
              </div>
            </div>
            
            <Alert variant="info" className="mt-3">
              <i className="bi bi-lightbulb me-2"></i>
              <strong>Conseil :</strong> Pour une comparaison optimale, 
              sélectionnez des produits de la même catégorie ou avec des usages similaires.
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

export default Comparateur
