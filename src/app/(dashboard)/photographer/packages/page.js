'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { theme } from '../../../../lib/theme'
import { PackageService } from '../../../../services'
import Notification from '../../../../components/ui/Notification'
import { 
  Package as PackageIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  Clock, 
  X,
  Sparkles,
  Info,
  Loader2
} from 'lucide-react'

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
    duration: '60'
  })
  const [addOns, setAddOns] = useState([])
  const [editingPackage, setEditingPackage] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [notifications, setNotifications] = useState([])

  const addNotification = (type, title, message) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, type, title, message }])
    setTimeout(() => removeNotification(id), 5000)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await PackageService.getPackages()
        setPackages(data)
      } catch (error) {
        console.error('Failed to fetch packages:', error)
        addNotification('error', 'Error', 'Failed to load packages. Please try again.')
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
          duration: parseInt(formData.duration),
          type: formData.type,
          addOns: addOns.filter(addon => addon.name && addon.price).map(addon => ({
            name: addon.name,
            price: parseInt(addon.price)
          }))
        }
        
        const newPackage = await PackageService.addPackage(packageData)
        setPackages([...packages, newPackage])
        addNotification('success', 'Package Created', `${formData.name} has been created successfully.`)
        resetForm()
        setShowModal(false)
      } catch (error) {
        console.error('Failed to add package:', error)
        addNotification('error', 'Creation Failed', 'Failed to create package. Please try again.')
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
    const pkg = packages.find(p => p.id === id)
    if (confirm('Are you sure you want to delete this package?')) {
      setDeleting(id)
      try {
        await PackageService.deletePackage(id)
        setPackages(packages.filter(p => p.id !== id))
        addNotification('info', 'Package Deleted', `${pkg?.name || 'Package'} has been deleted.`)
      } catch (error) {
        console.error('Failed to delete package:', error)
        addNotification('error', 'Deletion Failed', 'Failed to delete package. Please try again.')
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
    setAddOns(pkg.addOns || [])
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
          duration: parseInt(formData.duration),
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
        addNotification('success', 'Package Updated', `${formData.name} has been updated successfully.`)
        resetForm()
        setShowModal(false)
      } catch (error) {
        console.error('Failed to update package:', error)
        addNotification('error', 'Update Failed', 'Failed to update package. Please try again.')
      } finally {
        setSaving(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({ name: '', price: '', type: 'basic', description: '', duration: '60' })
    setAddOns([])
    setEditingPackage(null)
  }

  const getTypeColor = (type) => {
    switch(type) {
      case 'premium': return { bg: '#FEF3C7', text: '#F59E0B' }
      case 'custom': return { bg: '#E0E7FF', text: '#6366F1' }
      default: return { bg: theme.colors.accent[50], text: theme.colors.accent[600] }
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div 
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: theme.colors.accent[500], borderTopColor: 'transparent' }}
        />
        <p className="text-gray-500 font-medium animate-pulse">Loading packages...</p>
      </div>
    )
  }

  return (
    <>
      <Notification notifications={notifications} onClose={removeNotification} />
      <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 
            className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            Packages
          </h1>
          <p className="text-gray-600 text-lg">
            Create and manage your service packages
          </p>
        </div>
        <motion.button 
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 sm:mt-0 px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg flex items-center gap-2"
          style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
        >
          <Plus className="w-5 h-5" />
          Create Package
        </motion.button>
      </motion.div>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50"
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: theme.colors.accent[50] }}
          >
            <PackageIcon className="w-10 h-10" style={{ color: theme.colors.accent[500] }} />
          </div>
          <h3 
            className="text-2xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            No packages yet
          </h3>
          <p className="text-gray-600 mb-6">Create your first package to get started</p>
          <motion.button 
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg flex items-center gap-2"
            style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
          >
            <Plus className="w-5 h-5" />
            Create Package
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, index) => {
            const typeColor = getTypeColor(pkg.type)
            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-all relative overflow-hidden"
              >
                {deleting === pkg.id && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: theme.colors.accent[500] }} />
                  </div>
                )}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <span 
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                      style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
                    >
                      {pkg.type}
                    </span>
                    <div className="flex gap-2">
                      <motion.button 
                        onClick={() => handleEdit(pkg)} 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </motion.button>
                      <motion.button 
                        onClick={() => handleDelete(pkg.id)} 
                        disabled={deleting === pkg.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting === pkg.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </div>

                  <h3 
                    className="text-2xl font-bold text-gray-900 mb-3"
                    style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                  >
                    {pkg.name}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {pkg.description}
                  </p>

                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold" style={{ color: theme.colors.accent[600] }}>₦</span>
                      <span 
                        className="text-4xl font-bold"
                        style={{ 
                          color: theme.colors.accent[600],
                          fontFamily: theme.typography.fontFamily.display.join(', ')
                        }}
                      >
                        {pkg.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                      What's Included
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: theme.colors.accent[50] }}
                        >
                          <Clock className="w-3 h-3" style={{ color: theme.colors.accent[600] }} />
                        </div>
                        <span className="text-sm text-gray-700">{pkg.duration} minutes</span>
                      </div>
                      {pkg.addOns && pkg.addOns.map((addon, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-5 h-5 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: theme.colors.accent[50] }}
                            >
                              <Check className="w-3 h-3" style={{ color: theme.colors.accent[600] }} />
                            </div>
                            <span className="text-sm text-gray-700">{addon.name}</span>
                          </div>
                          <span 
                            className="text-sm font-semibold"
                            style={{ color: theme.colors.accent[600] }}
                          >
                            +₦{addon.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => { setShowModal(false); resetForm(); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 
                      className="text-3xl font-bold text-gray-900"
                      style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                    >
                      {editingPackage ? 'Edit Package' : 'Create New Package'}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Fill in the details below</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowModal(false); resetForm(); }} 
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                {/* Package Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                    Package Name
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:outline-none transition-colors text-gray-900 text-lg"
                    placeholder="e.g., Wedding Photography Package"
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Give your package a clear, descriptive name
                  </p>
                </div>

                {/* Package Type */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                    Package Type
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['basic', 'premium', 'custom'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, type})}
                        className="px-4 py-3 rounded-xl border-2 font-semibold capitalize transition-all"
                        style={{
                          borderColor: formData.type === type ? theme.colors.accent[500] : '#E5E7EB',
                          backgroundColor: formData.type === type ? theme.colors.accent[50] : 'white',
                          color: formData.type === type ? theme.colors.accent[700] : '#6B7280'
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      Price (Naira)
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-bold">₦</span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:outline-none transition-colors text-gray-900 text-lg"
                        placeholder="50000"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:outline-none transition-colors text-gray-900 text-lg"
                      placeholder="60"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:outline-none transition-colors text-gray-900"
                    rows="4"
                    placeholder="Describe what's included in this package, what makes it special, and who it's perfect for..."
                  />
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Help clients understand the value of your package
                  </p>
                </div>

                {/* Add-Ons */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-gray-900">
                      Extra Services (Optional)
                    </label>
                    <motion.button
                      type="button"
                      onClick={addAddOn}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1"
                      style={{ backgroundColor: theme.colors.accent[50], color: theme.colors.accent[600] }}
                    >
                      <Plus className="w-4 h-4" />
                      Add Service
                    </motion.button>
                  </div>
                  
                  {addOns.length > 0 && (
                    <div className="space-y-3 mb-3">
                      {addOns.map((addon, index) => (
                        <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-xl">
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={addon.name}
                              onChange={(e) => updateAddOn(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-accent-500 focus:outline-none text-gray-900"
                              placeholder="Service name (e.g., Extra hour of shooting)"
                            />
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₦</span>
                              <input
                                type="number"
                                value={addon.price}
                                onChange={(e) => updateAddOn(index, 'price', e.target.value)}
                                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 focus:border-accent-500 focus:outline-none text-gray-900"
                                placeholder="Additional price"
                              />
                            </div>
                          </div>
                          <motion.button
                            type="button"
                            onClick={() => removeAddOn(index)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-1"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Add optional services clients can purchase with this package
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <motion.button
                    onClick={() => { setShowModal(false); resetForm(); }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={editingPackage ? handleUpdate : handleSave}
                    disabled={saving || !formData.name || !formData.price}
                    whileHover={{ scale: saving ? 1 : 1.02 }}
                    whileTap={{ scale: saving ? 1 : 0.98 }}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
                  >
                    {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                    {saving ? (editingPackage ? 'Updating...' : 'Creating...') : (editingPackage ? 'Update Package' : 'Create Package')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  )
}
