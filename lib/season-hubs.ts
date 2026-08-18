/**
 * Editorial content for the seasonal hubs.
 *
 * Unlike a region hub, a season hub names its own recipes: `recipeSlugs` is the
 * curated list and drives the grid. A recipe is only listed here when its own
 * description or history text in `lib/recipes.ts` already places it in that
 * season. Nothing is reassigned to fill out a list.
 *
 * Two hubs the 10 Aug 2026 audit asked for are deliberately absent. "Spring
 * seafood" has no support at all in this archive — not one of the 77 recipes
 * places itself in spring — and "summer berries" has exactly one berry-centred
 * recipe. Publishing either would mean inventing seasonality on a site whose
 * content gate exists to stop precisely that. They stay unbuilt until the
 * archive earns them.
 *
 * On sources: see the note in `region-hubs.ts` — hubs re-link only citations
 * that already ship on a recipe page.
 */

import type { Hub } from './hubs'
import { fromSafetySource } from './hubs'
import {
  CDC_PRESERVATION_SOURCE,
  NORWAY_RAKFISK_SOURCE,
  RISK_GROUP_SOURCE,
} from './recipe-safety'
import { CONTENT_REVIEW_DATE } from './site'

export const SEASON_SLUGS = ['jul', 'host'] as const

export type SeasonSlug = (typeof SEASON_SLUGS)[number]

export type SeasonHub = Hub & {
  /** Curated, in reading order. Every slug must exist in `lib/recipes.ts`. */
  recipeSlugs: string[]
}

