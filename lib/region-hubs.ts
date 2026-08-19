/**
 * Editorial content for the five region hubs.
 *
 * The recipe grid on a hub is driven by `getRecipesByRegion`, not by anything
 * here — this file supplies only the writing: the introduction, the glossary,
 * the source panel and the safety note.
 *
 * On sources: every entry is a citation that already ships on a recipe page in
 * `lib/recipe-safety.ts`, re-linked where the hub's safety note concerns the
 * same guidance. Nothing is cited that has not already been published on this
 * site. A hub with no such connection ships `sources: []`, and the panel says
 * so outright rather than implying evidence it does not have.
 */

import type { Hub } from './hubs'
import { fromSafetySource } from './hubs'
import {
  CDC_PRESERVATION_SOURCE,
  FDA_PARASITE_SOURCE,
  NORWAY_FISH_SOURCE,
  NORWAY_PREGNANCY_SOURCE,
  NORWAY_RAKFISK_SOURCE,
  RISK_GROUP_SOURCE,
} from './recipe-safety'
import type { RegionSlug } from './recipes'
import { HUB_CHECKED_DATE } from './site'

export const REGION_HUBS: Record<RegionSlug, Hub> = {
  sapmi: {
    title: 'Cooking to the calendar of eight seasons',
    metaTitle: 'Sápmi: Arctic Larders, Reindeer Herding and Smoke',
    metaDescription:
      'Sápmi as a food region: reindeer herding across eight seasons, smoke-cured ' +
        'suovas, gáhkku bread, cloudberries and the Arctic larder, in 14 recipes.',
    standfirst:
      'The Arctic homeland of the Sámi, cooked to a herding calendar of eight ' +
        'seasons — reindeer, freshwater fish, cloudberries, and everything the north ' +
        'knows about making autumn last until spring.',
    intro: [
      'Sápmi is not a Norwegian county and not a period in history. It is the ' +
        'homeland of the Sámi — an Indigenous people whose territory crosses northern ' +
        'Norway, Sweden and Finland and reaches into the Kola Peninsula — and the ' +
        'cooking that comes out of it belongs to a culture with living languages, its ' +
        'own institutions and its own working livelihoods. Reindeer herding is one of ' +
        'them, carried on here now rather than remembered. Gáhkku, the soft hearth ' +
        'bread, is baked on an ordinary weekday. Suovas is sold hot at winter ' +
        'markets. None of it is a re-enactment; it is simply the north, cooking.',
      'Herding sets the calendar. Reindeer move between inland winter pasture, ' +
        'where lichen is dug from beneath dry snow, and the coastal and mountain ' +
        'grazing of summer — a migration measured in tens or hundreds of kilometres ' +
        'depending on the district. The work is organised through the siida, the ' +
        'herding group that shares pasture and labour, and the year is commonly ' +
        'counted in eight seasons rather than four, because calving, marking, ' +
        'separation and slaughter are each held to be a time of their own. Most meat ' +
        'enters the household after the autumn slaughter. Much of what follows in ' +
        'this collection is, at bottom, a way of making autumn last until spring.',
      'An Arctic larder is narrow and deep. Reindeer carries most of it: bone-in ' +
        'cuts for bidos, the stew ladled out at weddings and midwinter gatherings; ' +
        'meat frozen and shaved thin for finnbiff; salted and smoked reindeer for ' +
        'suovas; trimmings bound with fat for reinsdyrpølse; and bones for the stock ' +
        'that stands behind much of the rest. Cold water supplies the fish — Arctic ' +
        'char and mountain trout from lakes that never really warm. The gathered ' +
        'layer is the third: cloudberries from the bogs, lingonberries and juniper ' +
        'from the heath, angelica — kvann in Norwegian — whose peeled stems were ' +
        'traditionally eaten green, and birch, which gives sap in spring, bark for ' +
        'vessels and smoke for the fire.',
      'Before refrigeration, four techniques did the preserving, and they were ' +
        'usually combined. Cold, dry inland air dries meat and fish without heat, ' +
        'which is why drying racks stand where the wind does. Salt, once trade made ' +
        'it affordable this far north, made that drying quicker and surer. Smoke over ' +
        'birch and alder both flavoured and dried; on the pages that follow it ' +
        'survives as flavour, in suovas and in cold-smoked røye. The winter itself ' +
        'served as an outdoor freezer for months at a stretch — the reason shaved ' +
        'frozen reindeer became a technique rather than a compromise. Berries were ' +
        'kept another way again: cloudberries were traditionally stored in water ' +
        'rather than in sugar. None of this is set down here as a method to copy — ' +
        'the recipes in this collection that touch cured or smoked food are written ' +
        'around professionally produced meat and fish, not around a home cure.',
      'It is worth saying what this collection is not. Sámi cooking is not a ' +
        'regional accent of a generic "Nordic" style, and the dishes that carry Sámi ' +
        'names keep them here: bidos — often written biđus in North Sámi — along with ' +
        'gáhkku and suovas. Nor is every recipe filed here Sámi. Kaffeost, cubes of ' +
        'baked cheese dropped into hot coffee, is shared with Kven and northern ' +
        'Finnish tradition; blodklubb is a northern Norwegian farm dish; fenalår is ' +
        'cured across Norway\'s mountain districts rather than in Sápmi in particular; ' +
        'and hjortestek is red deer, far more an animal of the western fjord country ' +
        'than of the Arctic. They are filed together, and reading them side by side ' +
        'is useful. Collapsing them into a single tradition is not.',
    ],
    glossary: [
      {
        term: 'Sápmi',
        definition:
          'The Sámi homeland, spanning northern Norway, Sweden and Finland and part of ' +
            'the Kola Peninsula. It is a cultural and political territory rather than the ' +
            'administrative region of any one state.',
      },
      {
        term: 'Bidos',
        definition:
          'Reindeer stew of bone-in meat, potato, carrot and onion in its own broth, ' +
            'associated with weddings, confirmations and midwinter gatherings. Often ' +
            'written biđus in North Sámi.',
      },
      {
        term: 'Suovas',
        definition:
          'Reindeer salted and smoked, then sliced thin and seared fast. The name comes ' +
            'from the Sámi word for smoke, and the meat is often folded into warm gáhkku.',
      },
      {
        term: 'Gáhkku',
        definition:
          'Soft Sámi hearth bread, lightly scented with anise or fennel, rolled flat, ' +
            'pricked all over with a fork and cooked on a dry griddle rather than baked ' +
            'in an oven.',
      },
      {
        term: 'Finnbiff',
        definition:
          'The Norwegian name for shaved reindeer seared hard and finished with ' +
            'mushrooms, cream and brown cheese. Everyday northern cooking rather than ' +
            'ceremonial food.',
      },
      {
        term: 'Reinsdyrskav',
        definition:
          'Reindeer frozen solid and shaved into paper-thin curls. It goes into the pan ' +
            'straight from frozen and in small batches, so the very lean meat sears ' +
            'rather than steams.',
      },
      {
        term: 'Multe',
        definition:
          'Norwegian for cloudberry, Rubus chamaemorus, the amber bog berry of the ' +
            'north. It ripens for only a few weeks of the northern summer, and is folded ' +
            'through whipped cream as multekrem.',
      },
      {
        term: 'Røye',
        definition:
          'Arctic char, a cold-water relative of trout and salmon found in northern ' +
            'lakes and rivers. Cold-smoked over alder it becomes røkt røye — on these ' +
            'pages a matter of flavour, not a way of keeping the fish.',
      },
      {
        term: 'Rype',
        definition:
          'Ptarmigan — willow grouse in the recipes here — the mountain game bird that ' +
            'turns white in winter. Very lean, so it is barded with bacon before it is ' +
            'browned and gently braised in rypestek.',
      },
      {
        term: 'Kaffeost',
        definition:
          'Cubes of firm baked curd cheese dropped into hot black coffee, where they ' +
            'soften and squeak. A tradition shared by northern Sámi and Kven households.',
      },
    ],
    sources: [fromSafetySource(NORWAY_PREGNANCY_SOURCE), fromSafetySource(RISK_GROUP_SOURCE)],
    checkedOn: HUB_CHECKED_DATE,
    safetyNote:
      'Two recipes here — fenalår and cold-smoked røye — are written around ' +
        'professionally produced meat and fish and carry their own food-safety ' +
        'callouts. This hub describes no curing or smoking method; read the callout ' +
        'on the recipe page before you buy, store or serve either.',
  },
  vestlandet: {
    title: 'Salt, Wind and Deep Water: Cooking the Western Fjords',
    metaTitle: 'Vestlandet: The Preserving Kitchen of Norway\'s Fjords',
    metaDescription:
      'Klippfisk, tørrfisk, pinnekjøtt and komle — how deep water, steep mountain ' +
        'farms and Atlantic weather built a preserving cuisine on Norway\'s western ' +
        'fjords.',
    standfirst:
      'Deep cold water on one side and near-vertical farmland on the other. The ' +
        'fjord coast built a cuisine of salt, wind, smoke and the long soak.',
    intro: [
      'Vestlandet is the part of Norway the sea reaches furthest into. Fjords cut ' +
        'inland a hundred kilometres and more, and they are deep: cold, saline water ' +
        'within rowing distance of farms hemmed in by rock. Cod come in on their ' +
        'winter spawning run as skrei; kveite, halibut, is traditionally the most ' +
        'prized white fish; blue mussels grow on ropes in water that stays cold all ' +
        'summer. The cooking is unhurried and plain in the best sense — cod poached ' +
        'just below a simmer with its own roe and liver, mussels opened under a lid ' +
        'in four minutes, a Bergen fish soup balanced with vinegar and sugar until it ' +
        'tastes bright rather than rich.',
      'Salt and moving air did the rest, and the region\'s two preserving trades are ' +
        'not the same thing. Tørrfisk — stockfish — is cod split and hung on wooden ' +
        'racks to dry in cold air, unsalted. Klippfisk is cod salted in stacks first ' +
        'and dried afterwards. Both keep for months without refrigeration, and both ' +
        'turned western ports into trading towns. Bergen, in most accounts, was where ' +
        'the northern dried fish was gathered and sold on, its German merchants ' +
        'holding the trade for centuries. Klippfisk belongs more particularly to the ' +
        'Nordmøre and Sunnmøre coast. The return cargoes mattered as much as the ' +
        'outbound: trade with Spain and Portugal carried tomatoes, peppers and olive ' +
        'oil into Norwegian kitchens, and bacalao came of it.',
      'Preserved fish is never the finished dish but the raw material for a slower ' +
        'one: tørrfisk wants seven to ten days in cold water, changed daily, before ' +
        'it will poach. Steeped in a lye bath instead, stockfish becomes lutefisk, ' +
        'the translucent Advent dish that divides every table it lands on. Persetorsk ' +
        'sits at the gentle end of that reasoning, cod salted and pressed under ' +
        'weight for hours; plukkfisk at the thrifty end, yesterday\'s cod and potato ' +
        'folded back into a white sauce.',
      'The relief that makes the fjords deep makes farming hard. Holdings run in ' +
        'narrow strips up the valley sides, and ground that will not take a plough ' +
        'will take sheep. Summer pasture high on the mountain, autumn slaughter, then ' +
        'months of salt, smoke and drying air — that sequence sits behind nearly ' +
        'every cured meat in the west. Pinnekjøtt, stick meat, is salted and often ' +
        'smoked mutton or lamb ribs, soaked about a day and steamed over peeled birch ' +
        'branches until the meat leaves the bone. Smalahove, the smoked sheep\'s head ' +
        'associated with Voss, comes of the same refusal to waste an animal, as does ' +
        'vossakorv, the valley\'s syrup-sweetened, birch-smoked sausage. A spekemat ' +
        'board is the summer face of that year.',
      'The potato arrived late and settled hard. Along this coast it produced a ' +
        'dumpling belt with almost as many names as parishes — raspeballer, komle, ' +
        'kompe, potetball — raw potato grated and wrung dry, bound with barley and ' +
        'wheat flour, commonly with salt pork in the middle, simmered in salted-meat ' +
        'broth. Filling food from very little, still a working Thursday fixture ' +
        'rather than a museum piece.',
      'What holds it together is weather. The west takes the Atlantic first and a ' +
        'great deal of it — poor weather for drying in the sun, good weather for cold ' +
        'wind-drying, salting, smoke and the covered pot. It is why so much of the ' +
        'western repertoire comes in two stages: something put by months ago, brought ' +
        'back with a long soak, a slow steam, a bare simmer. The sixteen recipes here ' +
        'follow that order — what the water gives fresh, what was kept, what came off ' +
        'the mountain farms, and what the potato made of the rest.',
    ],
    glossary: [
      {
        term: 'klippfisk',
        definition:
          'Cod split, salted in stacks and then dried until hard. It keeps without ' +
            'refrigeration and needs a day or more of soaking in fresh water before ' +
            'cooking; the base of Norwegian bacalao.',
      },
      {
        term: 'tørrfisk',
        definition:
          'Stockfish: cod split and hung on wooden racks to dry in cold air without ' +
            'salt. Reconstituting it takes a week or more of daily water changes before ' +
            'it will poach.',
      },
      {
        term: 'lutefisk',
        definition:
          'Dried stockfish rehydrated and then steeped in a lye solution until the ' +
            'flesh turns translucent and gelatinous. Rinsed at length and baked or ' +
            'poached; a fixture of the Norwegian Advent.',
      },
      {
        term: 'persetorsk',
        definition:
          'Pressed cod: fresh fillets rubbed with salt and sugar and weighted under a ' +
            'press for a few hours, then poached. The point is a firm, silky flake, not ' +
            'preservation.',
      },
      {
        term: 'plukkfisk',
        definition:
          'Literally plucked fish. Cooked cod and boiled potato broken up together into ' +
            'a white sauce, often with leek and bacon, and made from the previous day\'s ' +
            'leftovers.',
      },
      {
        term: 'pinnekjøtt',
        definition:
          'Stick meat: salted, dried and often smoked mutton or lamb ribs, soaked about ' +
            'a day to shed the cure, then steamed over peeled birch sticks until the meat ' +
            'slips from the bone.',
      },
      {
        term: 'smalahove',
        definition:
          'A salted and smoked sheep\'s head, soaked overnight and simmered for several ' +
            'hours, then served whole with rutabaga mash and potatoes. Associated above ' +
            'all with Voss.',
      },
      {
        term: 'vossakorv',
        definition:
          'A lightly smoked sausage from the Voss valley of lamb and beef, faintly ' +
            'sweetened with syrup. Poached gently rather than boiled, sliced thick and ' +
            'served with potato and rutabaga mash.',
      },
      {
        term: 'spekemat',
        definition:
          'A board of air-dried, salt-cured meats — lamb, ham and sausage — sliced thin ' +
            'and eaten with flatbrød, sour cream and scrambled egg. Bought ready to eat ' +
            'rather than home-cured.',
      },
      {
        term: 'raspeballer (komle)',
        definition:
          'Potato dumplings of raw potato grated and wrung dry, bound with barley and ' +
            'wheat flour, often stuffed with salt pork and simmered in broth. Known ' +
            'regionally as komle, kompe and potetball.',
      },
    ],
    sources: [fromSafetySource(FDA_PARASITE_SOURCE), fromSafetySource(RISK_GROUP_SOURCE)],
    checkedOn: HUB_CHECKED_DATE,
    safetyNote:
      'Gravlaks is raw cured fish and spekemat is ready-to-eat cured meat. Salt and ' +
        'sugar curing does not cook fish or reliably destroy parasites, and both ' +
        'recipes carry food-safety callouts on their own pages with links to ' +
        'public-health authorities. Read the callout before preparing either.',
  },
  sorlandet: {
    title: 'Sørlandet: The Coast That Eats Outdoors',
    metaTitle: 'Sørlandet: shellfish, skerries and white towns',
    metaDescription:
      'Norway\'s southern coast: prawns, crab and lobster from the skerries, summer ' +
        'mackerel, herring, and the baking of the white timber towns of Agder.',
    standfirst:
      'Skerries, shallow sun-warmed channels and white timber towns: the coast that ' +
        'eats shellfish outdoors all summer and bakes like the trading port it was.',
    intro: [
      'Sørlandet faces the Skagerrak, broadly corresponding to Agder, where the ' +
        'bedrock tilts into the water and breaks into a skerry archipelago — low ' +
        'rounded islands, holms and half-submerged rocks screening the mainland from ' +
        'open sea. The channels between them are shallow, sheltered and, by Norwegian ' +
        'standards, comparatively warm through the summer. That single fact does most ' +
        'of the work in the kitchen. Where Vestlandet fishes deep cold water for cod ' +
        'and halibut, the south works a shallower shelf, and it eats outdoors — on a ' +
        'jetty, at a garden table — through the summer months.',
      'Shellfish is the region\'s summer currency. Reker, small coldwater prawns, ' +
        'are sold ready-boiled and shell-on, straight off the boat, then peeled by ' +
        'hand onto buttered bread with mayonnaise, dill and lemon — an afternoon ' +
        'rather than a meal. Krabbe, the brown crab, comes into its own as the water ' +
        'cools: boiled whole in well-salted water, cooled on its back, cracked open ' +
        'over newspaper. Blåskjell, blue mussels, cling to the rocks at low tide. And ' +
        'hummer, the European lobster, is the catch the coast counts down to. Lobster ' +
        'fishing is regulated rather than casual: national rules govern when the ' +
        'fishery is open, and set requirements for registration, permitted gear and ' +
        'landing size that bind recreational fishers as well as commercial ones. ' +
        'Those rules change, and the version in force comes from the Norwegian ' +
        'Directorate of Fisheries rather than from a recipe page.',
      'Makrell is the other face of the warmer water. Mackerel shoal inshore in ' +
        'summer, oily and quick to spoil, so the traditional treatment is immediate — ' +
        'fillets dredged in seasoned flour, fried in foaming butter until the skin ' +
        'crisps, then cut with something sour: rhubarb stewed down, or thin-shaved ' +
        'cucumber quickly pickled. Beneath the celebrated catches runs a quieter ' +
        'register. Fiskegrateng stretches a modest piece of boiled cod with macaroni ' +
        'and nutmeg-scented white sauce, lightened with whipped egg white and baked ' +
        'under breadcrumbs. The cold table leans on herring: sursild, salt herring ' +
        'steeped in a sweet-sour brine with allspice, mustard seed and bay, and ' +
        'sildesalat, pickled herring diced with beetroot, apple and waxy potato, ' +
        'folded through soured cream until it turns rose pink.',
      'The towns are the other half of the story. Risør, Arendal, Grimstad, ' +
        'Lillesand, Mandal — white-painted timber houses stacked tight around narrow ' +
        'harbours, gables to the water. In most accounts the money that built them ' +
        'came from forest and sail: timber floated down from the interior, wooden ' +
        'ships built along the skerries, and by the nineteenth century a merchant ' +
        'fleet working out of harbours too small to look the part. Trade like that ' +
        'carries sugar, coffee, almonds and cardamom into ordinary kitchens, and the ' +
        'baking still reads that way. Kavring belongs to it outright: sweet cardamom ' +
        'rolls split while warm and dried for hours in a low oven until they snap ' +
        'rather than bend, after which they keep for weeks. It is usually told as ' +
        'ship\'s bread made agreeable.',
      'The coffee table is where the region spends that inheritance, though much of ' +
        'what sits on it is national rather than southern — the celebration ' +
        'repertoire as this coast keeps it. Eplekake sinks tart apple slices upright ' +
        'into a buttery sponge under cinnamon and pearl sugar. Kokosboller — meringue ' +
        'domes set with gelatine on a wafer base, dipped in dark chocolate and rolled ' +
        'in coconut — are a kiosk fixture that also gets made at home. Fyrstekake, ' +
        'almond filling under a short pastry lattice, keeps a week and improves for ' +
        'it. Then the cakes kept for occasions: bløtkake, sponge moistened with milk ' +
        'and layered with cream, custard, jam and berries; verdens beste, literally ' +
        '"the world\'s best", also called kvæfjordkake and generally associated with ' +
        'northern Norway rather than this coast, a sponge baked under a lid of ' +
        'crackling almond meringue and sandwiched with vanilla cream; and kransekake, ' +
        'eighteen graduated almond rings laced into a tower with royal icing, on this ' +
        'coast often built around a hidden bottle or wrapped sweets.',
    ],
    glossary: [
      {
        term: 'Reker',
        definition:
          'Prawns or shrimp. On the south coast the word means small coldwater prawns, ' +
            'sold ready-boiled and shell-on, then peeled at the table onto buttered bread ' +
            'with mayonnaise, dill and lemon.',
      },
      {
        term: 'Krabbe',
        definition:
          'Crab. The southern pots take taskekrabbe, the brown crab, boiled whole in ' +
            'well-salted water, cooled on its back and picked for both brown and white ' +
            'meat.',
      },
      {
        term: 'Hummer',
        definition:
          'European lobster, fished off the southern skerries. The fishery is governed ' +
            'by national rules covering when it is open, who must register, what gear is ' +
            'permitted and what size may be landed; these bind recreational fishers as ' +
            'well as commercial ones. The Norwegian Directorate of Fisheries publishes ' +
            'the rules in force.',
      },
      {
        term: 'Blåskjell',
        definition:
          'Blue mussels, which grow on rock and rope along the skerries and steam open ' +
            'in minutes. No mussel recipe is linked from this hub; Norcook\'s steamed ' +
            'blåskjell sits with the western coast.',
      },
      {
        term: 'Makrell',
        definition:
          'Mackerel. An oily, fast-spoiling fish that shoals inshore along the ' +
            'Skagerrak in summer, usually floured and fried skin-side down, then served ' +
            'with something sour to cut it.',
      },
      {
        term: 'Sursild',
        definition:
          'Soured, sweet-pickled herring. Salted herring soaked to draw out salt, then ' +
            'steeped in a cooled brine of vinegar, sugar, allspice, mustard seed and bay. ' +
            'A refrigerated pickle rather than a shelf-stable preserve.',
      },
      {
        term: 'Kavring',
        definition:
          'A twice-baked rusk. Sweet cardamom rolls are baked, split while warm, then ' +
            'dried for hours in a low oven until crisp through, after which they keep for ' +
            'weeks.',
      },
      {
        term: 'Fyrstekake',
        definition:
          'Literally prince\'s cake. A short butter pastry shell holding a thick almond ' +
            'and icing-sugar filling, closed with a lattice of pastry strips and glazed ' +
            'with beaten egg.',
      },
      {
        term: 'Bløtkake',
        definition:
          'Literally soft cake. Sponge cut into layers, moistened with milk, filled ' +
            'with whipped cream, vanilla custard and jam, then covered in cream and fresh ' +
            'summer berries.',
      },
      {
        term: 'Kransekake',
        definition:
          'Wreath cake. Eighteen graduated rings of ground almond, icing sugar and egg ' +
            'white, baked barely coloured and stacked into a tower bound with piped royal ' +
            'icing.',
      },
    ],
    sources: [fromSafetySource(CDC_PRESERVATION_SOURCE), fromSafetySource(RISK_GROUP_SOURCE)],
    checkedOn: HUB_CHECKED_DATE,
    safetyNote:
      'Sursild is a refrigerated pickle made from commercially salted herring, not ' +
        'a shelf-stable canning method, and carries a food-safety callout on its own ' +
        'page. Lobster fishing is regulated: the rules in force come from the ' +
        'Norwegian Directorate of Fisheries, not from a recipe page.',
  },
  ostlandet: {
    title: 'The Larder East of the Mountains',
    metaTitle: 'Østlandet: The Larder East of the Mountains',
    metaDescription:
      'Norway\'s eastern valleys cook from grain, dairy and forest — 16 inland ' +
        'recipes, from rømmegrøt and lapskaus to rakfisk, ribbe and the Christmas ' +
        'table.',
    standfirst:
      'No sea and no salt air. The eastern valleys cook from grain, dairy, forest ' +
        'and freshwater — and from whatever the cold cellar still holds in February.',
    intro: [
      'Østlandet is the Norway that lies east of the mountains — the long valleys ' +
        'of Gudbrandsdalen, Østerdalen, Hallingdal and Valdres, the grain country ' +
        'around Lake Mjøsa, and the spruce forest running on towards the Swedish ' +
        'border. There is no daily catch here and no salt air. The larder is built ' +
        'instead from what a farm can grow, fatten and store, from the forest, and ' +
        'from fish that live in fresh water.',
      'Winter is long and the growing season short, so the eastern kitchen has ' +
        'always been a kitchen of keeping. Barley — bygg — handles the cold better ' +
        'than wheat and turns up as the body of a soup rather than as bread. Roots ' +
        'went into the cold cellar: potatoes, carrots, kålrot, cabbage. Pork and ' +
        'mutton were salted, smoked or dried, and peas were dried yellow. Betasuppe, ' +
        'kjøttsuppe and ertesuppe are versions of one arithmetic — a cured joint, a ' +
        'handful of grain or pulse, and whatever the cellar still held in February. ' +
        'Lapskaus applies the same thinking without ceremony: the week\'s meat and ' +
        'roots cooked until the potato collapses and thickens the pot by itself.',
      'Dairy is the other half. Cattle and goats moved up to the seter, the summer ' +
        'mountain farm, where milk became butter, cheese and rømme — thick soured ' +
        'cream. Rømmegrøt, in which high-fat seterrømme is cooked with flour until ' +
        'its butterfat separates into a golden pool, is the plainest expression of ' +
        'that surplus, and it still belongs to festivals rather than to weekday ' +
        'meals. Baking followed the same logic of storage: flatbrød, rolled ' +
        'paper-thin and baked crisp, keeps for months in a stack, and lefse is its ' +
        'soft cousin, rolled thin with a grooved pin. Flatbrød is not a garnish here ' +
        '— it is what you eat rakfisk on, and what you tear beside a bowl of lapskaus ' +
        'or betasuppe.',
      'The inland waters do the work the sea does on the coast. Mjøsa, ' +
        'Randsfjorden, the Valdres mountain lakes and the Glomma river system hold ' +
        'trout, char, perch and pike between them, and out of them comes the region\'s ' +
        'most divisive dish: rakfisk, trout or char salted and fermented cold through ' +
        'the autumn, then eaten raw with flatbrød, sour cream and raw onion. By ' +
        'tradition it belongs to the weeks before Christmas. The forest supplies the ' +
        'rest — elk and roe deer in the autumn hunt, forest birds, and the berries ' +
        'that season everything from blood pudding to a Sunday roast.',
      'The autumn slaughter set the rhythm of the year, and nothing was wasted: ' +
        'blodpudding baked from blood, barley flour and suet, then sliced and fried ' +
        'the next day with lingonberries, and medisterkaker shaped from the pork ' +
        'trim. The Christmas table that follows is emphatically eastern — ribbe ' +
        'roasted until the rind blisters, svinestek for a Sunday, surkål braised with ' +
        'caraway to cut the fat, and riskrem, the morning\'s leftover rice porridge ' +
        'folded into whipped cream with a whole almond hidden in it. Tilslørte ' +
        'bondepiker performs the same thrift with windfall apples and stale bread. ' +
        'Sodd, a clear broth of mutton and beef, is the one dish here cooked for an ' +
        'occasion rather than a season.',
      'One entry on this list is not ordinary cooking. Rakfisk is raw fermented ' +
        'fish, and it carries its own food-safety callout on its recipe page, with ' +
        'links to public-health authorities. The cured meats that share its table — ' +
        'spekemat, fenalår — carry callouts of their own elsewhere on the site. This ' +
        'hub points you to them rather than restating any preservation method; read ' +
        'the callout on the recipe page before you buy, store or serve.',
    ],
    glossary: [
      {
        term: 'Rømme',
        definition:
          'Norwegian soured cream, thicker and higher in fat than most sour creams. ' +
            'Seterrømme, the version from a summer mountain farm, carries enough ' +
            'butterfat to separate when cooked.',
      },
      {
        term: 'Rømmegrøt',
        definition:
          'A porridge made by cooking high-fat soured cream with flour until the ' +
            'butterfat rises and is spooned off, then thinning it with milk. Served with ' +
            'sugar and cinnamon.',
      },
      {
        term: 'Flatbrød',
        definition:
          'Unleavened flatbread rolled paper-thin and baked crisp, so it keeps for ' +
            'months in a stack. In the east it is eaten under rakfisk and beside stews ' +
            'and soups.',
      },
      {
        term: 'Bygg',
        definition:
          'Barley, the inland grain that tolerates a short season better than wheat. ' +
            'It gives body to the valley soups and stands in for wheat flour in ' +
            'blodpudding.',
      },
      {
        term: 'Kålrot',
        definition:
          'Swede, called rutabaga in North America — a dense yellow root that keeps ' +
            'through winter in a cold cellar. It is cubed into lapskaus, kjøttsuppe and ' +
            'betasuppe.',
      },
      {
        term: 'Lapskaus',
        definition:
          'A thick everyday stew of meat and roots simmered until the potato breaks ' +
            'down and thickens it. Brun lapskaus is browned first; lys lapskaus is left ' +
            'pale.',
      },
      {
        term: 'Kjøttkaker',
        definition:
          'Large beef patties, coarser than a meatball, bound with milk-soaked ' +
            'breadcrumb and seasoned with nutmeg and ginger, then braised in brown gravy ' +
            'and served with lingonberry.',
      },
      {
        term: 'Betasuppe',
        definition:
          'A thick one-pot soup of cured lamb or ham with leek and cellar roots — ' +
            'winter food assembled from what was already salted and stored.',
      },
      {
        term: 'Sodd',
        definition:
          'A clear celebration broth of mutton and beef carrying small meatballs, ' +
            'soddboller, with neatly cut potato and carrot. Traditionally served at ' +
            'confirmations and weddings.',
      },
      {
        term: 'Rakfisk',
        definition:
          'Trout or char salted and fermented cold for months, then eaten raw with ' +
            'flatbrød, sour cream and onion. Its recipe page carries the food-safety ' +
            'callout for this method.',
      },
    ],
    sources: [fromSafetySource(NORWAY_RAKFISK_SOURCE), fromSafetySource(NORWAY_FISH_SOURCE), fromSafetySource(CDC_PRESERVATION_SOURCE)],
    checkedOn: HUB_CHECKED_DATE,
    safetyNote:
      'Rakfisk is raw fermented fish and carries a food-safety callout on its own ' +
        'page, as do the cured meats that share its table. This hub points you to ' +
        'those callouts and deliberately restates no preservation method; read them ' +
        'before you buy, store or serve.',
  },
  'modern-viral': {
    title: 'The bakes that travelled',
    metaTitle: 'Modern Viral Baking: Cardamom, Butter and the Seven Sorts',
    metaDescription:
      'Skillingsboller, kanelsnurrer, skolebrød and the Christmas seven sorts — 17 ' +
        'Norwegian bakes, from the cardamom buns that travelled to the biscuits that ' +
        'stayed home.',
    standfirst:
      'A baking category rather than a place: the cardamom-and-butter grammar that ' +
        'carried Norwegian buns onto screens everywhere, and the older festive canon ' +
        'sitting underneath it.',
    intro: [
      'This is the one collection here that is not a region. Norway\'s other four ' +
        'are geography — a coast, a valley system, an archipelago, an Arctic ' +
        'homeland. This one is a shelf: the Norwegian baking that people outside ' +
        'Norway are most likely to have met, together with the older festive canon it ' +
        'grew out of. Grouping it that way is a choice about how the archive reads, ' +
        'not a claim that these bakes belong to no particular place. Lefse is very ' +
        'much a farm bread of the eastern valleys; the skillingsbolle is Bergen\'s; ' +
        'the Christmas biscuits belong to whichever kitchen baked them.',
      'What binds the modern half is a grammar rather than a recipe. An enriched ' +
        'wheat dough, milk and butter worked in until it is soft enough to be almost ' +
        'slack, freshly ground cardamom, a long slow prove, and a filling of butter ' +
        'creamed with sugar and cinnamon. Change the shape and you change the name: ' +
        'coiled flat for a skillingsbolle, knotted for a kanelsnurr, rolled round for ' +
        'a kardemommebolle, split and filled with vanilla custard and coconut for a ' +
        'skolebrød. The dough underneath is close to the same one, which is why ' +
        'learning it once opens most of this collection.',
      'Cardamom is the ingredient doing the heavy lifting, and it is worth being ' +
        'specific about why. Ground cardamom loses its volatile citrus-eucalyptus ' +
        'note within weeks; whole green pods cracked and ground just before mixing do ' +
        'not. Nearly every recipe here that tastes distinctly Norwegian rather than ' +
        'generically sweet tastes that way because of that one step. Pearl sugar, ' +
        'brunost and thick soured cream do the rest of the regional work.',
      'The other half of this shelf is older and, in Norway, more deeply set: the ' +
        'syv slag, the seven sorts of small Christmas biscuit a household was once ' +
        'expected to have ready before the holiday. Berlinerkranser looped from ' +
        'hard-boiled egg yolk dough, serinakaker pressed with a fork and scattered ' +
        'with almond, sandkaker moulded into fluted tins, goro and krumkake baked on ' +
        'decorated irons that leave their pattern in the surface, fattigmann cut into ' +
        'diamonds and fried. They are small, dry and made in quantity because they ' +
        'were made to keep, and the tradition is about the tin as much as the ' +
        'biscuit.',
      'A word on the name. "Viral" here is a fact about distribution — these are ' +
        'the bakes that travelled — and nothing more. It is not a ranking, a quality ' +
        'claim, or a statement that they are better, more authentic or more popular ' +
        'than anything in the other four collections. Norcook does not rate recipes ' +
        'and does not publish view counts or popularity figures. What can honestly be ' +
        'said is that a photograph of a cross-sectioned cardamom bun carries further ' +
        'than a photograph of a bowl of rømmegrøt, and that this collection is where ' +
        'the archive keeps the ones it carried.',
    ],
    glossary: [
      {
        term: 'Kardemomme',
        definition:
          'Cardamom. Bought as whole green pods and cracked and ground immediately ' +
            'before use; the pre-ground powder loses its citrus note within weeks and ' +
            'takes most of the character with it.',
      },
      {
        term: 'Perlesukker',
        definition:
          'Pearl sugar. Coarse white nibs that hold their shape in the oven, scattered ' +
            'over egg-washed buns and cakes for crunch and a matt-white finish rather ' +
            'than sweetness.',
      },
      {
        term: 'Skillingsbolle',
        definition:
          'The "shilling bun" of Bergen, named for the coin it once cost: a cardamom ' +
            'dough coiled flat around butter, sugar and cinnamon, and baked so the centre ' +
            'stays soft.',
      },
      {
        term: 'Syv slag',
        definition:
          'The "seven sorts": the small Christmas biscuits a household was ' +
            'traditionally expected to have baked before the holiday. Which seven varies ' +
            'by family and region.',
      },
      {
        term: 'Brunost',
        definition:
          'Brown cheese. Whey boiled down until its milk sugars caramelise into a firm, ' +
            'fudge-coloured block, shaved thin with a cheese slicer over waffles and ' +
            'flatbread.',
      },
      {
        term: 'Vaniljekrem',
        definition:
          'Vanilla custard thickened with egg yolk and cornflour. The filling in ' +
            'skolebrød and the layer inside bløtkake and many filled buns.',
      },
      {
        term: 'Lefse',
        definition:
          'Soft flatbread rolled very thin with a grooved pin and baked on a dry ' +
            'griddle. Depending on region it is sweet and buttered, or plain and wrapped ' +
            'around savoury food.',
      },
      {
        term: 'Krumkake',
        definition:
          'A thin batter biscuit baked on a patterned iron and rolled around a cone ' +
            'while still hot and pliable; it sets crisp within seconds and cannot be ' +
            'shaped once cool.',
      },
      {
        term: 'Fattigmann',
        definition:
          '"Poor man\'s" biscuit: a cardamom-scented dough enriched with cream and egg ' +
            'yolk, cut into diamonds, slit and threaded, then fried rather than baked.',
      },
      {
        term: 'Solskinnsbolle',
        definition:
          '"Sunshine bun": a cardamom bun opened out flat with a well of vanilla ' +
            'custard in the middle, which sets to a pale yellow disc as it bakes.',
      },
    ],
    sources: [],
    checkedOn: HUB_CHECKED_DATE,
  },
}
