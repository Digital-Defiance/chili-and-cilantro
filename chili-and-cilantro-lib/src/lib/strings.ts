import { StringLanguages } from './enumerations/string-languages';
import { MasterStringsCollection } from './shared-types';
import BritishEnglishStrings from './strings/english-uk';
import AmericanEnglishStrings from './strings/english-us';
import FrenchStrings from './strings/french';
import MandarinStrings from './strings/mandarin';
import SpanishStrings from './strings/spanish';
import UkrainianStrings from './strings/ukrainian';

export const Strings: MasterStringsCollection = {
  [StringLanguages.EnglishUS]: AmericanEnglishStrings,
  [StringLanguages.EnglishUK]: BritishEnglishStrings,
  [StringLanguages.French]: FrenchStrings,
  [StringLanguages.MandarinChinese]: MandarinStrings,
  [StringLanguages.Spanish]: SpanishStrings,
  [StringLanguages.Ukrainian]: UkrainianStrings,
};