export const SEASON_HUBS: Record<SeasonSlug, SeasonHub> = {
  jul: {
    title: 'Julemat: the table Norway keeps',
    metaTitle: 'Norwegian Christmas Food: Ribbe, Pinnekjøtt and the Seven Sorts',
    metaDescription:
      'Norway\'s Christmas table, region by region: ribbe, pinnekjøtt and lutefisk ' +
        'on julaften, the cured cold table, riskrem, and the seven sorts of Christmas ' +
        'biscuit.',
    standfirst:
      'Twenty recipes from the archive whose own pages already place them at ' +
        'Christmas — the julaften main course, the cold table, and the baking that ' +
        'starts weeks before.',
    intro: [
      'No single dish is Norwegian Christmas dinner. Julaften — Christmas Eve, when ' +
        'the meal is eaten — is settled by region and by family, and the three ' +
        'candidates rarely appear on the same table. Ribbe, pork belly roasted until ' +
        'the rind blisters into crackling, holds most of the east and the south. ' +
        'Pinnekjøtt, salted and often smoked mutton ribs steamed over birch sticks, ' +
        'holds the west. Lutefisk, stockfish returned from a lye bath to something ' +
        'translucent and trembling, holds a smaller and more devoted constituency, ' +
        'and is as likely to be eaten at an office julebord in Advent as on the night ' +
        'itself. Households that have moved keep arguing about it for a generation.',
      'The sides do more work than the centrepiece. Surkål — cabbage braised slowly ' +
        'with caraway, vinegar and a little sugar — is there to cut fat, and so is ' +
        'the lingonberry beside it. Medisterkaker, soft pork patties seasoned with ' +
        'ginger and nutmeg, and medisterpølse alongside them, come from the same ' +
        'animal as the ribbe and were once the reason nothing was wasted from it. ' +
        'Boiled almond potatoes, a pan gravy made from the roasting tin, and stewed ' +
        'peas complete a plate that is deliberately plain around a very rich middle.',
      'Before any of that comes the cold table. The julebord — the Christmas table, ' +
        'and by extension the Christmas party — leans on things preserved months ' +
        'earlier: cured and dried meats, fenalår among them, sildesalat pink with ' +
        'beetroot, and the pickled herrings. Rakfisk, trout fermented cold through ' +
        'the autumn, belongs specifically to the weeks before Christmas rather than ' +
        'to the day, and is the item most likely to divide a room. Several of these ' +
        'are safety-sensitive; the callouts on their own pages are the place to read ' +
        'before buying or serving them.',
      'The baking starts weeks ahead and is the part most people actually inherit. ' +
        'Julekake, a cardamom bread studded with raisins and candied peel, is the ' +
        'loaf of the season. Then the syv slag — the seven sorts of small biscuit a ' +
        'household was once expected to have ready: pepperkaker rolled paper-thin ' +
        'into hearts and pigs, krumkake and goro baked on patterned irons, ' +
        'berlinerkranser looped from a dough enriched with sieved hard-boiled yolk, ' +
        'serinakaker forked and scattered with almond, sandkaker pressed into fluted ' +
        'tins, fattigmann cut, threaded and fried. Which seven is a family question. ' +
        'That there should be seven is the tradition.',
      'Dessert is riskrem, and it is a leftovers dish by design. Rice porridge ' +
        'cooked earlier — traditionally with a bowl set outside for the fjøsnisse, ' +
        'the barn spirit — is cooled and folded into whipped cream, served with a hot ' +
        'red berry sauce. A single blanched almond is hidden in the bowl, and whoever ' +
        'finds it wins a marzipan pig. Winning it and saying nothing until the last ' +
        'serving has been dished up is, in many families, considered the correct way ' +
        'to play.',
      'This collection gathers the twenty recipes in the archive whose own text ' +
        'already names Christmas, Advent or the seven sorts. Dishes that belong to ' +
        'the season in practice but that the archive places elsewhere in the year ' +
        'have been left out rather than reassigned.',
    ],
    glossary: [
      {
        term: 'Julaften',
        definition:
          'Christmas Eve, 24 December — when the main Christmas meal is eaten in ' +
            'Norway, rather than on Christmas Day as in Britain or the United States.',
      },
      {
        term: 'Ribbe',
        definition:
          'Pork belly on the bone, scored through the rind and roasted long and slow, ' +
            'then finished under fierce heat so the rind puffs into crackling across the ' +
            'whole surface.',
      },
      {
        term: 'Pinnekjøtt',
        definition:
          '"Stick meat": salted and often smoked mutton or lamb ribs, soaked to draw ' +
            'out the salt and then steamed over a rack of peeled birch branches until the ' +
            'meat leaves the bone.',
      },
      {
        term: 'Lutefisk',
        definition:
          'Dried stockfish rehydrated in a lye solution and then in fresh water, which ' +
            'turns it translucent and gelatinous. Bought ready to cook; the lye stage is ' +
            'a producer process.',
      },
      {
        term: 'Julebord',
        definition:
          'The Christmas table, and by extension the Christmas party — the cold-table ' +
            'spread of cured meats, herrings and salads eaten through Advent rather than ' +
            'on julaften itself.',
      },
      {
        term: 'Syv slag',
        definition:
          'The "seven sorts": the small Christmas biscuits a household was ' +
            'traditionally expected to have baked before the holiday. Which seven is a ' +
            'family matter.',
      },
      {
        term: 'Surkål',
        definition:
          'Cabbage braised down with caraway, vinegar and a little sugar. Sharp and ' +
            'soft, it sits beside the roast pork to cut its richness; not the same thing ' +
            'as German sauerkraut.',
      },
      {
        term: 'Riskrem',
        definition:
          'Cold rice porridge folded into whipped cream and served with hot berry ' +
            'sauce. A single blanched almond is hidden in the bowl and the finder wins a ' +
            'marzipan pig.',
      },
      {
        term: 'Sildesalat',
        definition:
          'Pickled herring diced with beetroot, apple and waxy potato and bound with ' +
            'soured cream, which turns it rose pink. A fixture of the cold table.',
      },
      {
        term: 'Fjøsnisse',
        definition:
          'The barn spirit of Norwegian folklore, to whom a bowl of rice porridge is ' +
            'traditionally set out at Christmas so that he leaves the farm and its ' +
            'animals in peace.',
      },
    ],
    sources: [fromSafetySource(NORWAY_RAKFISK_SOURCE), fromSafetySource(CDC_PRESERVATION_SOURCE), fromSafetySource(RISK_GROUP_SOURCE)],
    checkedOn: CONTENT_REVIEW_DATE,
    safetyNote:
      'The cold table is where this collection\'s risk sits. Rakfisk is raw ' +
        'fermented fish and fenalår is a cured meat; both are written around ' +
        'professionally produced product rather than a home cure, and both carry ' +
        'food-safety callouts on their own pages with links to public-health ' +
        'authorities. Read the callout before you buy, store or serve them.',
    recipeSlugs: [
      'ribbe',
      'pinnekjott',
      'lutefisk',
      'reinsdyrstek',
      'rypestek',
      'medisterkaker',
      'surkal',
      'sildesalat',
      'rakfisk',
      'fenalar',
      'riskrem',
      'julekake',
      'pepperkaker',
      'krumkake',
      'berlinerkranser',
      'serinakaker',
      'sandkaker',
      'goro',
      'fattigmann',
      'smultringer',
    ],
  },
  host: {
    title: 'Høst: the weeks that fill the winter larder',
    metaTitle: 'Norwegian Autumn Food: Game, Berries and the Larder',
    metaDescription:
      'Høst is Norway\'s harvest season — ptarmigan and venison, cloudberries and ' +
        'chanterelles, autumn slaughter, cured meats and the root-and-barley pot.',
    standfirst:
      'The busiest weeks of the working year: the hunt, the gathering, the autumn ' +
        'slaughter, and the salt-and-cellar logic that feeds the table until spring.',
    intro: [
      'Høst — autumn — is the shortest of the Norwegian working seasons and the ' +
        'busiest. Between the end of the summer grazing and the first hard frost, a ' +
        'farm household traditionally brought in everything it meant to eat until ' +
        'spring: the animals down from the mountain pasture, the roots out of the ' +
        'ground, the berries off the bog, the fish out of the lake. What survives of ' +
        'that work in the kitchen is not really a set of autumn dishes. It is an ' +
        'autumn logic — salt, smoke, cellar and cold — that goes on shaping the table ' +
        'for the rest of the year.',
      'The game seasons open in early autumn and run on into winter, and the ' +
        'northern kitchen follows them. Rype, the ptarmigan of the high tundra, is ' +
        'the leanest of the birds and the most carefully handled, barded with bacon ' +
        'for rypestek. Hjortestek takes wild red deer from the forest edge and sets ' +
        'it against root purée and a jus sharpened with berries. Reindeer sits ' +
        'slightly apart: in Sápmi it is herded rather than stalked, and the autumn ' +
        'work is a gathering of the herds, but what it puts on the plate — finnbiff, ' +
        'bidos — belongs to the same weeks.',
      'Foraging runs alongside the hunt. Multe, the cloudberry, ripens across the ' +
        'northern bogs in a window of a few weeks from late summer into early autumn, ' +
        'and picking grounds are still spoken of carefully; folded through lightly ' +
        'whipped cream it becomes multekrem. Tyttebær — lingonberries — come later, ' +
        'keep almost indefinitely, and are why a sharp red spoonful sits beside blood ' +
        'pudding, pork and game rather than in a bowl of its own. Kantareller come ' +
        'off the forest floor in the same weeks and go straight into the pan ahead of ' +
        'shaved reindeer.',
      'Then the slaughter. Autumn killing was, in most accounts, a matter of ' +
        'arithmetic: winter fodder was finite, and the animals that could not be ' +
        'carried through were taken in a few concentrated days. What followed was ' +
        'more fresh meat than any household could eat and every by-product it would ' +
        'need. Blood became blodpudding in the eastern valleys and blodklubb in the ' +
        'north, baked, cooled, sliced and fried the next day with lingonberries. Legs ' +
        'went into salt and then into moving air, which is where fenalår and the ' +
        'wider spekemat tradition begin. Trout went down into brine to come out as ' +
        'rakfisk months later, in time for the weeks before Christmas.',
      'What the harvest itself left was roots, cabbage and barley, and the pot ' +
        'cooking that follows is plain and unhurried. Fårikål is the marker — bone-in ' +
        'mutton and cabbage layered with whole peppercorns, and, by common account, a ' +
        'Thursday of its own late in September. Betasuppe simmers lamb and barley ' +
        'with whatever the cellar holds, and bidos does much the same in the Arctic ' +
        'with reindeer and roots. On the southern skerries the crab pots come up ' +
        'heavy as the water cools, and the October opening of the lobster season is ' +
        'the date the whole shore waits on. In the orchards, eplekake and tilslørte ' +
        'bondepiker deal with the windfall.',
      'This collection gathers the recipes in the archive whose own pages already ' +
        'point to autumn — to the hunt, the gathering, the slaughter or the cellar. ' +
        'It is not a complete map of the Norwegian autumn table. Several dishes that ' +
        'belong to the season in practice are left out here because the archive\'s own ' +
        'text places them somewhere else in the year.',
    ],
    glossary: [
      {
        term: 'høst',
        definition:
          'Norwegian for autumn, and for the harvest itself. In food terms it covers ' +
            'the weeks of gathering, hunting and slaughter that traditionally stocked a ' +
            'household through to spring.',
      },
      {
        term: 'multe',
        definition:
          'The cloudberry, an amber bog fruit of the northern uplands, also written ' +
            'molte. It ripens in a short window and is whipped into lightly sweetened ' +
            'cream to make multekrem.',
      },
      {
        term: 'tyttebær',
        definition:
          'The lingonberry, a small tart red berry of the pine and birch forest floor. ' +
            'Barely cooked with sugar, it is the standing sharp note beside game, pork ' +
            'and blood dishes.',
      },
      {
        term: 'rype',
        definition:
          'Ptarmigan, the grouse of high tundra and mountain birch, known as lirype and ' +
            'fjellrype depending on the ground it keeps. Lean and dark, it is roasted for ' +
            'rypestek.',
      },
      {
        term: 'reinsdyr',
        definition:
          'Reindeer. In Sápmi it is herded rather than hunted, and the herds are ' +
            'traditionally gathered in autumn; the meat carries bidos, finnbiff and the ' +
            'north\'s smoked and cured products.',
      },
      {
        term: 'hjort',
        definition:
          'Red deer — hunted, not farmed — and the meat behind hjortestek. Dark, lean ' +
            'and mineral, it is served with root purées and sauces sharpened by wild ' +
            'berries.',
      },
      {
        term: 'kantarell',
        definition:
          'The chanterelle, the golden funnel-shaped mushroom most commonly gathered in ' +
            'Norwegian forest. It is what finnbiff calls for, sautéed in butter before ' +
            'the shaved reindeer goes into the pan.',
      },
      {
        term: 'bygg',
        definition:
          'Barley, long the most dependable cereal of the Norwegian interior. Whole ' +
            'grains thicken betasuppe; milled to barley flour it binds blodklubb into a ' +
            'dense, sliceable dumpling.',
      },
      {
        term: 'spekemat',
        definition:
          'The collective term for salt-cured, air-dried meats — lamb, ham and sausage ' +
            '— sliced and served with flatbread, sour cream and scrambled egg. Curing and ' +
            'drying are what carried meat through winter.',
      },
      {
        term: 'rakfisk',
        definition:
          'Trout salted and fermented cold for months rather than smoked or cooked. ' +
            'Laid down well ahead of Christmas, it is eaten raw in thin slices with ' +
            'flatbread, onion and sour cream.',
      },
    ],
    sources: [fromSafetySource(CDC_PRESERVATION_SOURCE), fromSafetySource(NORWAY_RAKFISK_SOURCE), fromSafetySource(RISK_GROUP_SOURCE)],
    checkedOn: CONTENT_REVIEW_DATE,
    safetyNote:
      'Autumn is the preserving season, and this hub deliberately does not teach ' +
        'preserving. Fenalår, spekemat and rakfisk are each written around ' +
        'professionally produced product and carry their own food-safety callouts. ' +
        'Read the callout on the recipe page before you buy, store or serve them.',
    recipeSlugs: [
      'farikal',
      'rypestek',
      'hjortestek',
      'finnbiff',
      'bidos',
      'multekrem',
      'blodpudding',
      'blodklubb',
      'fenalar',
      'spekemat',
      'rakfisk',
      'betasuppe',
      'kokt-krabbe',
      'sorlandshummer',
      'eplekake',
      'tilslorte-bondepiker',
    ],
  },
}
