
# Πλάνο: Αντικατάσταση emoji με custom icons στα Starter Packs

## Τι θα αλλάξει

Θα αντικαταστήσω τα emoji icons (⚔️, 🛡️, 💎, κλπ.) με τα πραγματικά L2 icons που ανέβασες σε όλα τα Starter Pack items, τόσο στην αρχική σελίδα όσο και στο User Control Panel (/ucp).

## Αντιστοίχιση Icons

| Icon | Item |
|------|------|
| weapon_incessantcore_sword_i01.png | Top S84 Weapon {PvP} |
| armor_t97_u_i00.png | Set Top S84 Armor {PvP} |
| Zaken.png | Epic Jewel Pack |
| pve_bonus_i00.png | PvE Damage +15% |
| br_aga_pomona_i00.png | Agathion Helper |
| 1677758101585.png → premium-icon.png | Premium Account 100% |
| Enchant_Bonus.png | Enchant Bonus +10% |
| LovePotion.png | Love Potions |
| GenerosityRune_i00_1.png | Generosity Rune |

## Αρχεία που θα τροποποιηθούν

1. **Νέα assets (9 αρχεία)**
   - Αντιγραφή των icons στο `src/assets/starter-packs/items/`

2. **StarterPacksSection.tsx**
   - Import των νέων item icons
   - Αλλαγή του `icon` field από string (emoji) σε path εικόνας
   - Προσαρμογή του rendering για χρήση `<img>` αντί για text

3. **StarterPacksTab.tsx**  
   - Ίδιες αλλαγές για το UCP

## Visual

Τα icons θα εμφανίζονται σε μέγεθος 20x20px με ελαφρύ drop-shadow για να ταιριάζουν με το gaming aesthetic.

---

**Τεχνικές Λεπτομέρειες**

```text
Δομή φακέλου:
src/assets/starter-packs/
├── basic-badge.png
├── improved-badge.png
├── premium-badge.png
├── elite-badge.png
└── items/
    ├── weapon-icon.png
    ├── armor-icon.png
    ├── jewel-icon.png
    ├── pve-icon.png
    ├── agathion-icon.png
    ├── premium-icon.png
    ├── enchant-icon.png
    ├── love-potion-icon.png
    └── generosity-rune-icon.png
```

**Αλλαγές στο interface:**
```typescript
interface PackItem {
  icon: string; // θα γίνει path για import
  name: string;
  value: string;
  valueColor?: string;
}
```

**Rendering αλλαγή:**
```tsx
// Από:
<span className="text-base">{item.icon}</span>

// Σε:
<img src={item.icon} alt="" className="w-5 h-5 object-contain" />
```
