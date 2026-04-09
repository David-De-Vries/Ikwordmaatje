import {
  Award,
  Bell,
  BellOff,
  BookOpen,
  Calendar,
  ChevronRight,
  Globe,
  Heart,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageCircle,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useOnboarding } from "../context/OnboardingContext";

type Tab = "dashboard" | "matches" | "agenda" | "berichten" | "instellingen";

const NAV: { id: Tab; icon: typeof LayoutDashboard; label: string }[] = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "matches", icon: Users, label: "Matches" },
  { id: "agenda", icon: Calendar, label: "Agenda" },
  { id: "berichten", icon: MessageCircle, label: "Berichten" },
  { id: "instellingen", icon: Settings, label: "Instellingen" },
];

const ACTIVITIES = [
  { time: "Gisteren", text: "Kennismakingsgesprek ingepland met Mevr. Janssen", Icon: Calendar, color: "#D4EBE9", iconColor: "#5A9E97" },
  { time: "2 dagen geleden", text: "Profiel aangemaakt en goedgekeurd", Icon: Shield, color: "#E0F2E1", iconColor: "#2E7D32" },
  { time: "3 dagen geleden", text: "Match gevonden: 3 senioren in jouw buurt", Icon: Heart, color: "#FAE0EC", iconColor: "#A01550" },
];

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
      style={{ backgroundColor: value ? "#A01550" : "#D1D5DB" }}
    >
      <span
        className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform"
        style={{ transform: value ? "translateX(22px)" : "translateX(2px)" }}
      />
    </button>
  );
}

