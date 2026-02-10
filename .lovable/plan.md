
## Προσθήκη max password validation (16 χαρακτήρες)

Το L2 game server δέχεται passwords 6-16 χαρακτήρες, αλλά στη φόρμα εγγραφής δεν υπάρχει έλεγχος για το μέγιστο μήκος. Αυτό προκαλεί error όταν ο χρήστης βάζει password μεγαλύτερο από 16 χαρακτήρες.

### Αλλαγές στο `src/pages/CreateAccount.tsx`

1. **Client-side validation**: Προσθήκη ελέγχου `password.length > 16` δίπλα στον υπάρχοντα έλεγχο για minimum 6 χαρακτήρες, με μήνυμα "Password must be 6-16 characters"
2. **HTML maxLength**: Προσθήκη `maxLength={16}` στο password input field για να μην αφήνει τον χρήστη να γράψει πάνω από 16 χαρακτήρες
3. **Hint text**: Αλλαγή του placeholder από "At least 6 characters" σε "6-16 characters" για να είναι ξεκάθαρο στον χρήστη

### Τεχνικές λεπτομέρειες

- Γραμμή 46-53: Αλλαγή του validation check από `< 6` σε `< 6 || > 16` με ενημερωμένο μήνυμα
- Γραμμή 209-212: Προσθήκη `maxLength={16}` στο password input και αλλαγή placeholder
- Γραμμή 236: Προσθήκη `maxLength={16}` στο confirm password input
