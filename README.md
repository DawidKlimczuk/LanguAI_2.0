# 🌍 LanguAI 2.0 — AI-Powered Language Learning Platform

<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/08caf6ed-eeb4-4411-84c4-2783513add60" />
<img width="906" height="865" alt="image" src="https://github.com/user-attachments/assets/c7da9b4e-45ab-4340-a2f9-219d9a974ca1" />


Nowoczesna, pełnoprawna platforma webowa do nauki języków obcych nowej generacji. Aplikacja łączy model generatywny sztucznej inteligencji (**Google Gemini API**) z rozbudowanym systemem grywalizacji, sklepem, rankingami oraz pełną lokalizacją wielojęzyczną (i18n).

> **LanguAI 2.0 to kompletny przepis architektury (Full Rewrite)** — ewolucja z monolitycznego projektu opartego na PHP/Vanilla JS do nowoczesnego stosu opartego na Next.js App Router, TypeScript, Tailwind CSS oraz Prisma ORM na chmurze Supabase/Vercel.
> Link do 1 wersji: https://github.com/DawidKlimczuk/LanguAI

---

## 🚀 Co nowego w LanguAI 2.0? (Changelog & Upgrade)

| Obszar | LanguAI 1.0 (Legacy) | LanguAI 2.0 (Modern Stack) |
| :--- | :--- | :--- |
| **Architektura** | PHP 8.x MVC + Vanilla JS | **Next.js (App Router, Server Actions, React)** |
| **Typowanie** | Brak (Dynamiczne PHP / JS) | **Pełne bezpieczeństwo typów (Strict TypeScript)** |
| **Baza Danych & ORM** | MySQL + surowe PDO | **PostgreSQL (Supabase) + Prisma ORM** z connection poolingiem |
| **Generowanie pytań** | Pojedyncze zapytania per pytanie | **Inteligentny Question Batching (paczki po 20 pytań)** z buforowaniem po stronie klienta |
| **Wielojęzyczność (i18n)** | Interfejs statyczny w 1 języku | **Pełne i18n interfejsu (PL, EN, DE, ES, RU)** z synchronizacją z poziomu modala i paska nawigacji |
| **Stylowanie & UI** | Custom CSS | **Tailwind CSS v4 + Lucide Icons**, responsywny drawer mobilny |
| **Infrastruktura** | Tradycyjny hosting współdzielony | **Edge Deployment na Vercel z CI/CD** z GitHuba |

---

## 🧠 Główne funkcjonalności

### 1. Inteligentny Silnik Nauki (Gemini AI)
* **Paczki pytań w czasie rzeczywistym:** Integracja z Google Gemini API generuje zoptymalizowane, 20-elementowe pule pytań w formacie JSON, eliminując opóźnienia sieciowe przy przechodzeniu między zadaniami.
* **6 języków nauki:** Angielski, Niemiecki, Hiszpański, Włoski, Francuski oraz Polski.
* **Obsługa pomijania (Skip Tokens):** Możliwość zużycia zakupionych żetonów pominięcia do przejścia trudnego pytania z automatycznym fetchowaniem kolejnej puli.

### 2. Grywalizacja
* **System Serc:** Mechanizm 5 żyć regenerowanych po błędach lub odnawianych w sklepie.
* **XP, Poziomy i Pasek Postępu:** Doświadczenie przyznawane dynamicznie za serie poprawnych odpowiedzi i ukończone moduły.
* **Ekonomia wirtualna (Gemy):** Waluta zdobywana za aktywność, umożliwiająca zakupy ulepszeń i customizacji.
* **Osiągnięcia:** System dynamicznych odznak i powiadomień nagradzających kamienie milowe.

### 3. Rywalizacja i Społeczność 
* Tabele wyników aktualizowane w czasie rzeczywistym.
* Filtrowanie rankingu pod kątem poziomu doświadczenia (XP), zamożności (Gemy) oraz postępów w poszczególnych językach.

### 4. Sklep i Personalizacja
* Zakup pakietów odnawiania serc oraz żetonów natychmiastowego pomijania pytań.
* Motywy graficzne aktywowane bezpośrednio z bazy danych użytkownika.

### 5. Bezpieczeństwo i Sesje
* Pełna walidacja formularzy i Server Actions chroniące punkty końcowe.
* Bezpieczne hashowanie haseł przy użyciu biblioteki `bcryptjs`.
* Ochrona zmiennych środowiskowych i kluczy API przed wyciekiem do warstwy klienta.

---

## 🛠️ Stos technologiczny 

* **Framework:** [Next.js](https://nextjs.org/) (React, App Router)
* **Język:** [TypeScript](https://www.typescriptlang.org/)
* **ORM:** [Prisma ORM](https://www.prisma.io/)
* **Baza Danych:** [Supabase PostgreSQL](https://supabase.com/) (z obsługą pgbouncer / transaction pooling)
* **AI:** Google Gemini API
* **Stylowanie:** [Tailwind CSS](https://tailwindcss.com/)
* **Ikony:** [Lucide React](https://lucide.dev/)
* **Autentykacja:** Bcrypt.js + sesyjne Server Actions
* **Hosting:** [Vercel](https://vercel.com/)

---

## 📦 Uruchomienie lokalne

### 1. Sklonuj repozytorium
```bash
git clone [https://github.com/DawidKlimczuk/LanguAI_2.0.git](https://github.com/DawidKlimczuk/LanguAI_2.0.git)
cd LanguAI_2.0
2. Zainstaluj zależności
Bash
npm install
3. Skonfiguruj zmienne środowiskowe
Utwórz plik .env w głównym katalogu projektu:

Fragment kodu
DATABASE_URL="postgresql://user:password@host:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/postgres"
GEMINI_API_KEY="twoj_klucz_gemini_api"
4. Zsynchronizuj schemat bazy danych
Bash
npx prisma db push
npx prisma generate
5. Uruchom serwer developerski
Bash
npm run dev
Aplikacja będzie dostępna pod adresem: http://localhost:3000.
