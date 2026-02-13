
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Trash2, Clock, DollarSign, X, Star, AlertTriangle, Edit2, Image as ImageIcon } from 'lucide-react';
import { Service } from '../../types';

const AdminServices: React.FC = () => {
  const { services, addService, updateService, removeService, bookings } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    name: '',
    price: 0,
    duration: 30,
    description: '',
    image: 'https://images.unsplash.com/photo-1621605815841-aa33c563721e?w=400&h=400&fit=crop',
  });

  const handleOpenCreateModal = () => {
    setEditingServiceId(null);
    setFormData({
      name: '',
      price: 0,
      duration: 30,
      description: '',
      image: 'https://images.unsplash.com/photo-1621605815841-aa33c563721e?w=400&h=400&fit=crop',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: Service) => {
    setEditingServiceId(service.id);
    setFormData({
      name: service.name,
      price: service.price,
      duration: service.duration,
      description: service.description || '',
      image: service.image || 'https://images.unsplash.com/photo-1621605815841-aa33c563721e?w=400&h=400&fit=crop',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingServiceId) {
      updateService(editingServiceId, formData);
    } else {
      addService(formData);
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (serviceToDelete) {
      removeService(serviceToDelete.id);
      setServiceToDelete(null);
    }
  };

  const getServiceRating = (serviceId: string) => {
    const serviceReviews = bookings.filter(b => b.serviceId === serviceId && b.rating);
    if (serviceReviews.length === 0) return null;
    const avg = serviceReviews.reduce((sum, b) => sum + b.rating!.stars, 0) / serviceReviews.length;
    return { avg: avg.toFixed(1), count: serviceReviews.length };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Serviços</h1>
          <p className="text-slate-400">Gerencie o catálogo de serviços oferecidos</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-amber-500 text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all flex items-center space-x-2 shadow-lg shadow-amber-500/10 active:scale-95"
        >
          <Plus size={20} />
          <span>Novo Serviço</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const rating = getServiceRating(service.id);
          return (
            <div key={service.id} className="glass rounded-3xl border border-slate-700 overflow-hidden flex flex-col group">
              <div className="h-40 overflow-hidden relative">
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button 
                    onClick={() => handleOpenEditModal(service)}
                    className="p-2 bg-slate-800/80 text-white hover:bg-amber-500 hover:text-slate-900 rounded-xl backdrop-blur-md transition-all border border-white/10"
                    title="Editar Serviço"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => setServiceToDelete(service)}
                    className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl backdrop-blur-md transition-all border border-red-500/30"
                    title="Remover Serviço"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {rating && (
                  <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 flex items-center space-x-1 text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold">{rating.avg}</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">{service.name}</h3>
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{service.description}</p>
                  
                  <div className="flex items-center space-x-2 py-2">
                    {rating ? (
                      <>
                        <div className="flex text-amber-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              size={14} 
                              fill={s <= Math.round(Number(rating.avg)) ? "currentColor" : "none"} 
                              className={s <= Math.round(Number(rating.avg)) ? "" : "text-slate-600"}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-white">{rating.avg}</span>
                        <span className="text-xs text-slate-500">({rating.count} {rating.count === 1 ? 'avaliação' : 'avaliações'})</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Sem avaliações ainda</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-700/50">
                  <div className="flex items-center text-amber-500 font-bold text-lg">
                    <span className="text-sm mr-0.5">R$</span>
                    <span>{service.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-slate-400 text-sm font-medium bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
                    <Clock size={14} className="mr-1.5 text-blue-400" />
                    <span>{service.duration} min</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <form onSubmit={handleSubmit} className="relative glass p-8 rounded-[2.5rem] w-full max-w-lg border border-slate-700 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-white">{editingServiceId ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Preview da Imagem */}
              <div className="w-full h-40 bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden relative group">
                 <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-full object-cover transition-all"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2070";
                    }}
                 />
                 <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImageIcon className="text-white" size={32} />
                 </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Nome do Serviço</label>
                <input
                  required
                  type="text"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Preço (R$)</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-white"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Duração (min)</label>
                  <input
                    required
                    type="number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-white"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Descrição</label>
                <textarea
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-white h-24 resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">URL da Imagem</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-white"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-bold text-lg hover:bg-amber-400 transition-all shadow-lg active:scale-95"
            >
              {editingServiceId ? 'Salvar Alterações' : 'Criar Serviço'}
            </button>
          </form>
        </div>
      )}

      {/* Confirmation Dialog Modal (Manteve-se inalterado) */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setServiceToDelete(null)} />
          <div className="relative glass p-8 rounded-[2.5rem] w-full max-w-sm border border-slate-700 shadow-2xl text-center space-y-6 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
            
            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-inner">
              <AlertTriangle size={40} />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Excluir Serviço?</h3>
              <p className="text-slate-400 text-sm leading-relaxed px-2">
                Tem certeza que deseja remover <span className="text-white font-bold">"{serviceToDelete.name}"</span> do catálogo? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setServiceToDelete(null)}
                className="py-3 px-4 rounded-xl border border-slate-700 text-slate-400 font-bold hover:bg-slate-800 transition-all active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
