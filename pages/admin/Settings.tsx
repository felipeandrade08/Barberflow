import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save, Clock, MapPin, Phone, Calendar, Trash2, Plus, QrCode, Download, Share2, MessageCircle } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const AdminSettings: React.FC = () => {
  const { settings, updateSettings, tenantSlug } = useApp();
  const [formData, setFormData] = useState(settings);
  const [newOffDay, setNewOffDay] = useState('');

  const defaultUrl = `${window.location.origin}/b/${tenantSlug}`;
  const qrValue = defaultUrl;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const addOffDay = () => {
    if (!newOffDay) return;
    if (formData.offDays.includes(newOffDay)) return;
    setFormData({
      ...formData,
      offDays: [...formData.offDays, newOffDay].sort()
    });
    setNewOffDay('');
  };

  const removeOffDay = (date: string) => {
    setFormData({
      ...formData,
      offDays: formData.offDays.filter(d => d !== date)
    });
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `qr-code-${formData.name.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="page-title">Configurações</h1>
        <p className="text-slate-400">Centralize dados da marca, atendimento, horários e experiência do cliente</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Business Info */}
          <div className="surface p-6 lg:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <MapPin className="mr-2 text-amber-500" size={20} />
              Informações Gerais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Nome da Barbearia</label>
                <input
                  type="text"
                  className="field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Telefone</label>
                <input
                  type="text"
                  className="field"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">WhatsApp (somente números)</label>
                <input type="text" className="field" value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="5511999998888"/>
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Instagram</label>
                <input type="text" className="field" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} placeholder="@sua_barbearia"/>
              </div>
              <div><label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">URL da logo</label><input type="url" className="field" value={formData.logoUrl||''} onChange={e=>setFormData({...formData,logoUrl:e.target.value})} placeholder="https://..."/></div><div><label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">URL da capa</label><input type="url" className="field" value={formData.coverUrl||''} onChange={e=>setFormData({...formData,coverUrl:e.target.value})} placeholder="https://..."/></div>
              <div className="md:col-span-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Descrição pública</label>
                <textarea rows={3} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none text-white resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}/>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Endereço Completo</label>
                <input
                  type="text"
                  className="field"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="surface p-6 lg:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center"><Clock className="mr-2 text-amber-500" size={20}/> Regras da agenda</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div><label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Abertura</label><input type="time" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={formData.openTime} onChange={e=>setFormData({...formData,openTime:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Fechamento</label><input type="time" className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={formData.closeTime} onChange={e=>setFormData({...formData,closeTime:e.target.value})}/></div>
              <div><label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Intervalo da agenda</label><select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={formData.bookingInterval} onChange={e=>setFormData({...formData,bookingInterval:Number(e.target.value)})}><option value={15}>15 minutos</option><option value={30}>30 minutos</option><option value={60}>1 hora</option></select></div>
              <div><label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Cancelamento mínimo</label><select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={formData.cancellationHours} onChange={e=>setFormData({...formData,cancellationHours:Number(e.target.value)})}><option value={0}>Sem limite</option><option value={2}>2 horas</option><option value={6}>6 horas</option><option value={24}>24 horas</option></select></div>
            </div>
          </div>

          <div className="surface p-6 lg:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white">Timezone e fidelidade</h2>
            <div><label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Fuso horário</label><select className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white" value={formData.timezone||'America/Sao_Paulo'} onChange={e=>setFormData({...formData,timezone:e.target.value})}><option value="America/Sao_Paulo">Brasília / São Paulo</option><option value="America/Manaus">Manaus</option><option value="America/Cuiaba">Cuiabá</option><option value="America/Rio_Branco">Rio Branco</option><option value="America/Noronha">Fernando de Noronha</option></select></div>
            <label className="flex items-center gap-3 text-white"><input type="checkbox" checked={formData.loyaltyEnabled===true} onChange={e=>setFormData({...formData,loyaltyEnabled:e.target.checked})}/>Ativar programa de fidelidade</label>
            {formData.loyaltyEnabled&&<div className="grid md:grid-cols-2 gap-4"><div><label className="text-xs text-slate-500 uppercase font-bold">Atendimentos para recompensa</label><input type="number" min={1} max={100} value={formData.loyaltyTarget||10} onChange={e=>setFormData({...formData,loyaltyTarget:Number(e.target.value)})} className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"/></div><div><label className="text-xs text-slate-500 uppercase font-bold">Recompensa</label><input value={formData.loyaltyReward||''} onChange={e=>setFormData({...formData,loyaltyReward:e.target.value})} placeholder="Ex.: Corte gratuito" className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"/></div></div>}
          </div>

          {/* QR Code Section */}
          <div className="surface p-6 lg:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <QrCode className="mr-2 text-emerald-500" size={20} />
              Portal do Cliente (QR Code)
            </h2>
            <p className="text-sm text-slate-400">Este é o link oficial da sua barbearia. Compartilhe no WhatsApp, Instagram, Facebook ou imprima o QR Code.</p>
            
            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="p-6 bg-white rounded-3xl shadow-xl flex items-center justify-center">
                <QRCodeCanvas 
                  id="qr-code"
                  value={qrValue} 
                  size={180}
                  level={"H"}
                  fgColor={formData.qrColor || "#0f172a"}
                  includeMargin={true}
                />
              </div>

              <div className="flex-1 space-y-6 w-full">
                <div><label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 block">Link público da barbearia</label><code className="block bg-slate-900 border border-slate-700 p-3 rounded-xl text-xs text-amber-500 break-all">{defaultUrl}</code><div className="flex gap-2 mt-3"><a href={defaultUrl} target="_blank" rel="noreferrer" className="btn-secondary flex-1 justify-center">Visualizar página</a><button type="button" onClick={()=>navigator.clipboard.writeText(defaultUrl)} className="btn-primary flex-1">Copiar link</button></div></div>
                <div>
                  <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-2 block">Cor do QR Code</label>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="color" 
                      className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer overflow-hidden p-0"
                      value={formData.qrColor || "#0f172a"}
                      onChange={(e) => setFormData({...formData, qrColor: e.target.value})}
                    />
                    <span className="text-sm text-slate-400 font-mono">{formData.qrColor || "#0f172a"}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Visualização do Conteúdo:</p>
                  <code className="block bg-slate-900 border border-slate-700 p-3 rounded-xl text-xs text-amber-500 break-all">
                    {qrValue}
                  </code>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={downloadQRCode}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 border border-slate-700"
                  >
                    <Download size={18} />
                    <span>Baixar PNG</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(qrValue);
                      alert('Conteúdo copiado!');
                    }}
                    className="flex-1 bg-amber-500 text-slate-900 py-3 rounded-xl font-bold text-sm hover:bg-amber-400 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10"
                  >
                    <Share2 size={18} />
                    <span>Copiar Link</span>
                  </button>
                  <a href={`https://wa.me/?text=${encodeURIComponent(`Agende seu horário na ${formData.name}: ${defaultUrl}`)}`} target="_blank" rel="noreferrer" className="flex-1 bg-emerald-500/15 text-emerald-300 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-emerald-500/20"><MessageCircle size={18}/>Compartilhar</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Business Hours */}
          <div className="surface p-6 lg:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Clock className="mr-2 text-blue-500" size={20} />
              Horário
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Abertura</label>
                <input
                  type="time"
                  className="field"
                  value={formData.openTime}
                  onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1 block">Fechamento</label>
                <input
                  type="time"
                  className="field"
                  value={formData.closeTime}
                  onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Off Days */}
          <div className="surface p-6 lg:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Calendar className="mr-2 text-purple-500" size={20} />
              Ausência
            </h2>
            <div className="flex space-x-2">
              <input
                type="date"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none text-white"
                value={newOffDay}
                onChange={(e) => setNewOffDay(e.target.value)}
              />
              <button
                type="button"
                onClick={addOffDay}
                className="p-2 bg-amber-500 text-slate-900 rounded-xl hover:bg-amber-400 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {formData.offDays.map((date) => (
                <div key={date} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700 group">
                  <span className="text-sm text-slate-200">{new Date(date).toLocaleDateString('pt-BR')}</span>
                  <button
                    type="button"
                    onClick={() => removeOffDay(date)}
                    className="p-1.5 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 text-slate-900 py-4 rounded-2xl font-bold text-lg hover:bg-amber-400 transition-all shadow-lg flex items-center justify-center space-x-2"
          >
            <Save size={20} />
            <span>Salvar Alterações</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;