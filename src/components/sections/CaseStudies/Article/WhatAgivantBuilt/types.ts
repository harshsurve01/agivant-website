export interface BuiltCardItem {
  id: string;
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
}

export interface WhatAgivantBuiltProps {
  title?: string;
  description?: string;
  cards: BuiltCardItem[];
}
