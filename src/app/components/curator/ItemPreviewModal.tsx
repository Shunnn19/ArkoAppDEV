import { useState } from 'react';
import { X, Upload, Check } from 'lucide-react';

interface ItemPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  artifact?: {
    itemId: string;
    title: string;
    collectionNo?: string;
    imageUrl?: string;
    height?: string;
    width?: string;
    length?: string;
    color?: string;
    texture?: string;
    acquisitionDate?: string;
    acquisitionSource?: string;
    provenance?: string;
    notes?: string;
  };
}

const labelCls = 'block text-[11px] font-semibold uppercase tracking-[0.07em] text-[#888888] mb-1';
const valueCls = 'text-[13px] text-[#222222] leading-[1.5]';

export function ItemPreviewModal({ isOpen, onClose, artifact }: ItemPreviewModalProps) {
  const [published, setPublished] = useState(false);

  if (!isOpen) return null;

  const data = artifact ?? {
    itemId: 'ART-2025-6041',
    title: 'Ancient Greek Red-Figure Amphora',
    collectionNo: 'COL-002 - Ancient Artifacts',
    imageUrl: 'https://images.unsplash.com/photo-1618722060945-b87f7326995b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    height: '45.5',
    width: '28.3',
    length: '28.3',
    color: 'Terracotta red with black figures',
    texture: 'Smooth glazed ceramic',
    acquisitionDate: 'March 15, 2024',
    acquisitionSource: 'Archaeological excavation, Athens site',
    provenance: 'Discovered during excavations at the ancient Agora of Athens in 1998. Previously part of a private collection in Greece before being acquired by the museum through a donation from the Hellenic Archaeological Society.',
    notes: 'Excellent condition with minor restoration on the handle. Features typical red-figure painting technique showing a symposium scene.',
  };

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => {
      setPublished(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative z-10 bg-white rounded-[16px] shadow-[0_24px_64px_rgba(0,0,0,0.18)] w-full max-w-[880px] max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/[0.07] flex-shrink-0">
          <h1 className="text-[15px] font-semibold text-[#222222]">Item Preview</h1>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-[#888888] hover:bg-[#F0F0F0] hover:text-[#333333] rounded-[6px] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-5">
            {/* Image */}
            <div className="w-full aspect-square rounded-[10px] overflow-hidden bg-[#F5F5F7] border border-black/[0.07] flex-shrink-0">
              {data.imageUrl ? (
                <img src={data.imageUrl} alt={data.title} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#CCCCCC] text-[12px]">No image</div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-3">
              <h2 className="text-[17px] font-bold text-[#222222] leading-[1.3]">{data.title}</h2>

              <div className="bg-white border border-black/[0.08] rounded-[10px] overflow-hidden">
                {/* Item ID + Collection No */}
                <div className="grid grid-cols-2 border-b border-black/[0.05]">
                  <div className="px-3 py-2.5 border-r border-black/[0.05]">
                    <label className={labelCls}>Item ID</label>
                    <p className={valueCls}>{data.itemId || '—'}</p>
                  </div>
                  <div className="px-3 py-2.5">
                    <label className={labelCls}>Collection No.</label>
                    <p className={valueCls}>{data.collectionNo || '—'}</p>
                  </div>
                </div>

                {/* Color + Texture */}
                <div className="grid grid-cols-2 border-b border-black/[0.05] bg-[#FAFAFA]">
                  <div className="px-3 py-2.5 border-r border-black/[0.05]">
                    <label className={labelCls}>Color</label>
                    <p className={valueCls}>{data.color || '—'}</p>
                  </div>
                  <div className="px-3 py-2.5">
                    <label className={labelCls}>Texture</label>
                    <p className={valueCls}>{data.texture || '—'}</p>
                  </div>
                </div>

                {/* Height + Width + Length */}
                <div className="grid grid-cols-3 border-b border-black/[0.05]">
                  <div className="px-3 py-2.5 border-r border-black/[0.05]">
                    <label className={labelCls}>Height</label>
                    <p className={valueCls}>{data.height ? `${data.height} cm` : '—'}</p>
                  </div>
                  <div className="px-3 py-2.5 border-r border-black/[0.05]">
                    <label className={labelCls}>Width</label>
                    <p className={valueCls}>{data.width ? `${data.width} cm` : '—'}</p>
                  </div>
                  <div className="px-3 py-2.5">
                    <label className={labelCls}>Length</label>
                    <p className={valueCls}>{data.length ? `${data.length} cm` : '—'}</p>
                  </div>
                </div>

                {/* Acquisition Date + Source */}
                <div className="grid grid-cols-2 border-b border-black/[0.05] bg-[#FAFAFA]">
                  <div className="px-3 py-2.5 border-r border-black/[0.05]">
                    <label className={labelCls}>Acquisition Date</label>
                    <p className={valueCls}>{data.acquisitionDate || '—'}</p>
                  </div>
                  <div className="px-3 py-2.5">
                    <label className={labelCls}>Acquisition Source</label>
                    <p className={valueCls}>{data.acquisitionSource || '—'}</p>
                  </div>
                </div>

                {/* Provenance */}
                <div className="px-3 py-2.5 border-b border-black/[0.05]">
                  <label className={labelCls}>Provenance</label>
                  <p className={`${valueCls} text-[#444444]`}>{data.provenance || '—'}</p>
                </div>

                {/* Notes */}
                <div className="px-3 py-2.5">
                  <label className={labelCls}>Notes</label>
                  <p className={`${valueCls} text-[#444444]`}>{data.notes || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-black/[0.07] flex-shrink-0">
          <button
            onClick={onClose}
            className="h-[34px] px-4 rounded-[8px] text-[13px] font-semibold text-[#555555] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            className="h-[34px] px-4 rounded-[8px] text-[13px] font-semibold bg-[#16A34A] text-white hover:bg-[#15803D] transition-colors flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            Publish
          </button>
        </div>
      </div>

      {/* Success notification */}
      {published && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-[16px] shadow-[0_24px_64px_rgba(0,0,0,0.2)] px-10 py-8 flex flex-col items-center gap-4 pointer-events-auto">
            <div className="w-14 h-14 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/25 flex items-center justify-center">
              <Check className="w-7 h-7 text-[#16A34A]" />
            </div>
            <div className="text-center">
              <p className="text-[16px] font-semibold text-[#222222]">Successfully Published!</p>
              <p className="text-[13px] text-[#888888] mt-1">The item has been published to the collection.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
