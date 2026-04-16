import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Card, Typography } from "@/components/ui";
import { DS } from "@/constants/design-system";

// ─────────────────────────────────────────────────────────────────────────────
// Article data
// ─────────────────────────────────────────────────────────────────────────────

type FeatherName = React.ComponentProps<typeof Feather>["name"];

interface TipBlock {
  icon: FeatherName;
  title: string;
  body: string;
}

export interface Article {
  id: string;
  category: string;
  icon: FeatherName;
  color: string;
  bg: string;
  title: string;
  snippet: string;
  readTime: string;
  intro: string;
  tips: TipBlock[];
  callout: string;
}

export const ARTICLES: Record<string, Article> = {
  introductie: {
    id: "introductie",
    category: "Eerste stappen",
    icon: "star",
    color: "#3A9490",
    bg: "#EEF7F6",
    title: "Je eerste bezoek voorbereiden",
    snippet: "Zo bereid jij je eerste bezoek optimaal voor.",
    readTime: "4 min",
    intro:
      "Het eerste bezoek is spannend — zowel voor jou als voor de senior. Goede voorbereiding helpt je om ontspannen en vol vertrouwen op pad te gaan.",
    tips: [
      {
        icon: "clock",
        title: "Plan genoeg tijd in",
        body: "Zorg dat je niet gehaast bent. Plan minimaal 1,5 uur, ook als het bezoek korter duurt.",
      },
      {
        icon: "list",
        title: "Denk van tevoren na over onderwerpen",
        body: "Wat interesseert de senior? Kijk in hun profiel naar hobby's en interesses voor inspiratie.",
      },
      {
        icon: "gift",
        title: "Neem iets mee",
        body: "Een kleine attentie zoals een bloem of een stuk fruit kan het ijs breken en een warm gevoel geven.",
      },
      {
        icon: "check-circle",
        title: "Bespreek verwachtingen vooraf",
        body: "Spreek bij het eerste bezoek meteen af hoe jullie contact houden en hoe vaak je langskomt.",
      },
    ],
    callout:
      "Bereid je goed voor, maar maak je niet te veel zorgen. De senior kijkt al naar jou uit!",
  },

  gesprek: {
    id: "gesprek",
    category: "Eerste stappen",
    icon: "message-circle",
    color: "#3A9490",
    bg: "#E8F4F3",
    title: "Tips voor je eerste gesprek",
    snippet: "Praktische tips voor een goed en ontspannen gesprek.",
    readTime: "3 min",
    intro:
      "Een goed gesprek begint met oprechte aandacht. Je hoeft geen therapeut te zijn — gewoon aanwezig zijn en luisteren is al heel waardevol.",
    tips: [
      {
        icon: "help-circle",
        title: "Stel open vragen",
        body: "Vraag niet 'Was het een goede dag?' maar 'Wat heb je vandaag meegemaakt?' Open vragen nodigen uit tot een echt verhaal.",
      },
      {
        icon: "headphones",
        title: "Luister actief",
        body: "Herhaal soms wat de senior zegt om te laten zien dat je echt luistert. Knikken en oogcontact helpen ook.",
      },
      {
        icon: "user",
        title: "Deel ook iets over jezelf",
        body: "Een gesprek werkt twee kanten op. Durf ook iets persoonlijks te vertellen — het maakt je menselijker.",
      },
      {
        icon: "pause",
        title: "Laat stiltes toe",
        body: "Een stil moment hoeft niet meteen gevuld te worden. Soms is het heerlijk om gewoon samen te zitten.",
      },
    ],
    callout:
      "Een goed gesprek hoeft niet lang te zijn. Kwaliteit gaat altijd boven kwantiteit.",
  },

  vog: {
    id: "vog",
    category: "Eerste stappen",
    icon: "shield",
    color: "#3A9490",
    bg: "#EEF7F6",
    title: "Wat is een VOG en waarom?",
    snippet: "Alles wat je moet weten over de VOG-aanvraag.",
    readTime: "2 min",
    intro:
      "Voor vrijwilligerswerk bij Careibu heb je een Verklaring Omtrent Gedrag (VOG) nodig. Dit officiële document laat zien dat je gedrag in het verleden geen bezwaar vormt voor je rol als vrijwilliger.",
    tips: [
      {
        icon: "globe",
        title: "Vraag het aan via Justis",
        body: "Je kunt een VOG online aanvragen via justis.nl. Je hebt hiervoor je DigiD nodig.",
      },
      {
        icon: "tag",
        title: "Het kost bijna niets",
        body: "Voor vrijwilligers is de VOG gratis of sterk gereduceerd in prijs. Careibu vertelt je precies hoe.",
      },
      {
        icon: "calendar",
        title: "Het duurt 1 tot 4 weken",
        body: "Vraag de VOG op tijd aan zodat je snel van start kunt gaan met je vrijwilligerswerk.",
      },
      {
        icon: "phone",
        title: "Careibu helpt je",
        body: "Bij vragen over de aanvraag kun je altijd contact opnemen met jouw Careibu-begeleider.",
      },
    ],
    callout:
      "De VOG is er niet om je te wantrouwen — het beschermt de senior en geeft vertrouwen aan iedereen.",
  },

  vertrouwen: {
    id: "vertrouwen",
    category: "Communicatie & gesprek",
    icon: "users",
    color: "#A01550",
    bg: "#FAE0EC",
    title: "Vertrouwen opbouwen met je senior",
    snippet: "Hoe bouw je stap voor stap een vertrouwensband op?",
    readTime: "4 min",
    intro:
      "Vertrouwen groeit niet in één dag. Maar met de juiste houding leg je al bij het eerste bezoek een goede basis voor een warme, duurzame relatie.",
    tips: [
      {
        icon: "check",
        title: "Wees betrouwbaar",
        body: "Kom altijd op de afgesproken tijd. Als je toch niet kunt, bel dan ruim van tevoren om dit te laten weten.",
      },
      {
        icon: "message-square",
        title: "Wees eerlijk",
        body: "Als iets niet gaat of je ergens mee zit, zeg dat dan rustig. Eerlijkheid wordt altijd gewaardeerd.",
      },
      {
        icon: "lock",
        title: "Respecteer privacy",
        body: "Wat de senior vertelt, blijft tussen jullie. Deel geen persoonlijke informatie met vrienden of familie.",
      },
      {
        icon: "heart",
        title: "Toon oprechte interesse",
        body: "Stel vragen over vroeger, over familie en over wat de senior bezighoudt. Mensen voelen het als aandacht echt is.",
      },
    ],
    callout:
      "Vertrouwen is de basis van elke goede relatie. Investeer erin, ook als het langzaam gaat.",
  },

  grenzen: {
    id: "grenzen",
    category: "Communicatie & gesprek",
    icon: "alert-circle",
    color: "#C97B00",
    bg: "#FFF0D9",
    title: "Grenzen aangeven als vrijwilliger",
    snippet: "Leer hoe je je grenzen gezond aangeeft als vrijwilliger.",
    readTime: "3 min",
    intro:
      "Als vrijwilliger is het belangrijk dat je je eigen grenzen kent en aangeeft. Dit is geen zwakte — het is juist gezond en noodzakelijk om het vrijwilligerswerk vol te houden.",
    tips: [
      {
        icon: "info",
        title: "Weet wat je kunt en wil",
        body: "Je bent vrijwilliger, geen professional. Sommige taken vallen buiten jouw rol en dat is helemaal oké.",
      },
      {
        icon: "x-circle",
        title: "Zeg 'nee' als het nodig is",
        body: "Het is oké om iets niet te doen als het buiten je grenzen valt. Leg het rustig en vriendelijk uit.",
      },
      {
        icon: "phone-call",
        title: "Bespreek het met Careibu",
        body: "Voel je je ongemakkelijk of overbelast? Neem contact op met jouw begeleider. Zij helpen je graag.",
      },
      {
        icon: "sun",
        title: "Zorg goed voor jezelf",
        body: "Vrijwilligerswerk moet leuk en vol energie blijven. Pas op dat je niet te veel hooi op je vork neemt.",
      },
    ],
    callout:
      "Jij kunt alleen goed voor een ander zorgen als je ook goed voor jezelf zorgt.",
  },

  moeilijk: {
    id: "moeilijk",
    category: "Moeilijke momenten",
    icon: "heart",
    color: "#A01550",
    bg: "#FAE0EC",
    title: "Omgaan met moeilijke momenten",
    snippet: "Zo ga je om met zware of emotionele bezoeken.",
    readTime: "5 min",
    intro:
      "Soms heb je een zwaarder bezoek. De senior is somber, er is iets moeilijks gebeurd, of het gesprek loopt moeizaam. Dit is normaal en hoort bij vrijwilligerswerk.",
    tips: [
      {
        icon: "anchor",
        title: "Blijf kalm en aanwezig",
        body: "Je hoeft niets op te lossen. Gewoon aanwezig zijn en een luisterend oor bieden is vaak het meest waardevol.",
      },
      {
        icon: "message-circle",
        title: "Praat erover met je begeleider",
        body: "Moeilijke momenten hoef je niet alleen te dragen. Jouw Careibu-begeleider staat klaar om je te ondersteunen.",
      },
      {
        icon: "book-open",
        title: "Schrijf het op in je logboek",
        body: "Reflectie helpt. Noteer wat er is gebeurd en hoe je je voelde — dat helpt je groeien als vrijwilliger.",
      },
      {
        icon: "refresh-cw",
        title: "Geef niet te snel op",
        body: "Een moeilijke dag is geen slechte match. Geduld en consistentie zijn de kracht van een goede vrijwilliger.",
      },
    ],
    callout:
      "Er zijn moeilijke momenten in elke relatie. Wat telt, is dat je er bent.",
  },

  eenzaamheid: {
    id: "eenzaamheid",
    category: "Moeilijke momenten",
    icon: "wind",
    color: "#7B39A0",
    bg: "#F0E6F5",
    title: "Eenzaamheid herkennen & bespreekbaar maken",
    snippet: "Signalen herkennen en het gesprek op gang brengen.",
    readTime: "6 min",
    intro:
      "Veel senioren kampen met eenzaamheid. Als vrijwilliger kun jij een groot verschil maken — maar het helpt als je weet waar je op moet letten en hoe je het gesprek aangaat.",
    tips: [
      {
        icon: "eye",
        title: "Let op signalen",
        body: "Terugtrekken, negatief praten over de toekomst of weinig eten kunnen tekenen zijn van eenzaamheid.",
      },
      {
        icon: "help-circle",
        title: "Stel directe vragen",
        body: "Vraag gerust: 'Voel je je soms eenzaam?' Veel mensen zijn opgelucht als er openlijk naar gevraagd wordt.",
      },
      {
        icon: "sun",
        title: "Wees aanwezig, geen oplossing",
        body: "Je kunt eenzaamheid niet 'oplossen', maar jouw aanwezigheid maakt al een wereld van verschil.",
      },
      {
        icon: "phone",
        title: "Verwijs door als nodig",
        body: "Gaat het echt niet goed? Neem contact op met Careibu. Er zijn ook professionele hulpverleners beschikbaar.",
      },
    ],
    callout:
      "Jouw aanwezigheid is voor de senior waardevoller dan je misschien denkt.",
  },

  plannen: {
    id: "plannen",
    category: "Praktisch plannen",
    icon: "calendar",
    color: "#1A5EA8",
    bg: "#D6E4F5",
    title: "Je bezoek plannen",
    snippet: "Hoe plan je je bezoeken betrouwbaar en praktisch?",
    readTime: "2 min",
    intro:
      "Een goed geplande afspraak is het halve werk. Met de juiste voorbereiding verloopt elk bezoek soepel en prettig voor jullie allebei.",
    tips: [
      {
        icon: "repeat",
        title: "Spreek een vaste dag en tijd af",
        body: "Regelmaat geeft houvast aan de senior en voorkomt verwarring of miscommunicatie over wanneer je komt.",
      },
      {
        icon: "bell",
        title: "Bevestig de afspraak van tevoren",
        body: "Een kort berichtje of belletje de dag van tevoren geeft de senior zekerheid en iets om naar uit te kijken.",
      },
      {
        icon: "battery",
        title: "Houd rekening met energie",
        body: "Plan bezoeken niet te lang. 1 à 2 uur is voor veel senioren ideaal — kwaliteit boven kwantiteit.",
      },
      {
        icon: "activity",
        title: "Plan een alternatief bij ziekte",
        body: "Bespreek van tevoren wat jullie doen als een van jullie ziek is. Een telefoontje kan dan al heel veel betekenen.",
      },
    ],
    callout:
      "Regelmaat en betrouwbaarheid zijn de sleutels tot een fijne, duurzame samenwerking.",
  },

  gezondheid: {
    id: "gezondheid",
    category: "Gezondheid & welzijn",
    icon: "activity",
    color: "#2E7D6A",
    bg: "#E0F5EF",
    title: "Medicijnen en gezondheid: wat is jouw rol?",
    snippet: "Wat is jouw rol als vrijwilliger bij gezondheidsvragen?",
    readTime: "3 min",
    intro:
      "Als vrijwilliger heb je een ondersteunende rol — geen medische. Toch is het goed om te weten hoe je omgaat met gezondheidssituaties en wanneer je moet doorverwijzen.",
    tips: [
      {
        icon: "info",
        title: "Geen medisch advies geven",
        body: "Geef nooit advies over medicijnen of behandelingen. Verwijs altijd door naar de huisarts of mantelzorger.",
      },
      {
        icon: "eye",
        title: "Let op veranderingen",
        body: "Als je merkt dat de senior er anders uitziet, minder eet of minder mobiel is, noteer dit dan voor je begeleider.",
      },
      {
        icon: "phone-call",
        title: "Weet wanneer je belt",
        body: "Bij acuut gevaar bel je meteen 112. Bij zorgen over welzijn neem je contact op met Careibu.",
      },
      {
        icon: "clipboard",
        title: "Houd je logboek bij",
        body: "Schrijf gezondheidssignalen op in je logboek. Dit helpt bij continuïteit en bij eventuele overdracht aan professionals.",
      },
    ],
    callout:
      "Jij bent de ogen en oren — maar geen arts. Vertrouw op je gevoel en schakel tijdig hulp in.",
  },

  welzijn: {
    id: "welzijn",
    category: "Gezondheid & welzijn",
    icon: "thermometer",
    color: "#2E7D6A",
    bg: "#E0F5EF",
    title: "Wanneer vraag je om extra hulp?",
    snippet: "Wanneer is het tijd om extra hulp in te schakelen?",
    readTime: "2 min",
    intro:
      "Als vrijwilliger zie je de senior regelmatig en merk je soms dingen op die anderen missen. Weet wanneer je actie moet ondernemen.",
    tips: [
      {
        icon: "alert-triangle",
        title: "Vertrouw op je gevoel",
        body: "Als iets niet goed voelt, is dat een teken. Wacht niet te lang met het bespreken van zorgen.",
      },
      {
        icon: "users",
        title: "Schakel Careibu in",
        body: "Neem bij zorgen altijd contact op met je Careibu-begeleider. Zij coördineren verdere hulp.",
      },
      {
        icon: "phone",
        title: "Weet de noodcontacten",
        body: "Zorg dat je de contactgegevens van de mantelzorger en Careibu altijd bij de hand hebt.",
      },
      {
        icon: "check-circle",
        title: "Documenteer wat je ziet",
        body: "Houd bij wat je opvalt. Een goede beschrijving helpt professionals om snel te handelen.",
      },
    ],
    callout:
      "Vroeg signaleren redt levens. Aarzel niet om hulp in te schakelen als je twijfelt.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function KennisbankArtikelScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const article = ARTICLES[id ?? "gesprek"] ?? ARTICLES["gesprek"];

  return (
    <View style={styles.root}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: topPad }]}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={[styles.headerIconWrap, { backgroundColor: "rgba(255,255,255,0.2)" }]}>
            <Feather name={article.icon} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.categoryBadge}>
            <Typography style={styles.categoryBadgeText}>
              {article.category}
            </Typography>
          </View>
          <Typography variant="h4" style={styles.headerTitle}>
            {article.title}
          </Typography>
          <View style={styles.readTimeRow}>
            <Feather name="clock" size={12} color="rgba(255,255,255,0.75)" />
            <Typography style={styles.readTimeText}>
              {article.readTime} leestijd
            </Typography>
          </View>
        </View>

        <View style={styles.backBtn} />
      </View>

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.body,
          { paddingBottom: insets.bottom + 96 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1 — Intro */}
        <Card elevation={2} padding="md" style={{ gap: DS.spacing.sm }}>
          <Typography variant="h5">Inleiding</Typography>
          <Typography variant="body2" color="textSecondary" style={{ lineHeight: 22 }}>
            {article.intro}
          </Typography>
        </Card>

        {/* Card 2 — Tips */}
        <Card elevation={2} padding="md" style={{ gap: DS.spacing.md }}>
          <Typography variant="h5">Praktische tips</Typography>
          {article.tips.map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <View style={[styles.tipIconWrap, { backgroundColor: article.bg }]}>
                <Feather name={tip.icon} size={16} color={article.color} />
              </View>
              <View style={{ flex: 1, gap: DS.spacing.xxs }}>
                <Typography variant="subtitle1" style={{ fontWeight: "700", fontSize: 14 }}>
                  {tip.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ lineHeight: 20 }}>
                  {tip.body}
                </Typography>
              </View>
            </View>
          ))}
        </Card>

        {/* Card 3 — Callout */}
        <View style={[styles.calloutCard, { backgroundColor: article.bg }]}>
          <View style={styles.calloutRow}>
            <Feather name="bookmark" size={18} color={article.color} />
            <Typography variant="h5" style={{ color: article.color }}>
              Onthoud
            </Typography>
          </View>
          <Typography
            variant="body2"
            style={{ color: article.color, lineHeight: 22, opacity: 0.9 }}
          >
            {article.callout}
          </Typography>
        </View>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F2F3F5",
  },
  header: {
    backgroundColor: "#8CBFBB",
    paddingHorizontal: DS.spacing.lg,
    paddingBottom: DS.spacing.xl,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  backBtn: {
    width: 36,
    paddingTop: DS.spacing.xs,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    gap: DS.spacing.xs,
  },
  headerIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: DS.spacing.xxs,
  },
  categoryBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 20,
    paddingHorizontal: DS.spacing.sm,
    paddingVertical: 3,
  },
  categoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#FFFFFF",
    textAlign: "center",
  },
  readTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xxs,
  },
  readTimeText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
  },
  body: {
    padding: DS.spacing.lg,
    gap: DS.spacing.md,
  },
  tipRow: {
    flexDirection: "row",
    gap: DS.spacing.md,
    alignItems: "flex-start",
  },
  tipIconWrap: {
    width: 40,
    height: 40,
    borderRadius: DS.shape.radius.sm,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: 2,
  },
  calloutCard: {
    borderRadius: DS.shape.radius.md,
    padding: DS.spacing.lg,
    gap: DS.spacing.sm,
  },
  calloutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: DS.spacing.xs,
  },
});
