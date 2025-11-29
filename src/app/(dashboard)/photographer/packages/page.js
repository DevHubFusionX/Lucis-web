'use client'
import { useState, useEffect } from 'react'
import { PackageService } from '../../../../services'

export default function PackagesPage() {
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    type: 'basic', 
    description: '', 
    duration: '',
    addOns: []
  })
  const [addOns, setAddOns] = useState([{ name: '', price: '' }])
  const [editingPackage, setEditingPackage] = useState(null)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await PackageService.getPackages()
        setPackages(data)
      } catch (error) {
        console.error('Failed to fetch packages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  const handleSave = async () => {
    if (formData.name && formData.price) {
      setSaving(true)
      try {
        const packageData = {
          name: formData.name,
          description: formData.description,
          price: parseInt(formData.price),
          duration: parseInt(formData.duration) || 60,
          type: formData.type,
          addOns: addOns.filter(addon => addon.name && addon.price).map(addon => ({
            name: addon.name,
            price: parseInt(addon.price)
          }))
        }
        
        const newPackage = await PackageService.addPackage(packageData)
        setPackages([...packages, newPackage])
        setFormData({ name: '', price: '', type: 'basic', description: '', duration: '', addOns: [] })
        setAddOns([{ name: '', price: '' }])
        setShowModal(false)
      } catch (error) {
        console.error('Failed to add package:', error)
        alert('Failed to add package. Please try again.')
      } finally {
        setSaving(false)
      }
    }
  }

  const addAddOn = () => {
    setAddOns([...addOns, { name: '', price: '' }])
  }

  const removeAddOn = (index) => {
    setAddOns(addOns.filter((_, i) => i !== index))
  }

  const updateAddOn = (index, field, value) => {
    const updated = addOns.map((addon, i) => 
      i === index ? { ...addon, [field]: value } : addon
    )
    setAddOns(updated)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this package?')) {
      setDeleting(id)
      try {
        await PackageService.deletePackage(id)
        setPackages(packages.filter(p => p.id !== id))
      } catch (error) {
        console.error('Failed to delete package:', error)
        alert('Failed to delete package. Please try again.')
      } finally {
        setDeleting(null)
      }
    }
  }

  const handleEdit = (pkg) => {
    setEditingPackage(pkg)
    setFormData({
      name: pkg.name,
      price: pkg.price.toString(),
      type: pkg.type,
      description: pkg.description,
      duration: pkg.duration?.toString() || '60'
    })
    setAddOns(pkg.addOns && pkg.addOns.length > 0 ? pkg.addOns : [{ name: '', price: '' }])
    setShowModal(true)
  }

  const handleUpdate = async () => {
    if (formData.name && formData.price && editingPackage) {
      setSaving(true)
      try {
        const packageData = {
          name: formData.name,
          description: formData.description,
          price: parseInt(formData.price),
          duration: parseInt(formData.duration) || 60,
          type: formData.type,
          addOns: addOns.filter(addon => addon.name && addon.price).map(addon => ({
            name: addon.name,
            price: parseInt(addon.price)
          }))
        }
        
        await PackageService.updatePackage(editingPackage.id, packageData)
        const updatedPackages = packages.map(p => 
          p.id === editingPackage.id ? { ...p, ...packageData } : p
        )
        setPackages(updatedPackages)
        setFormData({ name: '', price: '', type: 'basic', description: '', duration: '' })
        setAddOns([{ name: '', price: '' }])
        setEditingPackage(null)
        setShowModal(false)
      } catch (error) {
        console.error('Failed to update package:', error)
        alert('Failed to update package. Please try again.')
      } finally {
        setSaving(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({ name: '', price: '', type: 'basic', description: '', duration: '' })
    setAddOns([{ name: '', price: '' }])
    setEditingPackage(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{color: '#111827'}}>Packages</h1>
          <p className="mt-1" style={{color: '#6B7280'}}>Create and manage your service packages</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="text-white px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
          style={{backgroundColor: '#1E3A8A'}}
        >
          + Create New Package
        </button>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#DBEAFE'}}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{color: '#111827'}}>No packages yet</h3>
          <p className="mb-6" style={{color: '#6B7280'}}>Create your first package to get started</p>
          <button 
            onClick={() => setShowModal(true)}
            className="text-white px-6 py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all"
            style={{backgroundColor: '#1E3A8A'}}
          >
            + Create Package
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="p-6 rounded-2xl shadow-sm hover:shadow-md transition-all" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3" style={{backgroundColor: '#DBEAFE', color: '#1E3A8A'}}>
                    {pkg.type}
                  </span>
                  <h3 className="text-xl font-bold" style={{color: '#111827'}}>{pkg.name}</h3>
                </div>
                <div className="flex space-x-1">
                  <button onClick={() => handleEdit(pkg)} className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{backgroundColor: '#F3F4F6', color: '#6B7280'}}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(pkg.id)} 
                    disabled={deleting === pkg.id}
                    className="p-2 rounded-lg hover:opacity-80 transition-opacity disabled:opacity-50" 
                    style={{backgroundColor: '#FEE2E2', color: '#DC2626'}}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              <p className="text-sm mb-6 leading-relaxed" style={{color: '#6B7280'}}>{pkg.description}</p>

              <div className="mb-6 pb-6" style={{borderBottom: '1px solid #E5E7EB'}}>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold" style={{color: '#1E3A8A'}}>${pkg.price}</span>
                  <span className="text-sm ml-2" style={{color: '#9CA3AF'}}>per session</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color: '#6B7280'}}>What's Included</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#10B981'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{color: '#374151'}}>{pkg.duration} minutes</span>
                  </div>
                  {pkg.addOns && pkg.addOns.map((addon, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#10B981'}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-sm" style={{color: '#374151'}}>{addon.name}</span>
                      </div>
                      <span className="text-sm font-medium" style={{color: '#1E3A8A'}}>+${addon.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{color: '#111827'}}>
                {editingPackage ? 'Edit Package' : 'Create Package'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="hover:opacity-70 transition-opacity" style={{color: '#9CA3AF'}}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Package Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{borderColor: '#E5E7EB', color: '#111827'}}
                  placeholder="e.g., Wedding Photography"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{borderColor: '#E5E7EB', color: '#111827'}}
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{borderColor: '#E5E7EB', color: '#111827'}}
                    placeholder="450"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{borderColor: '#E5E7EB', color: '#111827'}}
                    placeholder="480"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{borderColor: '#E5E7EB', color: '#111827'}}
                  rows="3"
                  placeholder="Describe your package"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold" style={{color: '#374151'}}>Add-Ons</label>
                  <button
                    type="button"
                    onClick={addAddOn}
                    className="text-sm px-3 py-1 rounded-lg hover:opacity-80 transition-opacity"
                    style={{backgroundColor: '#DBEAFE', color: '#1E3A8A'}}
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-3">
                  {addOns.map((addon, index) => (
                    <div key={index} className="flex gap-3">
                      <input
                        type="text"
                        value={addon.name}
                        onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={{borderColor: '#E5E7EB', color: '#111827'}}
                        placeholder="Add-on name"
                      />
                      <input
                        type="number"
                        value={addon.price}
                        onChange={(e) => updateAddOn(index, 'price', e.target.value)}
                        className="w-24 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                        style={{borderColor: '#E5E7EB', color: '#111827'}}
                        placeholder="$"
                      />
                      {addOns.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAddOn(index)}
                          className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                          style={{backgroundColor: '#FEE2E2', color: '#DC2626'}}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 px-4 py-3 rounded-xl border font-medium hover:bg-gray-50 transition-colors"
                  style={{borderColor: '#E5E7EB', color: '#374151'}}
                >
                  Cancel
                </button>
                <button
                  onClick={editingPackage ? handleUpdate : handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-3 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                  style={{backgroundColor: '#1E3A8A'}}
                >
                  {saving ? (editingPackage ? 'Updating...' : 'Saving...') : (editingPackage ? 'Update Package' : 'Save Package')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}