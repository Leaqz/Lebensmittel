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
          style={{ background: 'rgba(48,209,88,0.12)' }}>
          <I.MapPin size={15} color="#30D158" />
        </div>
        <h2 className="text-[15px] font-[700]" style={{ color: '#F5F5F7' }}>Standort &amp; Umkreis</h2>
      </div>

      {/* Location button */}
      <button onClick={onLocate} disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-[980px] text-[13px] font-[700] mb-4 transition-all"
        style={isLoading
          ? { background: '#2C2C2E', color: 'rgba(235,235,245,0.3)', cursor: 'not-allowed' }
          : hasReal
          ? { background: 'rgba(48,209,88,0.1)', color: '#30D158', border: '1px solid rgba(48,209,88,0.3)' }
          : { background: '#0A84FF', color: '#fff', boxShadow: '0 3px 14px rgba(10,132,255,0.4)' }
        }
      >
        {isLoading ? (
          <><I.Spinner size={14} color="rgba(235,235,245,0.3)" /> Standort wird ermittelt…</>
        ) : hasReal ? (
          <><I.Check size={14} /> Echte Filialen geladen · Neu laden</>
        ) : (
          <><I.Navigation size={14} color="white" /> Standort ermitteln</>
        )}
      </button>

      {locationError && (
        <div className="flex items-start gap-2 text-[12px] rounded-[12px] px-3 py-2.5 mb-4"
          style={{ background: 'rgba(255,159,10,0.1)', border: '0.5px solid rgba(255,159,10,0.25)', color: '#FF9F0A' }}>
          <I.AlertCircle size={12} color="#FF9F0A" className="shrink-0 mt-0.5" />
          <span>{locationError} Zeige Demo-Daten.</span>
        </div>
      )}

      {hasReal && (
        <div className="flex items-center gap-2 text-[12px] rounded-[12px] px-3 py-2 mb-4 font-[500]"
          style={{ background: 'rgba(48,209,88,0.08)', border: '0.5px solid rgba(48,209,88,0.25)', color: '#30D158' }}>
          <I.LocPin size={12} color="#30D158" />
          <span>Echte OpenStreetMap-Daten · {stores.length} Kette(n) gefunden</span>
        </div>
      )}

      {/* Radius slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[13px] font-[500]" style={{ color: 'rgba(235,235,245,0.6)' }}>Reiseradius</span>
          <span className="text-[13px] font-[800] px-2.5 py-0.5 rounded-[980px]"
            style={{ background: 'rgba(48,209,88,0.12)', color: '#30D158', fontVariantNumeric: 'tabular-nums' }}>
            {radius} km
          </span>
        </div>
        <input
          type="range" min="1" max="15" value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ background: `linear-gradient(to right, #30D158 ${((radius - 1) / 14) * 100}%, #3A3A3C ${((radius - 1) / 14) * 100}%)` }}
          className="w-full"
        />
        <div className="flex justify-between text-[11px] mt-2" style={{ color: 'rgba(235,235,245,0.3)' }}>
          <span>1 km</span><span>15 km</span>
        </div>
      </div>

      {/* Transport modes */}
      <div className="mb-4">
        <p className="text-[12px] font-[600] mb-2.5" style={{ color: 'rgba(235,235,245,0.6)' }}>Verkehrsmittel</p>
        <div className="grid grid-cols-4 gap-1.5">
          {MODES.map((m) => (
            <button key={m.id} onClick={() => setTransport(m.id)}
              className="flex flex-col items-center gap-1 py-2.5 rounded-[12px] text-[11px] font-[600] transition-all"
              style={transport === m.id
                ? { background: '#30D158', color: '#000', boxShadow: '0 3px 12px rgba(48,209,88,0.4)', transform: 'scale(1.04)' }
                : { background: '#2C2C2E', color: 'rgba(235,235,245,0.6)' }
              }
            >
              <m.Icon size={14} color={transport === m.id ? '#000' : 'rgba(235,235,245,0.6)'} />
              <span className="leading-none">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Store list */}
      <div className="space-y-1.5">
        <p className="text-[11px] font-[700] uppercase tracking-wider mb-2" style={{ color: 'rgba(235,235,245,0.3)' }}>
          {hasReal ? 'Gefundene Filialen' : 'Demo-Filialen'}
        </p>
        {stores.length === 0 && (
          <p className="text-[12px] text-center py-3" style={{ color: 'rgba(235,235,245,0.3)' }}>
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
                ? { background: 'rgba(48,209,88,0.07)', border: '0.5px solid rgba(48,209,88,0.2)' }
                : { background: '#2C2C2E', opacity: 0.45 }
              }
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-6 h-6 rounded-[7px] ${s.logoCls} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-[10px] font-[800]">{(s.name || '?')[0]}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-[12px] font-[600] truncate block"
                    style={{ color: inRange ? '#F5F5F7' : 'rgba(235,235,245,0.6)' }}>{s.name}</span>
                  {s.address && (
                    <span className="text-[11px] truncate block" style={{ color: 'rgba(235,235,245,0.3)' }}>{s.address}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] shrink-0 ml-1">
                <span style={{ color: 'rgba(235,235,245,0.3)' }}>{s.distance} km</span>
                {inRange && (
                  <span className="font-[700] px-2 py-0.5 rounded-[7px]"
                    style={{ background: 'rgba(48,209,88,0.15)', color: '#30D158', border: '0.5px solid rgba(48,209,88,0.3)' }}>
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