function SettingRow({
  Icon,
  iconBg,
  iconColor,
  label,
  description,
  value,
  onChange,
}: {
  Icon: typeof Bell;
  iconBg: string;
  iconColor: string;
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
        <Icon size={17} color={iconColor} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

export default function DashboardPage() {
  const { data } = useOnboarding();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const name = data.firstName || "vrijwilliger";

  const [settings, setSettings] = useState({
    emailNotifications: true,
    weeklyDigest: true,
    matchUpdates: true,
    nieuws: false,
    pushNotifications: true,
    profileVisible: true,
    twoFactor: false,
    dutchLanguage: true,
  });

  const set = (key: keyof typeof settings) => (v: boolean) =>
    setSettings((s) => ({ ...s, [key]: v }));

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F2F3F5" }}>
      {/* Top bar */}
      <header className="px-6 py-3 flex items-center justify-between sticky top-0 z-20" style={{ backgroundColor: "#8CBFBB" }}>
        <div className="flex items-center gap-2">
          <img src="/web/logo.png" alt="Careibu" className="w-7 h-7 object-contain" />
          <span className="text-lg font-bold text-white">Careibu</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-white/20 transition text-white">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: "rgba(255,255,255,0.25)" }}>
              {name[0]?.toUpperCase() || "V"}
            </div>
            <span className="text-sm font-medium text-white hidden sm:block">{name}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 w-full">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-56 flex-shrink-0 gap-1 border-r border-gray-200 px-4 py-6 bg-white">
          {NAV.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              style={
                activeTab === id
                  ? { backgroundColor: "#FAE0EC", color: "#A01550" }
                  : { color: "#6B7280" }
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </button>
          ))}
          <div className="mt-auto pt-4">
            <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-600 transition w-full">
              <LogOut size={17} />
              Uitloggen
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 px-6 py-6 max-w-4xl">
          {activeTab === "dashboard" && (
            <div className="space-y-4">
              {/* Welcome */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-lg font-bold text-gray-800">Goedemorgen, {name}!</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Jij maakt vandaag het verschil.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#A01550]">7</div>
                    <div className="text-xs text-gray-400">weken actief</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { label: "Afspraken", value: "3", Icon: Calendar, bg: "#D4EBE9", ic: "#5A9E97" },
                    { label: "Uren", value: "12", Icon: BookOpen, bg: "#FAE0EC", ic: "#A01550" },
                    { label: "Match score", value: "94%", Icon: Award, bg: "#E0F2E1", ic: "#2E7D32" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl p-3 flex items-center gap-3" style={{ backgroundColor: stat.bg }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/60">
                        <stat.Icon size={16} color={stat.ic} strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-base font-bold text-gray-800">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Left column */}
                <div className="lg:col-span-3 space-y-4">
                  {/* Match card */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold text-gray-800">Jouw match</h2>
                      <button className="text-xs text-[#A01550] font-medium hover:underline">Alle matches</button>
                    </div>
                    <div className="flex gap-4 p-4 rounded-xl border border-gray-100" style={{ backgroundColor: "#FAFAFA" }}>
                      <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#FAE0EC" }}>
                        <User size={20} color="#A01550" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-800">Mevrouw Janssen, 78 jaar</div>
                        <div className="text-xs text-gray-400 mb-2">Amsterdam · Wandelmaatje</div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                            <div className="h-full rounded-full bg-[#A01550]" style={{ width: "94%" }} />
                          </div>
                          <span className="text-xs font-medium text-[#A01550]">94% match</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 rounded-lg bg-[#A01550] text-white text-xs font-medium">Berichten</button>
                          <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 text-xs font-medium hover:bg-gray-50 transition">Profiel bekijken</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-800 mb-3">Recente activiteit</h2>
                    <div className="space-y-3">
                      {ACTIVITIES.map((a, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.color }}>
                            <a.Icon size={14} color={a.iconColor} strokeWidth={2} />
                          </div>
                          <div>
                            <div className="text-sm text-gray-700">{a.text}</div>
                            <div className="text-xs text-gray-400">{a.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right column */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Next appointment */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-800 mb-3">Volgende afspraak</h2>
                    <div className="rounded-xl p-4 text-center mb-3" style={{ backgroundColor: "#D4EBE9" }}>
                      <div className="text-2xl font-bold" style={{ color: "#3A7A74" }}>14</div>
                      <div className="text-sm font-medium" style={{ color: "#5A9E97" }}>April</div>
                      <div className="text-xs mt-0.5" style={{ color: "#5A9E97" }}>10:00</div>
                    </div>
                    <div className="text-xs text-gray-500 text-center mb-3">Kennismaking met Mevr. Janssen</div>
                    <button className="w-full py-2 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition">
                      Bekijk agenda
                    </button>
                  </div>

                  {/* Progress */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-200">
                    <h2 className="text-sm font-semibold text-gray-800 mb-3">Jouw voortgang</h2>
                    <div className="space-y-3">
                      {[
                        { label: "Profiel compleet", pct: 100 },
                        { label: "Eerste gesprek", pct: 80 },
                        { label: "Actief project", pct: 20 },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-medium" style={{ color: "#A01550" }}>{item.pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#F0F0F0" }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${item.pct}%`, backgroundColor: "#A01550" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === "matches" || activeTab === "agenda" || activeTab === "berichten") && (
            <div className="bg-white rounded-2xl p-8 border border-gray-200 text-center">
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: "#FAE0EC" }}>
                {activeTab === "matches" && <Users size={22} color="#A01550" />}
                {activeTab === "agenda" && <Calendar size={22} color="#A01550" />}
                {activeTab === "berichten" && <MessageCircle size={22} color="#A01550" />}
              </div>
              <p className="text-sm font-semibold text-gray-700 capitalize">{activeTab}</p>
              <p className="text-xs text-gray-400 mt-1">Deze sectie komt binnenkort beschikbaar.</p>
            </div>
          )}

          {activeTab === "instellingen" && (
            <div className="space-y-4">
              {/* Profile info */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-800 mb-4">Profiel</h2>
                <div className="flex items-center gap-4 mb-4 p-4 rounded-xl" style={{ backgroundColor: "#F7F8FA" }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: "#FAE0EC", color: "#A01550" }}>
                    {name[0]?.toUpperCase() || "V"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{name}</div>
                    <div className="text-xs text-gray-500">{data.email || "naam@voorbeeld.nl"}</div>
                  </div>
                  <button className="ml-auto text-xs text-[#A01550] font-medium hover:underline flex items-center gap-1">
                    Bewerken <ChevronRight size={13} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Stad", value: data.city || "Niet ingesteld" },
                    { label: "Project", value: data.project || "Niet gekoppeld" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 rounded-xl border border-gray-100">
                      <div className="text-xs text-gray-400">{item.label}</div>
                      <div className="text-sm font-medium text-gray-700 mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Bell size={15} color="#A01550" />
                  <h2 className="text-sm font-semibold text-gray-800">Meldingen</h2>
                </div>
                <p className="text-xs text-gray-400 mb-3">Kies hoe je op de hoogte wilt blijven.</p>
                <SettingRow
                  Icon={Mail}
                  iconBg="#D4EBE9"
                  iconColor="#5A9E97"
                  label="E-mailmeldingen"
                  description="Ontvang meldingen via e-mail"
                  value={settings.emailNotifications}
                  onChange={set("emailNotifications")}
                />
                <SettingRow
                  Icon={BookOpen}
                  iconBg="#E0E8F5"
                  iconColor="#1565C0"
                  label="Wekelijkse samenvatting"
                  description="Een overzicht van jouw week op zondag"
                  value={settings.weeklyDigest}
                  onChange={set("weeklyDigest")}
                />
                <SettingRow
                  Icon={Heart}
                  iconBg="#FAE0EC"
                  iconColor="#A01550"
                  label="Match updates"
                  description="Bericht bij nieuwe matches of berichten"
                  value={settings.matchUpdates}
                  onChange={set("matchUpdates")}
                />
                <SettingRow
                  Icon={BellOff}
                  iconBg="#F0F0F0"
                  iconColor="#5A5A5A"
                  label="Nieuws & updates"
                  description="Careibu nieuws en platformupdates"
                  value={settings.nieuws}
                  onChange={set("nieuws")}
                />
              </div>

              {/* Privacy & beveiliging */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={15} color="#2E7D32" />
                  <h2 className="text-sm font-semibold text-gray-800">Privacy & beveiliging</h2>
                </div>
                <p className="text-xs text-gray-400 mb-3">Beheer jouw gegevens en toegang.</p>
                <SettingRow
                  Icon={User}
                  iconBg="#E0F2E1"
                  iconColor="#2E7D32"
                  label="Profiel zichtbaar"
                  description="Senioren kunnen jouw profiel bekijken"
                  value={settings.profileVisible}
                  onChange={set("profileVisible")}
                />
                <SettingRow
                  Icon={Shield}
                  iconBg="#E0E8F5"
                  iconColor="#1565C0"
                  label="Tweestapsverificatie"
                  description="Extra beveiliging bij het inloggen"
                  value={settings.twoFactor}
                  onChange={set("twoFactor")}
                />
              </div>

              {/* Taal & regio */}
              <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <Globe size={15} color="#5A9E97" />
                  <h2 className="text-sm font-semibold text-gray-800">Taal & regio</h2>
                </div>
                <p className="text-xs text-gray-400 mb-3">Pas de weergavetaal aan.</p>
                <SettingRow
                  Icon={Globe}
                  iconBg="#D4EBE9"
                  iconColor="#5A9E97"
                  label="Nederlands"
                  description="Gebruik de app in het Nederlands"
                  value={settings.dutchLanguage}
                  onChange={set("dutchLanguage")}
                />
              </div>

              {/* Danger zone */}
              <div className="bg-white rounded-2xl p-5 border border-red-100">
                <h2 className="text-sm font-semibold text-red-600 mb-3">Account verwijderen</h2>
                <p className="text-xs text-gray-500 mb-3">
                  Wanneer je jouw account verwijdert, worden al jouw gegevens permanent gewist. Dit kan niet ongedaan worden gemaakt.
                </p>
                <button className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition">
                  Account verwijderen
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around px-2 py-2 z-20">
        {NAV.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex flex-col items-center py-1 px-2 rounded-lg transition"
            style={{ color: activeTab === id ? "#A01550" : "#9CA3AF" }}
          >
            <Icon size={18} strokeWidth={2} />
            <span className="text-xs mt-0.5">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
