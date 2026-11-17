// @ts-nocheck
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://hxseqlomulfgmdfsxyze.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_WfbBcf_SjVVqNReJd1UK6g_Rij-mNQc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Item = Record<string, string>;

export const api = {
  async list(c: string): Promise<Item[]> {
    const { data, error } = await supabase.from(c).select('*');
    if (error) {
      console.error(`Error listing ${c}:`, error);
      return [];
    }
    return data || [];
  },

  async save(c: string, it: Item) {
    const itemToSave = { ...it };
    if (!itemToSave.id) {
      itemToSave.id = crypto.randomUUID();
    }
    const { error } = await supabase.from(c).upsert(itemToSave);
    if (error) {
      console.error(`Error saving to ${c}:`, error);
      return false;
    }
    return true;
  },

  async remove(c: string, id: string) {
    const { error } = await supabase.from(c).delete().eq('id', id);
    if (error) {
      console.error(`Error removing from ${c}:`, error);
      return false;
    }
    return true;
  },

  async getSettings(): Promise<Item> {
    const { data, error } = await supabase
      .from('school_texts')
      .select('value')
      .eq('key', 'site_settings')
      .single();
    
    if (error || !data) {
      return { phone: '', email: '', facebook: 'https://www.facebook.com/' };
    }
    try {
      return JSON.parse(data.value);
    } catch {
      return { phone: '', email: '', facebook: 'https://www.facebook.com/' };
    }
  },

  async saveSettings(s: Item) {
    const { error } = await supabase
      .from('school_texts')
      .upsert({ key: 'site_settings', value: JSON.stringify(s) });
    if (error) {
      console.error('Error saving settings:', error);
      return false;
    }
    return true;
  },

  async getTexts(): Promise<Item> {
    const { data, error } = await supabase
      .from('school_texts')
      .select('key, value');
    
    if (error || !data) {
      return {};
    }
    const texts: Record<string, string> = {};
    data.forEach(row => {
      if (row.key !== 'site_settings') {
        texts[row.key] = row.value;
      }
    });
    return texts;
  },

  async setText(k: string, v: string) {
    if (!v) {
      const { error } = await supabase
        .from('school_texts')
        .delete()
        .eq('key', k);
      return !error;
    } else {
      const { error } = await supabase
        .from('school_texts')
        .upsert({ key: k, value: v });
      return !error;
    }
  },

  async saveText(k: string, v: string) {
    return api.setText(k, v);
  },

  async login(u: string, p: string) {
    if (u === 'Admin' && p === 'admin123') {
      sessionStorage.setItem('ms1ok', '1');
      return true;
    }
    return false;
  },

  async setAuth() {
    return true;
  },

  isAuth: () => sessionStorage.getItem('ms1ok') === '1',
  logout: () => sessionStorage.removeItem('ms1ok'),
};

export const readImage = (f: File) => new Promise<string>(res => {
  const r = new FileReader();
  r.onload = () => {
    const i = new Image();
    i.onload = () => {
      const s = Math.min(1, 900 / Math.max(i.width, i.height)), c = document.createElement('canvas');
      c.width = i.width * s; c.height = i.height * s;
      c.getContext('2d')!.drawImage(i, 0, 0, c.width, c.height);
      res(c.toDataURL('image/jpeg', .8));
    };
    i.src = r.result as string;
  };
  r.readAsDataURL(f);
});