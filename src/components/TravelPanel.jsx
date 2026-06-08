import { I } from '../utils/icons.jsx';
import { travel } from '../utils/helpers.js';

const MODES = [
  { id: 'car',     label: 'Auto',    Icon: I.Car },
  { id: 'transit', label: 'ÖPNV',    Icon: I.Bus },
  { id: 'bike',    label: 'Fahrrad', Icon: I.Bike },
  { id: 'walk',    label: 'Zu Fuß',  Icon: I.Walk },
];

export default function TravelPanel({
  radius, setRadius, transport, setTransport,
  stores, locationStatus, locationError, onLocate,
}) {
  const isLoading = locationStatus === 'loading';
  const hasReal   = locationStatus === 'success';

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(48,209,88,0.1)' }}>
          <I.MapPin size={15} color="#30D158" />
        </div>
        <h2 className="text-[15px] font-[700]" style={{ color: '#1D1D1F' }}>Standort &amp; Umkreis</h2>
      </div>

      {/* Location button */}
      <button onClick={onLocate} disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-[980px] text-[13px] font-[700] mb-4 transition-all"
        style={isLoading
          ? { background: '#F2F2F7', color: '#AEAEB2', cursor: 'not-allowed' }
          : hasReal
          ? { background: 'rgba(48,209,88,0.08)', color: '#30D158', border: '1px solid rgba(48,209,88,0.25)' }
          : { background: '#007AFF', color: '#fff', boxShadow: '0 3px 14px rgba(0,122,255,0.35)' }
        }
      >
        {isLoading ? (
          <><I.Spinner size={14} color="#AEAEB2" /> Standort wird ermittelt…</>
        ) : hasReal ? (
          <><I.Check size={14} /> Echte Filialen geladen · Neu laden</>
        ) : (
          <><I.Navigation size={14} color="white" /> Standort ermitteln</>
        )}
      </button>

      {locationError && (
        <div className="flex items-start gap-2 text-[12px] rounded-[12px] px-3 py-2.5 mb-4"
          style={{ background: 'rgba(255,149,0,0.08)', border: '0.5px solid rgba(255,149,0,0.2)', color: '#B36200' }}>
          <I.AlertCircle size={12} color="#FF9500" className="shrink-0 mt-0.5" />
          <span>{locationError} Zeige Demo-Daten.</span>
        </div>
      )}

      {hasReal && (
        <div className="flex items-center gap-2 text-[12px] rounded-[12px] px-3 py-2 mb-4 font-[500]"
          style={{ background: 'rgba(48,209,88,0.07)', border: '0.5px solid rgba(48,209,88,0.2)', color: '#1A7A32' }}>
          <I.LocPin size={12} color="#30D158" />
          <span>Echte OpenStreetMap-Daten · {stores.length} Kette(n) gefunden</span>
        </div>
      )}

      {/* Radius slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-[500]" style={{ color: '#6E6E73' }}>Reiseradius</span>
          <span className="text-[13px] font-[800] px-2.5 py-0.5 rounded-[980px]"
            style={{ background: 'rgba(48,209,88,0.1)', color: '#30D158', fontVariantNumeric: 'tabular-nums' }}>
            {radius} km
          </span>
        </div>
        <input
          type="range" min="1" max="15" value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ background: `linear-gradient(to right, #30D158 ${((radius - 1) / 14) * 100}%, #E5E5EA ${((radius - 1) / 14) * 100}%)` }}
          className="w-full"
        />
        <div className="flex justify-between text-[11px] mt-2" style={{ color: '#AEAEB2' }}>
          <span>1 km</span><span>15 km</span>
        </div>
      </div>

      {/* Transport modes */}
      <div className="mb-4">
        <p className="text-[12px] font-[600] mb-2.5" style={{ color: '#6E6E73' }}>Verkehrsmittel</p>
        <div className="grid grid-cols-4 gap-1.5">
          {MODES.map((m) => (
            <button key={m.id} onClick={() => setTransport(m.id)}
              className="flex flex-col items-center gap-1 py-2.5 rounded-[12px] text-[11px] font-[600] transition-all"
              style={transport === m.id
                ? { background: '#30D158', color: '#fff', boxShadow: '0 3px 12px rgba(48,209,88,0.4)', transform: 'scale(1.04)' }
                : { background: '#F2F2F7', color: '#6E6E73' }
              }
            >
              <m.Icon size={14} color={transport === m.id ? 'white' : '#6E6E73'} />
              <span className="leading-none">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Store list */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-[700] uppercase tracking-wider mb-2" style={{ color: '#AEAEB2' }}>
          {hasReal ? 'Gefundene Filialen' : 'Demo-Filialen'}
        </p>
        {stores.length === 0 && (
          <p className="text-[12px] text-center py-3" style={{ color: '#AEAEB2' }}>
            Keine Filialen im Umkreis von {radius} km.
          </p>
        )}
        {stores.map((s) => {
          const inRange = s.distance <= radius;
          const mins    = travel(s.distance, transport);
          return (
            <div key={s.id}
              className="flex items-center justify-between py-2 px-3 rounded-[12px] text-sm transition-all"
              style={inRange
                ? { background: 'rgba(48,209,88,0.06)', border: '0.5px solid rgba(48,209,88,0.18)' }
                : { background: '#F2F2F7', opacity: 0.45 }
              }
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-6 h-6 rounded-[7px] ${s.logoCls} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-[10px] font-[800]">{(s.name || '?')[0]}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[12px] font-[600] truncate block"
                    style={{ color: inRange ? '#1D1D1F' : '#6E6E73' }}>{s.name}</span>
                  {s.address && (
                    <span className="text-[11px] truncate block" style={{ color: '#AEAEB2' }}>{s.address}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] shrink-0 ml-1">
                <span style={{ color: '#AEAEB2' }}>{s.distance} km</span>
                {inRange && (
                  <span className="font-[700] px-2 py-0.5 rounded-[7px]"
                    style={{ background: '#fff', color: '#30D158', border: '0.5px solid rgba(48,209,88,0.25)' }}>
                    ~{mins} min
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
