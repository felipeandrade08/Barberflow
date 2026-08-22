
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, MessageSquare, User, Calendar, Scissors } from 'lucide-react';

const AdminReviews: React.FC = () => {
  const { bookings } = useApp();
  
  const reviews = bookings
    .filter(b => b.rating)
    .sort((a, b) => new Date(b.rating!.date).getTime() - new Date(a.rating!.date).getTime());

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, b) => sum + b.rating!.stars, 0) / reviews.length).toFixed(1)
    : '0';

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(b => b.rating!.stars === star).length,
    percentage: reviews.length > 0 ? (reviews.filter(b => b.rating!.stars === star).length / reviews.length) * 100 : 0
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white">Avaliações</h1>
          <p className="text-slate-400">Feedback dos seus clientes sobre os serviços</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Summary */}
        <div className="glass p-8 rounded-3xl border border-slate-700 h-fit">
          <div className="text-center mb-8">
            <h3 className="text-5xl font-bold text-white mb-2">{averageRating}</h3>
            <div className="flex justify-center mb-2 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={20} fill={s <= Math.round(Number(averageRating)) ? "currentColor" : "none"} />
              ))}
            </div>
            <p className="text-slate-400 text-sm">Média de {reviews.length} avaliações</p>
          </div>

          <div className="space-y-3">
            {ratingDistribution.map((item) => (
              <div key={item.star} className="flex items-center space-x-4">
                <span className="text-xs font-bold text-slate-400 w-4">{item.star}</span>
                <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-1000" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-8 text-right">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.length > 0 ? reviews.map((b) => (
            <div key={b.id} className="glass p-6 rounded-3xl border border-slate-700 space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-500 border border-slate-700">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{b.userName}</h4>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                      <Calendar size={10} />
                      <span>{new Date(b.rating!.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill={s <= b.rating!.stars ? "currentColor" : "none"} />
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-center space-x-2 text-xs text-amber-500 font-bold mb-2">
                  <Scissors size={12} />
                  <span>{b.serviceName}</span>
                </div>
                <p className="text-slate-300 text-sm italic">"{b.rating!.comment}"</p>
              </div>
            </div>
          )) : (
            <div className="glass p-12 rounded-3xl border border-slate-700 text-center text-slate-500">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhuma avaliação recebida ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReviews;
