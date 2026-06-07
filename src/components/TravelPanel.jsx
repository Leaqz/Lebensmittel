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
        <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
          <I.MapPin size={15} color="#10b981" />
        </div>
        <h2 className="font-bold text-gray-800 text-sm">Standort & Umkreis</h2>
      </div>

      {/* Standort-Button */}
      <button
        onClick={onLocate}
        disabled={isLoading}
        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-extrabold mb-4 transition-all ${
          isLoading
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : hasReal
            ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-300 hover:bg-emerald-100'
            : 'btn-primary'
        }`}
      >
        {isLoading ? (
          <><I.Spinner size={15} color="#9ca3af" /> Standort wird ermittelt…</>
        ) : hasReal ? (
          <><I.Check size={15} /> Echte Filialen geladen · Neu laden</>
        ) : (
          <><I.Navigation size={15} color="white" /> Standort ermitteln</>
        )}
      </button>

      {locationError && (
        <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-4">
          <I.AlertCircle size={13} color="#b45309" className="shrink-0 mt-0.5" />
          <span>{locationError} Zeige Demo-Daten.</span>
        </div>
      )}

      {hasReal && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 mb-4 font-semibold">
          <I.LocPin size={13} color="#059669" />
          <span>Echte OpenStreetMap-Daten · {stores.length} Kette(n) gefunden</span>
        </div>
      )}

      {/* Radius-Slider */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-xs text-gray-500 font-medium">Reiseradius</span>
          <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            {radius} km
          </span>
        </div>
        <input
          type="range" min="1" max="15" value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ background: `linear-gradient(to right,#10b981 ${((radius - 1) / 14) * 100}%,#d1fae5 ${((radius - 1) / 14) * 100}%)` }}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1.5">
          <span>1 km</span><span>15 km</span>
        </div>
      </div>

      {/* Verkehrsmittel */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 font-medium mb-2">Verkehrsmittel</p>
        <div className="grid grid-cols-4 gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setTransport(m.id)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                transport === m.id
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 scale-105'
                  : 'bg-gray-50 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 border border-transparent hover:border-emerald-200'
              }`}
            >
              <m.Icon size={15} color={transport === m.id ? 'white' : 'currentColor'} />
              <span className="leading-none">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filialliste */}
      <div className="space-y-1.5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          {hasReal ? 'Gefundene Filialen' : 'Demo-Filialen'}
        </p>
        {stores.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3">
            Keine Filialen im Umkreis von {radius} km gefunden.
          </p>
        )}
        {stores.map((s) => {
          const inRange = s.distance <= radius;
          const mins = travel(s.distance, transport);
          return (
            <div
              key={s.id}
              className={`flex items-center justify-between py-2 px-3 rounded-xl text-sm transition-all ${
                inRange
                  ? 'border border-emerald-100 bg-emerald-50'
                  : 'bg-gray-50 opacity-40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-6 h-6 rounded-lg ${s.logoCls} flex items-center justify-center shrink-0`}>
                  <span className="text-white text-xs font-black">{(s.name || '?')[0]}</span>
                </div>
                <div className="min-w-0">
                  <span className={`font-semibold text-xs truncate block ${inRange ? 'text-gray-800' : 'text-gray-400'}`}>
                    {s.name}
                  </span>
                  {s.address && (
                    <span className="text-xs text-gray-400 truncate block">{s.address}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs shrink-0 ml-1">
                <span className="text-gray-400">{s.distance} km</span>
                {inRange && (
                  <span className="bg-white text-emerald-600 font-bold border border-emerald-200 px-2 py-0.5 rounded-lg">
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
